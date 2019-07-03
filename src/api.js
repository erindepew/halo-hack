import axios from 'axios';

export const getApplicationToken = () => {
  return axios.get(`https://accounts.spotify.com/authorize?client_id=c77c1f8d728e440785c65066549397b0&response_type=code&redirect_uri=http%3A%2F%2Flocal.spotify.com`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
