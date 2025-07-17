import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setUsername } from '../redux/user/userSlice'
import { setQuizOptions } from '../redux/game/gameSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Setup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [usernameInput, setUsernameInput] = useState('')
    const [category, setCategory] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [type, setType] = useState('multiple')
    const [amount, setAmount] = useState(10)

    useEffect(() => {
        axios
            .get('https://opentdb.com/api_category.php')
            .then((res) => setCategories(res.data.trivia_categories))
            .catch((err) => console.warn('Failed to load categories', err))
    }, [])

    const handleStart = (e) => {
        e.preventDefault()

        if (!usernameInput.trim()) {
            toast.error('Username is required')
            return
        }

        dispatch(setUsername(usernameInput.trim()))
        dispatch(
            setQuizOptions({
                category,
                difficulty,
                type,
                amount,
            })
        )
        navigate('/play')
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-white to-yellow-50">

            <Header />

            <main className="flex-grow flex items-center justify-center px-4">
                <form
                    onSubmit={handleStart}
                    className="w-full max-w-2xl p-8 bg-white shadow-2xl rounded-2xl space-y-6 border border-yellow-100"
                >
                    <h2 className="text-3xl font-extrabold text-center text-yellow-600 tracking-tight">
                        🎯 Set Up Your Quiz
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="col-span-1 sm:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Username</label>
                            <input
                                type="text"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-800 shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                            >
                                <option value="">Any</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                            >
                                <option value="">Any</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Question Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                            >
                                <option value="multiple">Multiple Choice</option>
                                <option value="boolean">True / False</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Number of Questions</label>
                            <input
                                type="number"
                                min={1}
                                max={50}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg rounded-xl shadow-lg transition duration-300 ease-in-out"
                    >
                        🚀 Start Quiz
                    </button>
                </form>
            </main>

            <Footer />
        </div>
    )
}

export default Setup
