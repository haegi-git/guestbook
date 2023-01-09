import { configureStore, createSlice } from "@reduxjs/toolkit";

const userData = createSlice({
  name: "userData",
  initialState: {
    userName: "",
    userUid: "",
    userPhoto: "",
  },
  reducers: {
    getUserData(state, action) {
      const userState = action.payload;
      state.userName = userState.userName;
      state.userUid = userState.userUid;
      state.userPhoto = userState.userPhoto;
    },
    removeUserData(state, action) {
      const userState = action.payload;
      state.userName = userState.userName;
      state.userUid = userState.userUid;
      state.userPhoto = userState.userPhoto;
    },
  },
});

const createInput = createSlice({
  name: "createInput",
  initialState: {
    createTitle: "",
    createContent: "",
  },
  reducers: {
    setCreateInput(state, action) {
      const getCreateInput = action.payload;
      state.createTitle = getCreateInput.createTitle;
      state.createContent = getCreateInput.createContent;
    },
    resetInput(state, action) {
      const resetInputData = action.payload;
      state.createTitle = resetInputData.createTitle;
      state.createContent = resetInputData.createContent;
    },
  },
});

export default configureStore({
  reducer: { userData: userData.reducer, createInput: createInput.reducer },
});

export const { getUserData, removeUserData } = userData.actions;
export const { setCreateInput, resetInput } = createInput.actions;
