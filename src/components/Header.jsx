import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

const Header = () => {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Start Quiz', path: '/setup' },
        { label: 'Scoreboard', path: '/scoreboard' }
    ]

    const linkClasses = (path) =>
        `px-4 py-2 rounded-md font-medium ${location.pathname === path
            ? 'bg-yellow-500 text-white'
            : 'text-gray-800 hover:bg-yellow-300'
        }`

    return (
        <header className="bg-yellow-400 shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">⚡ TriviaBolt</h1>

                <nav className="hidden md:flex space-x-4">
                    {navLinks.map((link) => (
                        <Link key={link.path} to={link.path} className={linkClasses(link.path)}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <button
                    className="md:hidden text-gray-800"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <FiMenu size={28} />
                </button>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="bg-white w-2/3 max-w-xs h-full p-6 shadow-lg flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-yellow-400">Menu</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="text-gray-600">
                                <FiX size={24} />
                            </button>
                        </div>
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`py-2 px-3 rounded-md ${location.pathname === link.path
                                            ? 'bg-yellow-400 text-white'
                                            : 'text-gray-800 hover:bg-yellow-300'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
