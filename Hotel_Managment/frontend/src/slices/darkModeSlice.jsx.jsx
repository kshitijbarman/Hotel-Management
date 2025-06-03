// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     isDarkMode: true, 
// };

// const darkModeSlice = createSlice({
//     name: "darkMode",
//     initialState,
//     reducers: {
//         toggleDarkMode: (state) => {
//             state.isDarkMode = !state.isDarkMode;
//         },
//         setDarkMode: (state, action) => {
//             state.isDarkMode = action.payload;
//         },
//     },
// });

// export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
// export default darkModeSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: {
        isDarkMode: localStorage.getItem('darkMode') ? JSON.parse(localStorage.getItem('darkMode')) : true, // Default to dark mode at 11:10 PM IST
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('darkMode', JSON.stringify(state.isDarkMode));
        },
        setDarkMode: (state, action) => {
            state.isDarkMode = action.payload;
            localStorage.setItem('darkMode', JSON.stringify(state.isDarkMode));
        },
    },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;