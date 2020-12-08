import { useEffect } from 'react';
import axios from 'axios';

const api = 'http://localhost:1999/api';

const useUpdate = () => {
  const update = () => axios.get(`${api}/services/update`);

  return { update };
};

export default useUpdate;
