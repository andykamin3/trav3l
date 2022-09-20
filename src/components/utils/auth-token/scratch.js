import Cookies from "universal-cookie";

export const getAuthenticationToken = () => {
  const cookies = new Cookies();
  const token = cookies.get('token');
  return token;
};

export const setAuthenticationToken = token => {
  const cookies = new Cookies();
  cookies.set('token', token, { path: '/', maxAge: 1200});
};

