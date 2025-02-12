import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const api = 'http://localhost:1999/api';

export const AuctionContext = createContext(null);

export const AuctionProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [auctions, setAuctions] = useState({});
  const [items, setItems] = useState([]);
  const [info, setInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const getAuctions = axios.get(`${api}/auctions`);
      const getItems = axios.get(`${api}/items`);
      const [auctionsRes, itemsRes] = await Promise.all([
        getAuctions,
        getItems,
      ]);

      const { items, last_update, last_modified } = auctionsRes.data;
      setAuctions(items);
      setInfo({ last_update, last_modified });
      setItems(itemsRes.data);

      setLoaded(true);
    };
    fetchData();
  }, []);

  return (
    <AuctionContext.Provider value={{ auctions, items, info, loaded }}>
      {children}
    </AuctionContext.Provider>
  );
};
