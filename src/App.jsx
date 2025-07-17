import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Play from './pages/Play'
import Result from './pages/Result'
import NotFound from './pages/NotFound'
import Scoreboard from './pages/Scoreboard'
import { setUsername } from './redux/user/userSlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Setup from './pages/Setup'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const savedUsername = localStorage.getItem('triviabolt-username')
    if (savedUsername) {
      dispatch(setUsername(savedUsername))
    }
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/play" element={<Play />} />
        <Route path="/result" element={<Result />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
