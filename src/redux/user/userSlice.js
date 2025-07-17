import { createSlice } from '@reduxjs/toolkit'

const storedUsername = localStorage.getItem('triviabolt-username') || ''

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: storedUsername,
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload
      localStorage.setItem('triviabolt-username', action.payload)
    },
    clearUsername: (state) => {
      state.username = ''
      localStorage.removeItem('triviabolt-username')
    },
  },
})

export const { setUsername, clearUsername } = userSlice.actions
export default userSlice.reducer
