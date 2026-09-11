import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-6xl font-bold text-cream mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          Study Smarter with <span className="text-olive" style={{ fontFamily: 'Ballet, cursive' }}>Nova</span>
        </h1>
        <p className="text-lg text-cream/80 max-w-2xl mx-auto mb-10">
          Upload your notes, ask questions, generate quizzes and flashcards —
          all powered by AI that actually understands your material.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/upload" className="bg-olive hover:bg-olive-dark text-white px-8 py-3 rounded-full font-medium text-lg transition">
            Get Started
          </Link>
          <Link to="/chat" className="border-2 border-cream text-cream hover:bg-cream/10 px-8 py-3 rounded-full font-medium text-lg transition">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-cream text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
          What Nova Can Do
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-brown/40 backdrop-blur-sm border border-cream/10 rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-14 h-14 bg-olive/30 rounded-full flex items-center justify-center mb-4 text-2xl">📄</div>
            <h3 className="text-xl font-semibold text-cream mb-2">Upload Documents</h3>
            <p className="text-cream/70">Upload your notes, textbooks, or PDFs and let Nova process them instantly.</p>
          </div>

          <div className="bg-brown/40 backdrop-blur-sm border border-cream/10 rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-14 h-14 bg-olive/30 rounded-full flex items-center justify-center mb-4 text-2xl">💬</div>
            <h3 className="text-xl font-semibold text-cream mb-2">Ask Anything</h3>
            <p className="text-cream/70">Chat with your documents and get accurate, context-aware answers.</p>
          </div>

          <Link to="/quiz" className="block bg-brown/40 backdrop-blur-sm border border-cream/10 rounded-2xl p-8 hover:shadow-lg hover:border-olive/40 transition">
            <div className="w-14 h-14 bg-olive/30 rounded-full flex items-center justify-center mb-4 text-2xl">🧠</div>
            <h3 className="text-xl font-semibold text-cream mb-2">Test Yourself</h3>
            <p className="text-cream/70">Auto-generate quizzes and flashcards from your uploaded material.</p>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brown/50 backdrop-blur-sm py-20 mt-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-cream mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to study smarter?
          </h2>
          <p className="text-cream/70 mb-8">Upload your first document and see Nova in action.</p>
          <Link to="/upload" className="inline-block bg-olive hover:bg-olive-dark text-white px-8 py-3 rounded-full font-medium text-lg transition">
            Upload Your Notes
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home