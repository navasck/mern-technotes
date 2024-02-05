import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';

const PersistLogin = () => {
  const [persist] = usePersist();
  // this is the current toke that we received, its an accessToken
  const token = useSelector(selectCurrentToken);
  // for handling strict mode in react 18
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);
  // isUninitialized - our refresh function has not been called yet. its a state that we are going to use, A boolean that indicates whether the query is in its initial state.
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // React 18 Strict Mode , its happens only in development mode
      //

      const verifyRefreshToken = async () => {
        console.log('verifying refresh token');
        try {
          //const response =
          await refresh();
          //const { accessToken } = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };
      // when we refresh the page, the state is wiped out. you have no access token or any other state at that point. then we will call verifyRefreshToken() function.
      // it gets our cookies back, that contains the refresh token, then it gives access to all other state, because it gives us new access token.
      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    // persist: no
    console.log('no persist');
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    console.log('loading');
    content = <p>Loading...</p>;
  } else if (isError) {
    //persist: yes, token: no
    // this gonna happen when our refresh token expires.
    console.log('error');
    content = (
      <p className='errmsg'>
        {`${error?.data?.message} - `}
        <Link to='/login'>Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log('success');
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log('token and uninit');
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;

// this is the component that going to help us remain logged-in even when we refresh our application.
// this component is a wrapper around everything we want to persist, we need this token for
