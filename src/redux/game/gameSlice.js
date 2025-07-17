import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import fallbackQuestions from '../../data/fallbackQuestions'

function decodeHtml(html) {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5)
}

export const fetchQuestions = createAsyncThunk(
    'game/fetchQuestions',
    async (options, { rejectWithValue }) => {
        try {
            const { category, difficulty, type, amount } = options
            const query = new URLSearchParams()

            if (category) query.append('category', category)
            if (difficulty) query.append('difficulty', difficulty)
            if (type) query.append('type', type)
            query.append('amount', amount)

            const response = await axios.get(`https://opentdb.com/api.php?${query}`)

            const rawQuestions = response.data.results

            if (!rawQuestions || response.data.response_code !== 0) {
                throw new Error('API returned no results')
            }

            const processed = rawQuestions.map((q) => {
                const allAnswers = [...q.incorrect_answers, q.correct_answer]
                const decodedAnswers = allAnswers.map(decodeHtml)
                return {
                    ...q,
                    question: decodeHtml(q.question),
                    correct_answer: decodeHtml(q.correct_answer),
                    incorrect_answers: q.incorrect_answers.map(decodeHtml),
                    answers: shuffleArray(decodedAnswers),
                }
            })

            return processed
        } catch (err) {
            if (err.response?.status === 429) {
                toast.warn('API limit reached — using fallback questions.')

                const processedFallback = fallbackQuestions.map((q) => {
                    const allAnswers = [...q.incorrect_answers, q.correct_answer]
                    const decodedAnswers = allAnswers.map(decodeHtml)
                    return {
                        ...q,
                        question: decodeHtml(q.question),
                        correct_answer: decodeHtml(q.correct_answer),
                        incorrect_answers: q.incorrect_answers.map(decodeHtml),
                        answers: shuffleArray(decodedAnswers),
                    }
                })

                return processedFallback
            }
            return rejectWithValue(err.message || 'Failed to fetch questions')
        }
    }
)

const initialState = {
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    userAnswers: [],
    score: 0,
    isGameOver: false,
    status: 'idle',
    error: null,
    options: null,
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        selectAnswer: (state, action) => {
            state.selectedAnswer = action.payload
            const current = state.questions[state.currentQuestionIndex]
            state.userAnswers.push({
                question: current.question,
                selected: action.payload,
                correct: current.correct_answer,
            })

            if (action.payload === current.correct_answer) {
                state.score += 1
            }
        },
        nextQuestion: (state) => {
            if (state.currentQuestionIndex < state.questions.length - 1) {
                state.currentQuestionIndex += 1
                state.selectedAnswer = null
            } else {
                state.isGameOver = true

                const scores = JSON.parse(localStorage.getItem('triviabolt-scores')) || []
                const username = localStorage.getItem('triviabolt-username') || ''

                if (username.trim()) {
                    scores.push({
                        name: username,
                        score: state.score,
                        date: Date.now(),
                    })
                    localStorage.setItem('triviabolt-scores', JSON.stringify(scores))
                }
            }
        },
        setQuizOptions: (state, action) => {
            state.options = action.payload
        },
        resetGame: () => ({ ...initialState }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.questions = action.payload
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    },
})

export const { selectAnswer, nextQuestion, resetGame, setQuizOptions } = gameSlice.actions
export default gameSlice.reducer
