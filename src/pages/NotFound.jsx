import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-yellow-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mb-6">
        Looks like the page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-yellow-400 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
