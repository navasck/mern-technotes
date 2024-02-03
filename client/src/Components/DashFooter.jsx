import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const DashFooter = () => {
  const { username, status } = useAuth();
  // The useNavigate hook is used to programmatically navigate to different pages or routes in your application.
  const navigate = useNavigate();
  // useLocation is a hook from 'react-router-dom' that returns the current location object.
  // The location object contains information about the current URL, such as pathname, search, and state.
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate('/dash');

  let goHomeButton = null;
  if (pathname !== '/dash') {
    goHomeButton = (
      <button
        className='dash-footer__button icon-button'
        title='Home'
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }

  const content = (
    <footer className='dash-footer'>
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
  return content;
};
export default DashFooter;
