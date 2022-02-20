import axios from 'axios';

const client = axios.create({
  withCredentials: true,
});

client.defaults.baseURL = `${process.env.REACT_APP_API_URL}`;

export default client;
