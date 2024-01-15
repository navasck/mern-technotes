import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // .unwrap() is used to access the resolved value from a successful promise (resulting from a successful login).
      // .unwrap() - it is a specific feature provided by Redux Toolkit as part of the createAsyncThunk utility.
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  const errClass = errMsg ? 'errmsg' : 'offscreen';

  if (isLoading) return <p>Loading...</p>;

  const content = (
    <section className='public'>
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className='login'>
        {/* 'assertive' indicates that updates to the content inside this <p> element should be announced immediately. */}
        <p ref={errRef} className={errClass} aria-live='assertive'>
          {errMsg}
        </p>

        <form className='form' onSubmit={handleSubmit}>
          <label htmlFor='username'>Username:</label>
          <input
            className='form__input text-black'
            type='text'
            id='username'
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete='off'
            required
          />

          <label htmlFor='password'>Password:</label>
          <input
            className='form__input text-black'
            type='password'
            id='password'
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className='form__submit-button bg-green-900'>Sign In</button>
        </form>
      </main>
      <footer>
        <Link to='/'>Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};
export default Login;

// createAsyncThunk
// createAsyncThunk(type, payloadCreator, options);
// type: A string that will be used as the base action type. It's typically a unique identifier for the asynchronous action.

// payloadCreator: A function that returns a promise. This function is responsible for the asynchronous logic and should return a promise with the data you want to dispatch.

// options: An optional object for additional configuration.

// createAsyncThunk is a helper function provided by Redux Toolkit for creating asynchronous action creators. When you use createAsyncThunk, it automatically generates action creators and reducers for handling asynchronous operations. The .unwrap() method is a part of this utility and is used to extract the fulfilled value from a promise returned by an asynchronous thunk.

// import { createAsyncThunk } from '@reduxjs/toolkit';

// The second argument is the payload creator function
// const myAsyncThunk = createAsyncThunk('myAsyncThunk', async (arg, thunkAPI) => {
//   try {
// Accessing dispatch and getState from thunkAPI
// const { dispatch, getState, extra } = thunkAPI;
//     // Async logic here
//     const response = await someApiCall(arg);
// Dispatching additional actions if needed
// dispatch(someAction());

//     return response.data; // This will be the payload of the fulfilled action
//   } catch (error) {
//     // This will be the payload of the rejected action
//     throw error;
//   }
// });

// Later, you can use this thunk in your components or slices
// dispatch(myAsyncThunk(someArg)).then((result) => { /* handle result */ });

// In this example, myAsyncThunk is a thunk action creator that performs some asynchronous logic (perhaps an API call) and returns a promise. The resolved value of the promise becomes the payload of the dispatched action when the asynchronous operation is successful, while the rejected value becomes the payload if an error occurs.

// The second argument of createAsyncThunk is a function that receives the arguments passed to the thunk when it's dispatched, and thunkAPI, which provides various utilities including dispatch, getState, and extra.

// thunkAPI provides access to dispatch and getState, which can be useful for more complex asynchronous logic or for interacting with the Redux store within your thunk. It allows you to have more control and flexibility when working with asynchronous actions in Redux.
