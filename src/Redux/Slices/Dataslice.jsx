import {createSlice} from '@reduxjs/toolkit';
const dataslice = createSlice({
    name: 'data',
    initialState: {
        devices: [],
        requests: [],
        activeConnections: [],
    },
    reducers: {
        setDevices: (state, action) => {
            state.devices = action.payload;
        },
        setRequests: (state, action) => {
            state.requests = action.payload;
        },
        setActiveConnections: (state, action) => {
            state.activeConnections = action.payload;
        },
        addDevice: (state, action) => {
            state.devices.push(action.payload);
        },
        addRequest: (state, action) => {
            state.requests.push(action.payload);
        },
    }
});
export default dataslice.reducer;
export const {
    setDevices,
    setRequests,
    setActiveConnections,
    addDevice,
    addRequest
} = dataslice.actions;