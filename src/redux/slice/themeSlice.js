import { createSlice } from "@reduxjs/toolkit";

// Helper to load from localStorage
const getInitialDarkMode = () => {
  const saved = localStorage.getItem("darkMode");
  return saved === "true"; // Ensures it's a boolean
};

const initialState = {
  darkMode: getInitialDarkMode(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
