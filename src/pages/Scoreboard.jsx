import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ClearScoreboard from '../modals/ClearScoreboard'

const getEmoji = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return ''
}

const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const Scoreboard = () => {
    const [scores, setScores] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showToast, setShowToast] = useState(false)

   useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('triviabolt-scores')) || []

    const validScores = stored.filter(entry => entry.name && entry.name.trim() !== '')

    const sorted = validScores.sort((a, b) => b.score - a.score)
    setScores(sorted.slice(0, 10))

    localStorage.setItem('triviabolt-scores', JSON.stringify(validScores))
}, [])    

    const handleClear = () => {
        localStorage.removeItem('triviabolt-scores')
        setScores([])
        setShowModal(false)
        setShowToast(true)

        setTimeout(() => setShowToast(false), 3000)
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 to-white">
            <Header />

            <main className="flex-grow px-4 py-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 relative"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🏆 Top Scores</h2>

                    {scores.length > 0 ? (
                        <>
                            <ul className="space-y-4">
                                {scores.map((entry, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg shadow-sm"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-yellow-400 text-white font-bold flex items-center justify-center text-lg">
                                                {entry.name[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {entry.name} {getEmoji(index)}
                                                </p>
                                                <p className="text-sm text-gray-500">{formatTime(entry.date)}</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-gray-700">{entry.score}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-6 mx-auto block bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition"
                            >
                                🗑️ Clear Scoreboard
                            </button>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center space-y-4 mt-4"
                        >
                            <p className="text-center text-gray-500 text-lg">
                                No scores yet. Play a game to add yours!
                            </p>
                            <Link
                                to="/play"
                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
                            >
                                🎮 Play Now
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </main>

            <Footer />

            {showModal && <ClearScoreboard handleClear={handleClear} setShowModal={setShowModal} />}
            {showToast && toast.success('✅ Scoreboard cleared successfully!')}
        </div>
    )
}

export default Scoreboard
