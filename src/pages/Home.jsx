import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBolt, FaUser, FaCheckCircle, FaHistory } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setUsername } from '../redux/user/userSlice'

const Home = () => {
    const howItWorks = [
        {
            icon: <FaUser className="text-yellow-400 text-3xl mb-3" />,
            title: 'Enter Your Name',
            description: 'Start by typing your name to personalize your game experience.',
        },
        {
            icon: <FaCheckCircle className="text-yellow-400 text-3xl mb-3" />,
            title: 'Answer Questions',
            description: 'Questions appear one at a time — pick the correct answer to score!',
        },
        {
            icon: <FaHistory className="text-yellow-400 text-3xl mb-3" />,
            title: 'Track Your Score',
            description: 'Your score is saved locally so you can beat your best anytime.',
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-200">
            <Header />

            <main className="flex-grow flex flex-col items-center px-4 py-16 text-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-12"
                >
                    <div className="flex justify-center items-center mb-4">
                        <FaBolt className="text-yellow-400 text-5xl animate-bounce drop-shadow-md" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                        Welcome to <span className="text-yellow-400">TriviaBolt</span> ⚡
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        A fast-paced quiz game to test your smarts, race the clock, and crush your high score!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="w-full max-w-sm mb-8 pt-8"
                >
                    <Link to='/setup'>
                        <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-md w-full transition duration-200"
                        >
                            Start Quiz
                        </button>
                    </Link>
                </motion.div>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl md:pt-20"
                >
                    {howItWorks.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded-xl shadow-lg transition duration-300"
                        >
                            {item.icon}
                            <h4 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </motion.div>
                    ))}
                </motion.section>
            </main>

            <Footer />
        </div>
    )
}

export default Home
