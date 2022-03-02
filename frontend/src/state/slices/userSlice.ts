import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
  username: string;
}

const initialState: initialState = {
  username: "",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setUserName } = userSlice.actions;
export default userSlice.reducer;
