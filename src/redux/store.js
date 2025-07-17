import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import gameReducer from './game/gameSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    game: gameReducer,
  },
})
