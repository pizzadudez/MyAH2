import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState(null);
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await axios.get('http://localhost:1999');
      setAuctions(response.data);
      const inventoryResponse = await axios.get(
        'http://localhost:1999/inventory'
      );
      setInventory(inventoryResponse.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>realm</th>
            <th>GIO Price</th>
            <th>GIO Inventory</th>
            <th>GIB Price</th>
            <th>GIB Inventory</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(auctions).map(realmName => (
            <tr key={realmName}>
              <td>{realmName}</td>
              <td>
                {Math.round(auctions[realmName][72092].mean_price / 100) / 100}
              </td>
              {inventory[realmName] ? (
                <td>
                  {inventory[realmName].inventory[72092] ||
                    0 + inventory[realmName].auctions[72092] ||
                    0}
                </td>
              ) : (
                0
              )}
              <td>
                {Math.round(auctions[realmName][72096].mean_price / 100) / 100}
              </td>
              {inventory[realmName] ? (
                <td>
                  {inventory[realmName].inventory[72096] ||
                    0 + inventory[realmName].auctions[72096] ||
                    0}
                </td>
              ) : (
                0
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
