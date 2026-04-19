import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, undo } from '../slice/counterSlice'
import { useState } from 'react'
// useSelector is a hook that allows us to extract data from the Redux store state, using a selector function. The selector function receives the entire store state as its argument and returns the part of the state that we want to use in our component.
// useDispatch is a hook that gives us access to the dispatch function, which we can use to dispatch actions to the Redux store. 

const Counter = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.counter.count);
  const history = useSelector((state) => state.counter.history);
  const [amount, setAmount] = useState(1)

    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-80 text-center">
          <h1 className="text-xl font-bold mb-4">Counter</h1>
          <div className="text-4xl font-bold mb-6">Count: {value}</div>

          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => dispatch(increment())}
              className="bg-green-500 text-white px-3 py-2 rounded"
            >
              +1
            </button>

            <button
              onClick={() => dispatch(decrement())}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              -1
            </button>

            <div className="mb-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="border rounded px-3 py-2 w-full"
                min="1"
              />
            </div>

            <button
              onClick={() => dispatch(increment(amount))}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              +{amount}
            </button>

            <button
              onClick={() => dispatch(decrement(amount))}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              -{amount}
            </button>

            <button
              onClick={() => dispatch(undo())}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            >
              Undo
            </button>
          </div>

          <h2>History:</h2>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    )
}

export default Counter
