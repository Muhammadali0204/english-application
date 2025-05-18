import { createSlice } from '@reduxjs/toolkit';
import { User } from 'types/user';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { clearUser, setUser } = authSlice.actions;
export default authSlice.reducer;
