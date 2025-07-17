import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchQuestions,
  resetGame,
  nextQuestion,
} from '../redux/game/gameSlice'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QuestionCard from '../components/QuestionCard'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Play = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    questions,
    currentQuestionIndex,
    score,
    status,
    error,
    isGameOver,
    options,
  } = useSelector((state) => state.game)
  const username = useSelector((state) => state.user.username)

  useEffect(() => {
    if (!username.trim()) {
      toast.error('Please enter your username on the setup page!')
      navigate('/setup')
      return
    }

    dispatch(resetGame())
    dispatch(fetchQuestions(options)) // ✅ Use options from Redux state
  }, [dispatch, username, navigate, options])

  useEffect(() => {
    if (isGameOver && questions.length > 0) {
      navigate('/result')
    }
  }, [isGameOver, questions.length, navigate])

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(nextQuestion())
    }
  }

  if (questions.length === 0 && !isGameOver) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <ClipLoader />
      </div>
    )
  }

  const greetings = [
    'Let’s go,',
    'Good luck,',
    'You got this,',
    'Time to shine,',
    'All the best,',
    'Ready to win,',
    'Let the game begin,',
    'Crush it,',
    'Show your brain power,',
    'Be unstoppable,',
  ]
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 to-white">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {randomGreeting}{' '}
            <span className="text-yellow-500 font-bold">
              {username.charAt(0).toUpperCase() + username.slice(1)}
            </span>
            !
          </h2>
        </motion.div>

        {status === 'loading' && (
          <p className="text-lg text-gray-600">Loading questions...</p>
        )}
        {status === 'failed' && <p className="text-red-500">{error}</p>}

        {status === 'succeeded' && questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            currentIndex={currentQuestionIndex}
            total={questions.length}
            onNext={handleNext}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Play
