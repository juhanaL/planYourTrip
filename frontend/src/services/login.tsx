import axios from 'axios';

const baseUrl = '/api/login';

const login = async (uuid: string) => {
  const response = await axios.post(baseUrl, { uuid });
  return response.data;
};

export default { login };
