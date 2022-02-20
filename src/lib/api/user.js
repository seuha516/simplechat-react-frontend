import client from './client';

export const register = ({ username, nickname, password }) =>
  client.post('api/auth/register', { username, nickname, password });
export const login = ({ username, password }) => client.post('api/auth/login', { username, password });
export const check = () => client.get('api/auth/check');
export const logout = () => client.post('api/auth/logout');
export const checkid = ({ username }) => client.post('api/auth/checkid', { username });
export const update = ({ id, user }) => client.post(`api/auth/update/${id}`, user);
