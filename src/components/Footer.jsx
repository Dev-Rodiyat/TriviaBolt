const Footer = () => {
  return (
    <footer className="bg-yellow-100 text-gray-600 text-center py-6 border-t sticky bottom-0">
      <p className="text-sm sm:text-base">
        © {new Date().getFullYear()} TriviaBolt. Built for fun and learning ⚡
      </p>
    </footer>
  )
}

export default Footer
