from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import os
from dotenv import load_dotenv
from groq import Groq
import chromadb
import json
# loads api key from .env file
load_dotenv()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ChromaDB setup - local vector database
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="study_docs")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Hello World! Backend is working"}


def chunk_text(text, chunk_size=500):
    """Converting text into chunks (with the help of word count)"""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # Saves the uploaded file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Extract Text from PDF files
    extracted_text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

    # Splits texts into chunks for better embedding and retrieval
    chunks = chunk_text(extracted_text)

    # stores each and every chunks into chromaDB
    # ChromaDB automatically creates embeddings
    for idx, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk],
            ids=[f"{file.filename}_chunk_{idx}"],
            metadatas=[{"source": file.filename, "chunk_index": idx}]
        )

    return {
        "filename": file.filename,
        "total_chunks": len(chunks),
        "message": "PDF processed and stored successfully!"
    }

@app.get("/documents")
async def get_documents():
    files = os.listdir("uploads")
    documents = []
    for filename in files:
        file_path = f"uploads/{filename}"
        file_size = os.path.getsize(file_path)
        documents.append({
            "filename": filename,
            "size_kb": round(file_size / 1024, 1)
        })
    return {"documents": documents}

@app.post("/cleanup-orphans")
async def cleanup_orphans():
    existing_files = set(os.listdir("uploads"))
    all_items = collection.get(include=["metadatas"])
    
    ids_to_delete = [
        all_items["ids"][i] for i in range(len(all_items["ids"]))
        if all_items["metadatas"][i] and all_items["metadatas"][i].get("source") not in existing_files
    ]
    
    if ids_to_delete:
        collection.delete(ids=ids_to_delete)
    
    return {"message": f"Cleaned up {len(ids_to_delete)} orphaned chunks", "remaining_files": list(existing_files)}

@app.delete("/documents/{filename}")
async def delete_document(filename: str):
    file_path = f"uploads/{filename}"
    
    if os.path.exists(file_path):
        os.remove(file_path)
    
    try:
        all_items = collection.get(include=["metadatas"])
        ids_to_delete = [
            all_items["ids"][i] for i in range(len(all_items["ids"]))
            if all_items["metadatas"][i] and all_items["metadatas"][i].get("source") == filename
        ]
        if ids_to_delete:
            collection.delete(ids=ids_to_delete)
    except Exception as e:
        print(f"ChromaDB cleanup error: {e}")
    
    return {"message": f"{filename} deleted successfully"}

@app.post("/ask")
async def ask_question(question: str, document: str = None):
    if not os.listdir("uploads"):
        return {"answer": "Kindly make sure that the document is uploaded", "sources_used": 0}
    # Finds chunks similar to questions using (semantic search)
    query_params = {"query_texts": [question], "n_results": 3}
    if document:
        query_params["where"] = {"source": document}

    results = collection.query(**query_params)

    relevant_chunks = results["documents"][0]
    context = "\n\n".join(relevant_chunks)

    # Gives Groq AI the  context + question 
    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful study assistant. Answer the question using only the provided context from the document. If the answer is not in the context, say so clearly"
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {question}"
            }
        ]
    )

    answer = response.choices[0].message.content

    return {
        "question": question,
        "answer": answer,
        "sources_used": len(relevant_chunks)
    }
@app.post("/generate-quiz")
async def generate_quiz(document: str = None):
    if not os.listdir("uploads"):
        return {"error": "No documents uploaded yet. Please upload a document first."}

    if document:
        all_items = collection.get(include=["documents"], where={"source": document})
    else:
        all_items = collection.get(include=["documents"])
    
    if not all_items["documents"]:
        return {"error": "No documents uploaded yet. Please upload a document first."}
    
    context = "\n\n".join(all_items["documents"][:10])
    
    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a quiz generator for students. Based on the given context, create exactly 5 multiple choice questions to test understanding. Respond ONLY with valid JSON in this exact format, no extra text: {\"questions\": [{\"question\": \"...\", \"options\": [\"option A\", \"option B\", \"option C\", \"option D\"], \"answer\": \"option A\"}]}"
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nGenerate 5 multiple choice questions based on this content."
            }
        ]
    )
    
    raw_text = response.choices[0].message.content
    cleaned = raw_text.replace("```json", "").replace("```", "").strip()
    
    try:
        quiz_data = json.loads(cleaned)
    except:
        return {"error": "Could not generate quiz. Please try again."}
    
    return quiz_data