import { createSlice } from "@reduxjs/toolkit";

const viewCountSlice = createSlice({
  name: "counter",
  initialState: {
    catViewCount: 0,
    dogViewCount: 0
  },
  reducers: {
    incrementCat: state => {
      state.catViewCount++;
    },
    incrementDog: state => {
      state.dogViewCount++;
    }
  }
});

const { actions, reducer } = viewCountSlice;
export const { incrementCat, incrementDog } = actions;
export default reducer;