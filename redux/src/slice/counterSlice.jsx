import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        count: 0,
        history: []
    },
    reducers: {
        increment: (state, action) => {
            state.count += action.payload || 1;
            state.history.push(`+${action.payload || 1}`);
        },
        decrement: (state, action) => {
            state.count -= action.payload || 1;
            state.history.push(`-${action.payload || 1}`);
        },
        undo: (state) => {
            const lastAction = state.history.pop();
            if (!lastAction) return;
            const value = parseInt(lastAction.slice(1));
            if (lastAction.startsWith('+')) {
                state.count -= value;
            } else {
                state.count += value;
            }
        }
    }
});

export const { increment, decrement, undo } = counterSlice.actions;
export default counterSlice.reducer;