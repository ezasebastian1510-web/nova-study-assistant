import { useState, useEffect } from 'react'
import axios from 'axios'

function Library() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingFile, setDeletingFile] = useState(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/documents`)
      setDocuments(response.data.documents)
    } catch (err) {
      setError('Could not load documents. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (filename) => {
    setDeletingFile(filename)
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/documents/${encodeURIComponent(filename)}`)
      setDocuments((prev) => prev.filter((doc) => doc.filename !== filename))
    } catch (err) {
      setError('Failed to delete document.')
    } finally {
      setDeletingFile(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-cream text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        My Documents
      </h1>
      <p className="text-cream/70 text-center mb-10">
        All your uploaded study materials
      </p>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-brown/40 border border-cream/10 rounded-2xl p-6 h-20 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500/40 text-red-200 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && documents.length === 0 && (
        <div className="bg-brown/40 backdrop-blur-sm border border-cream/10 rounded-2xl p-12 text-center">
          <p className="text-cream/70">No documents uploaded yet.</p>
          <a href="/upload" className="inline-block mt-4 bg-olive hover:bg-olive-dark text-white px-6 py-3 rounded-full font-medium transition">
            Upload your first document
          </a>
        </div>
      )}

      {!loading && !error && documents.length > 0 && (
        <div className="space-y-4">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="bg-brown/40 backdrop-blur-sm border border-cream/10 rounded-2xl p-6 flex items-center justify-between hover:border-olive/40 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-olive/20 rounded-full flex items-center justify-center text-xl">
                  📄
                </div>
                <div>
                  <p className="text-cream font-medium">{doc.filename}</p>
                  <p className="text-cream/50 text-sm">{doc.size_kb} KB</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(doc.filename)}
                disabled={deletingFile === doc.filename}
                className="text-red-300 hover:text-red-200 hover:bg-red-900/30 disabled:opacity-40 px-4 py-2 rounded-full text-sm font-medium transition"
              >
                {deletingFile === doc.filename ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Library