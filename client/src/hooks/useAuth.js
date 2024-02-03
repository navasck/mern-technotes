import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
// This library doesn't validate the token, any well-formed JWT can be decoded. You should validate the token in your server-side logic by using something like express-jwt, koa-jwt, Microsoft.AspNetCore.Authentication.JwtBearer
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = 'Employee';

  if (token) {
    const decoded = jwtDecode(token);
    // we are setting this values from backend, when signing access token
    const { username, roles } = decoded.UserInfo;

    isManager = roles.includes('Manager');
    isAdmin = roles.includes('Admin');

    if (isManager) status = 'Manager';
    if (isAdmin) status = 'Admin';

    return { username, roles, status, isManager, isAdmin };
  }

  return { username: '', roles: [], isManager, isAdmin, status };
};
export default useAuth;
