import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/rootReducer';
import { increment, decrement } from './store/counterSlice';
import './App.css';

function App(): JSX.Element {
  const counter = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();

  const incrementAction = useCallback(() => {
    dispatch(increment());
  }, [dispatch]);

  const decrementAction = useCallback(() => {
    dispatch(decrement());
  }, [dispatch]);

  console.log('counter:', counter);

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={incrementAction}>increment</button>
        <button onClick={decrementAction}>decrement</button>
        <p>{counter}</p>
      </header>
    </div>
  );
}

export default App;
