import Datareducer from "../Slices/Dataslice";
import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
    reducer: {
        data: Datareducer,
    },
});
export default store;