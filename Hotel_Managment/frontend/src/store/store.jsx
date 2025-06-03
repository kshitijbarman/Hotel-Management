import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "../slices/darkModeSlice.jsx"; 
 
export const store = configureStore({
    reducer: {
        darkMode: darkModeReducer,  
     
     
    },
});