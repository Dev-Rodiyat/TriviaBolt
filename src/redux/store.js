import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './quiz/quizSlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
});
