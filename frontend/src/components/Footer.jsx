function Footer() {
  return (
    <footer className="bg-brown/60 backdrop-blur-sm border-t border-cream/10 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-2xl text-cream" style={{ fontFamily: 'Ballet, cursive' }}>
          Nova
        </span>
        <p className="text-cream/50 text-sm">
          Built with ❤️ for smarter studying — Nova © 2026
        </p>
      </div>
    </footer>
  )
}

export default Footer