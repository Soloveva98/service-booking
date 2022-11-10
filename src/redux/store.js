import { configureStore } from "@reduxjs/toolkit";
import { roomsReducer } from "./slices/rooms";
import { authReducer } from "./slices/auth";

const store = configureStore({
	reducer: {
		rooms: roomsReducer,
		auth: authReducer,
	}
});

export default store;