import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DASH_REGEX = /^\/dash(\/)?$/; // This regular expression matches strings that start with "/dash" and optionally end with a trailing forward slash.
const NOTES_REGEX = /^\/dash\/notes(\/)?$/; //  -  '/dash/notes';
const USERS_REGEX = /^\/dash\/users(\/)?$/; //  -  '/dash/users';

const DashHeader = () => {
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate();
  // This hook is used to access information about the current location in a React component.
  // useNavigate() returns an object representing the current URL location.
  // if the full URL is "https://example.com/some/path", the pathname would be "/some/path".
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const handleLogout = async () => {
    try {
      await sendLogout();
      setLogoutSuccess(true); // Update state to trigger navigation
      console.log('logoutSuccess', logoutSuccess);
      // navigate('/');
    } catch (error) {
      console.log('error in logout', error);
    }
  };

  useEffect(() => {
    if (logoutSuccess) navigate('/');
  }, [navigate, logoutSuccess]);

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  let dashClass = null;
  // .test - Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = 'dash-header__container--small';
  }

  const logoutButton = (
    <button className='icon-button' title='Logout' onClick={handleLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const content = (
    <header className='dash-header'>
      <div className={`dash-header__container ${dashClass}`}>
        <Link to='/dash'>
          <h1 className='dash-header__title'>techNotes</h1>
        </Link>
        <nav className='dash-header__nav'>
          {/* add more buttons later */}
          {logoutButton}
        </nav>
      </div>
    </header>
  );

  return content;
};
export default DashHeader;
