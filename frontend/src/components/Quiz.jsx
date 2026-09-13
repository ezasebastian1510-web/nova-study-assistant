import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Quiz() {
  const [quiz, setQuiz] = useState(() => {
    const saved = localStorage.getItem('nova-quiz')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem('nova-quiz-answers')
    return saved ? JSON.parse(saved) : {}
  })
  const [submitted, setSubmitted] = useState(() => {
    const saved = localStorage.getItem('nova-quiz-submitted')
    return saved ? JSON.parse(saved) : false
  })
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState('')

  useEffect(() => {
    localStorage.setItem('nova-quiz', JSON.stringify(quiz))
  }, [quiz])

  useEffect(() => {
    localStorage.setItem('nova-quiz-answers', JSON.stringify(selectedAnswers))
  }, [selectedAnswers])

  useEffect(() => {
    localStorage.setItem('nova-quiz-submitted', JSON.stringify(submitted))
  }, [submitted])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/documents`)
      .then((res) => setDocuments(res.data.documents))
      .catch(() => {})
  }, [])

  const generateQuiz = async () => {
    setLoading(true)
    setError(null)
    setQuiz(null)
    setSubmitted(false)
    setSelectedAnswers({})

    try {
      let url =  `${import.meta.env.VITE_API_URL}/generate-quiz`
      if (selectedDoc) {
        url += `?document=${encodeURIComponent(selectedDoc)}`
      }
      const response = await axios.post(url)
      if (response.data.error) {
        setError(response.data.error)
      } else {
        setQuiz(response.data.questions)
      }
    } catch (err) {
      setError('Failed to generate quiz. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = (qIndex, option) => {
    if (submitted) return
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }))
  }

  const calculateScore = () => {
    if (!quiz) return 0
    return quiz.reduce((score, q, idx) => {
      return selectedAnswers[idx] === q.answer ? score + 1 : score
    }, 0)
  }

  const clearQuiz = () => {
    setQuiz(null)
    setSelectedAnswers({})
    setSubmitted(false)
    localStorage.removeItem('nova-quiz')
    localStorage.removeItem('nova-quiz-answers')
    localStorage.removeItem('nova-quiz-submitted')
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-cream/60 hover:text-cream text-sm transition">
          ← Back to Home
        </Link>
        {quiz && (
          <button
            onClick={clearQuiz}
            className="text-cream/60 hover:text-red-300 text-sm transition"
          >
            Clear Quiz
          </button>
        )}
      </div>

      <h1 className="text-4xl font-bold text-cream text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        Test Yourself
      </h1>
      <p className="text-cream/70 text-center mb-6">
        Generate a quiz based on your uploaded documents
      </p>

      {!quiz && (
        <div className="text-center">
          <div className="mb-6 max-w-sm mx-auto">
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

          <button
            onClick={generateQuiz}
            disabled={loading}
            className="bg-olive hover:bg-olive-dark disabled:opacity-40 text-white px-8 py-3 rounded-full font-medium text-lg transition"
          >
            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-900/30 border border-red-500/40 text-red-200 px-6 py-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {quiz && (
        <div className="space-y-6">
          {quiz.map((q, idx) => (
            <div key={idx} className="bg-brown/40 backdrop-blur-sm border border-cream/10 rounded-2xl p-6">
              <p className="text-cream font-medium mb-4">
                {idx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option, oIdx) => {
                  const isSelected = selectedAnswers[idx] === option
                  const isCorrect = option === q.answer
                  let optionStyle = 'border-cream/20 text-cream/80 hover:border-olive/50'

                  if (submitted) {
                    if (isCorrect) optionStyle = 'border-green-500 bg-green-900/20 text-green-200'
                    else if (isSelected && !isCorrect) optionStyle = 'border-red-500 bg-red-900/20 text-red-200'
                  } else if (isSelected) {
                    optionStyle = 'border-olive bg-olive/20 text-cream'
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => selectAnswer(idx, option)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition ${optionStyle}`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <div className="text-center">
              <button
                onClick={() => setSubmitted(true)}
                className="bg-cream hover:bg-cream-dark text-brown px-8 py-3 rounded-full font-medium text-lg transition"
              >
                Submit Answers
              </button>
            </div>
          ) : (
            <div className="text-center bg-olive/20 border border-olive/40 rounded-2xl p-6">
              <p className="text-2xl font-bold text-cream mb-2">
                Score: {calculateScore()} / {quiz.length}
              </p>
              <button
                onClick={generateQuiz}
                className="mt-2 bg-olive hover:bg-olive-dark text-white px-6 py-3 rounded-full font-medium transition"
              >
                Generate New Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Quiz