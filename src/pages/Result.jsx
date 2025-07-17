import { useSelector, useDispatch } from 'react-redux'
import { resetGame } from '../redux/game/gameSlice'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '@react-hook/window-size'

export default function Result() {
    const { score, questions, userAnswers, isGameOver } = useSelector((state) => state.game)
    const username = useSelector((state) => state.user.username)
    const hasSavedScore = useRef(false)
    const dispatch = useDispatch()
    const [showConfetti, setShowConfetti] = useState(false)
    const [width, height] = useWindowSize()

    const handleReset = () => {
        dispatch(resetGame())
    }

    useEffect(() => {
        if (!isGameOver || !username.trim() || score === 0 || hasSavedScore.current) return

        const storedScores = JSON.parse(localStorage.getItem('triviabolt-scores')) || []

        const newScore = {
            name: username,
            score,
            date: new Date().toISOString(),
        }

        localStorage.setItem('triviabolt-scores', JSON.stringify([newScore, ...storedScores]))

        hasSavedScore.current = true

        setShowConfetti(true)
        const timer = setTimeout(() => setShowConfetti(false), 4000)

        return () => clearTimeout(timer)
    }, [isGameOver, score, username])

    const getFeedbackMessage = (score, total, username) => {
        const percentage = (score / total) * 100

        const highlight = (
            <span className="text-yellow-300">
                {username}
            </span>
        )

        if (percentage >= 90) {
            return <>🥇 Outstanding, {highlight}! You're a trivia master!</>
        } else if (percentage >= 70) {
            return <>🎉 Great job, {highlight}! You did really well!</>
        } else if (percentage >= 50) {
            return <>👏 Not bad, {highlight}! You're getting there!</>
        } else {
            return <>💡 Keep going, {highlight}! Practice makes perfect.</>
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 to-white">
            <Header />

            {showConfetti && <Confetti width={width} height={height} />}

            <main className="flex-grow max-w-3xl mx-auto px-6 py-12">
                <div className="text-center mb-10">
                    <h1 className="sm:text-3xl text-2xl font-extrabold text-gray-800 mb-4">
                        {getFeedbackMessage(score, questions.length, username)}
                    </h1>

                    <p className="text-lg text-gray-700">
                        You scored <span className="font-bold text-blue-600">{score} / {questions.length}</span>
                    </p>
                </div>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">🔍 Answer Review</h2>
                    <div className="space-y-5">
                        {userAnswers.map((ans, i) => (
                            <div
                                key={i}
                                className="p-5 rounded-2xl shadow-md border border-gray-100 bg-white"
                            >
                                <p className="font-medium text-gray-800">
                                    {i + 1}. {ans.question}
                                </p>
                                <p className={`mt-2 ${ans.selected === ans.correct ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}`}>
                                    Your Answer: {ans.selected}
                                </p>
                                {ans.selected !== ans.correct && (
                                    <p className="text-sm text-green-700 mt-1">Correct Answer: {ans.correct}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/play"
                        onClick={handleReset}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition"
                    >
                        🔁 Play Again
                    </Link>
                    <Link
                        to="/scoreboard"
                        className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition"
                    >
                        🏆 View Scoreboard
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}
