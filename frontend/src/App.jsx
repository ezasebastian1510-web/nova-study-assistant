import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Upload from './components/Upload'
import Chat from './components/Chat'
import Library from './components/Library'
import bgImage from './assets/bg.jpg'
import Footer from './components/Footer'
import Quiz from './components/Quiz'

function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/library" element={<Library />} />
        
      </Routes>
      <Footer />
      
    </div>
  )
}

export default App