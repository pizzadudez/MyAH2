import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const api = 'http://localhost:1999';

export const AuctionContext = createContext(null);

export const AuctionProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [auctions, setAuctions] = useState({});
  const [items, setItems] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const getAuctions = axios.get(api);
      const getItems = axios.get(`${api}/items`);
      const [auctionsRes, itemsRes] = await Promise.all([
        getAuctions,
        getItems,
      ]);
      setAuctions(auctionsRes.data);
      setItems(itemsRes.data);
      setLoaded(true);
    };
    fetchData();
  }, []);

  return (
    <AuctionContext.Provider value={{ auctions, items, loaded }}>
      {children}
    </AuctionContext.Provider>
  );
};
