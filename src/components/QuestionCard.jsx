import { useSelector, useDispatch } from 'react-redux'
import { selectAnswer, nextQuestion } from '../redux/game/gameSlice'

const QuestionCard = () => {
  const dispatch = useDispatch()
  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    isGameOver,
    status,
  } = useSelector((state) => state.game)

  if (status === 'loading') return <p className="text-center">Loading questions...</p>
  if (status === 'failed') return <p className="text-center text-red-500">Failed to load questions.</p>
  if (isGameOver) return <p className="text-center text-xl font-semibold">Game Over! 🎉</p>

  const current = questions[currentQuestionIndex]

  const handleSelect = (answer) => {
    if (!selectedAnswer) dispatch(selectAnswer(answer))
  }

  return (
    <div className="bg-white shadow-md rounded-md p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Question {currentQuestionIndex + 1} of {questions.length}
      </h2>
      <p className="text-lg mb-6 text-gray-800">{current.question}</p>

      <div className="space-y-3">
        {current.answers.map((answer, index) => {
          const isCorrect = answer === current.correct_answer
          const isSelected = answer === selectedAnswer

          let buttonClass =
            'w-full px-4 py-2 rounded-md border transition duration-200 text-left'

          if (selectedAnswer) {
            if (isSelected && isCorrect) {
              buttonClass += ' bg-green-100 border-green-500 text-green-700'
            } else if (isSelected && !isCorrect) {
              buttonClass += ' bg-red-100 border-red-500 text-red-700'
            } else if (isCorrect) {
              buttonClass += ' bg-green-50 border-green-400 text-green-600'
            } else {
              buttonClass += ' bg-gray-100 border-gray-300 text-gray-600'
            }
          } else {
            buttonClass += ' hover:bg-yellow-100 border-gray-300'
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleSelect(answer)}
              disabled={!!selectedAnswer}
            >
              {answer}
            </button>
          )
        })}
      </div>

      {selectedAnswer && (
        <button
          className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-6 rounded-md"
          onClick={() => dispatch(nextQuestion())}
        >
          Next
        </button>
      )}
    </div>
  )
}

export default QuestionCard
