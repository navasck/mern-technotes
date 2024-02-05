import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
// This hook is used to access information about the current location in a React component.
// useNavigate() returns an object representing the current URL location.
// if the full URL is "https://example.com/some/path", the pathname would be "/some/path".

import { useNavigate, Link, useLocation } from 'react-router-dom';

import { useSendLogoutMutation } from '../features/auth/authApiSlice';

import useAuth from '../hooks/useAuth';

const DASH_REGEX = /^\/dash(\/)?$/; // This regular expression matches strings that start with "/dash" and optionally end with a trailing forward slash.
const NOTES_REGEX = /^\/dash\/notes(\/)?$/; //  -  '/dash/notes';
const USERS_REGEX = /^\/dash\/users(\/)?$/; //  -  '/dash/users';

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth();
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const handleLogout = async () => {
    try {
      await sendLogout();
      setLogoutSuccess(true); // Update state to trigger navigation
      console.log('logoutSuccess', logoutSuccess);
      navigate('/');
    } catch (error) {
      console.log('error in logout', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  const onNewNoteClicked = () => navigate('/dash/notes/new');
  const onNewUserClicked = () => navigate('/dash/users/new');
  const onNotesClicked = () => navigate('/dash/notes');
  const onUsersClicked = () => navigate('/dash/users');

  let dashClass = null;
  // .test - Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = 'dash-header__container--small';
  }

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className='icon-button'
        title='New Note'
        onClick={onNewNoteClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className='icon-button'
        title='New User'
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
      userButton = (
        <button className='icon-button' title='Users' onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
    notesButton = (
      <button className='icon-button' title='Notes' onClick={onNotesClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className='icon-button' title='Logout' onClick={handleLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? 'errmsg' : 'offscreen';

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className='dash-header'>
        <div className={`dash-header__container ${dashClass}`}>
          <Link to='/dash'>
            <h1 className='dash-header__title'>techNotes</h1>
          </Link>
          <nav className='dash-header__nav'>{buttonContent}</nav>
        </div>
      </header>
    </>
  );

  return content;
};
export default DashHeader;
