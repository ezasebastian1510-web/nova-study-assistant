import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Upload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setResult(null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(response.data)
    } catch (err) {
      setError('Upload failed. Make sure the backend server is running.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <Link to="/" className="inline-flex items-center gap-2 text-cream/60 hover:text-cream mb-6 text-sm transition">
        ← Back to Home
      </Link>
      <h1 className="text-4xl font-bold text-cream text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        Upload Your Notes
      </h1>
      <p className="text-cream/70 text-center mb-10">
        Upload a PDF and let Nova process it for you
      </p>

      {/* Upload Box */}
      <div className="bg-brown/40 backdrop-blur-sm border-2 border-dashed border-olive/40 rounded-2xl p-12 text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          id="fileInput"
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer inline-block bg-olive hover:bg-olive-dark text-white px-6 py-3 rounded-full font-medium transition"
        >
          Choose PDF File
        </label>

        {file && (
          <p className="text-cream/80 mt-4">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="bg-cream hover:bg-cream-dark disabled:opacity-40 disabled:cursor-not-allowed text-brown px-8 py-3 rounded-full font-medium transition"
          >
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-900/30 border border-red-500/40 text-red-200 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Success Result */}
      
      {result && (
        <div className="mt-6 bg-olive/20 border border-olive/40 text-cream px-6 py-4 rounded-xl text-center">
          <p className="font-semibold mb-1">✅ Upload Successful!</p>
          <p className="text-sm text-cream/80 mb-4">{result.filename} is ready to use</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/chat" className="bg-olive hover:bg-olive-dark text-white px-5 py-2 rounded-full text-sm font-medium transition">
            Go to Chat →
          </Link>
          <Link to="/quiz" className="bg-cream hover:bg-cream-dark text-brown px-5 py-2 rounded-full text-sm font-medium transition">
            Take a Quiz →
          </Link>
    </div>
  </div>
)}
      
    </div>
  )
}

export default Upload