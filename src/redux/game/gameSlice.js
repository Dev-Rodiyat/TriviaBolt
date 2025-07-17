import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const fallbackQuestions = [
    {
        category: 'General Knowledge',
        type: 'multiple',
        difficulty: 'easy',
        question: 'What is the capital of France?',
        correct_answer: 'Paris',
        incorrect_answers: ['Lyon', 'Marseille', 'Nice'],
        answers: shuffleArray(['Paris', 'Lyon', 'Marseille', 'Nice']),
    },
    {
        category: 'Science & Nature',
        type: 'multiple',
        difficulty: 'easy',
        question: 'What gas do plants absorb from the atmosphere?',
        correct_answer: 'Carbon Dioxide',
        incorrect_answers: ['Oxygen', 'Nitrogen', 'Helium'],
        answers: shuffleArray(['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Helium']),
    },
]

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
    async ({ amount = 10, category = '', difficulty = '', type = 'multiple' }) => {
        try {
            const url = `https://opentdb.com/api.php?amount=${amount}&type=${type}${category ? `&category=${category}` : ''
                }${difficulty ? `&difficulty=${difficulty}` : ''}`

            const response = await axios.get(url)

            const decodedQuestions = response.data.results.map((q) => {
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

            return decodedQuestions
        } catch (error) {
            console.warn('⚠️ API failed, using fallback questions:', error.message)
            return fallbackQuestions
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
  options: null
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
                scores.push({
                    name: '',
                    score: state.score,
                    date: Date.now(),
                })
                localStorage.setItem('triviabolt-scores', JSON.stringify(scores))
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
