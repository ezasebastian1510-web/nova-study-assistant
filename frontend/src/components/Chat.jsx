import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Chat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('nova-chat-history')
    return saved ? JSON.parse(saved) : [
      { role: 'ai', text: "Hi! I'm Nova. Upload a document and ask me anything about it." }
    ]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    localStorage.setItem('nova-chat-history', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/documents')
      .then((res) => setDocuments(res.data.documents))
      .catch(() => {})
  }, [])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', text: input }
    setMessages((prev) => [...prev, userMessage])
    const question = input
    setInput('')
    setLoading(true)

    try {
      let url = `http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`
      if (selectedDoc) {
        url += `&document=${encodeURIComponent(selectedDoc)}`
      }
      const response = await axios.post(url)
      const aiMessage = { role: 'ai', text: response.data.answer }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: "Sorry, something went wrong. Make sure the backend is running and a document is uploaded." }
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    const initial = [{ role: 'ai', text: "Hi! I'm Nova. Upload a document and ask me anything about it." }]
    setMessages(initial)
    localStorage.removeItem('nova-chat-history')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between mb-2">
        <Link to="/" className="inline-flex items-center gap-2 text-cream/60 hover:text-cream text-sm transition">
          ← Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-cream/60 hover:text-red-300 text-sm transition px-3 py-2"
          >
            Clear Chat
          </button>
          <Link to="/quiz" className="inline-flex items-center gap-2 bg-olive hover:bg-olive-dark text-white px-4 py-2 rounded-full text-sm font-medium transition">
            Take a Quiz →
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-cream text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        Chat with <span style={{ fontFamily: 'Ballet, cursive' }} className="text-olive text-4xl">Nova</span>
      </h1>

      {/* Document Selector */}
      <div className="mb-4">
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
          className="w-full bg-brown/40 backdrop-blur-sm border border-cream/20 text-cream rounded-full px-5 py-2 text-sm focus:outline-none focus:border-olive"
        >
          <option value="" className="bg-brown text-cream">All Documents</option>
          {documents.map((doc, idx) => (
            <option key={idx} value={doc.filename} className="bg-brown text-cream">
              {doc.filename}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto bg-brown/30 backdrop-blur-sm border border-cream/10 rounded-2xl p-6 mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-5 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-olive text-white rounded-br-sm'
                  : 'bg-cream/10 text-cream rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-cream/10 text-cream/60 px-5 py-3 rounded-2xl rounded-bl-sm">
              Nova is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          className="flex-1 bg-brown/40 backdrop-blur-sm border border-cream/20 text-cream placeholder-cream/40 rounded-full px-6 py-3 focus:outline-none focus:border-olive"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-olive hover:bg-olive-dark disabled:opacity-40 text-white px-6 py-3 rounded-full font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat