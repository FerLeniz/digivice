import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLikedCards: (state, action) => {
      if (state.user) {
        state.user.likedCards = action.payload; 
      }
    },
    toggleLike: (state, action) => {
      if (state.user) {
        const cardId = action.payload;
        if (state.user.likedCards.includes(cardId)) {
          state.user.likedCards = state.user.likedCards.filter(id => id !== cardId); // Unlike
        } else {
          state.user.likedCards.push(cardId); // Like
        }
      }
    }
  },
});

export const { loginSuccess, logout, setLikedCards, toggleLike } = authSlice.actions;
export default authSlice.reducer;
