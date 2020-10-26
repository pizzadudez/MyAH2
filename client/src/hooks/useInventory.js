import { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'http://localhost:1999/inventory';

const useInventory = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await axios.get(url);
      setData(response.data);
    };
    fetchData();
    setLoading(false);
  }, []);

  return [data, loading];
};

export default useInventory;
