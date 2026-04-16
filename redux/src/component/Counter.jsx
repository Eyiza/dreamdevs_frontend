import { increment, decrement } from '../slice/counterSlice'
import { useSelector, useDispatch } from 'react-redux'

const Counter = () => {
  const value = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();
console.log(value);

  return (
    <div>
        <h1>Counter</h1>
        <p>count: {value}</p>
        <button onClick={() => dispatch(increment())}>Increment+</button>
        <button onClick={() => dispatch(decrement())}>Decrement-</button>
    </div>
  )
}

export default Counter
