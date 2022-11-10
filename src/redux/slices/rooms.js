import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "..//..//axios";

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
	const { data } = await axios.get('/rooms');
	return data;
})


const initialState = {
	rooms: {
		items: [],
		status: 'loading'
	},
};

const roomsSlice = createSlice({
	name: 'rooms',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchRooms.pending]: (state) => {
			state.rooms.items = [];
			state.rooms.status = 'loading';
		},
		[fetchRooms.fulfilled]: (state, action) => {
			state.rooms.items = action.payload;
			state.rooms.status = 'loaded';
		},
		[fetchRooms.rejected]: (state) => {
			state.rooms.items = [];
			state.rooms.status = 'error';
		}
	}
});

export const roomsReducer = roomsSlice.reducer;