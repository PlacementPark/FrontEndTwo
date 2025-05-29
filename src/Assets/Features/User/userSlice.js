import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  employeeType: "",
  userMail: "",
  userid: "",
  username: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      const { employeeType, userMail, userid, username } = payload;
      state.employeeType = employeeType;
      state.userMail = userMail;
      state.userid = userid;
      state.username = username;
    },
    
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
