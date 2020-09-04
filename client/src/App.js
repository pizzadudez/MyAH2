import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  console.log(data);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:1999');
      setData(response.data);
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>realm</th>
            <th>GI Price</th>
            <th>GIB Price</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map(realmName => (
            <tr key={realmName}>
              <td>{realmName}</td>
              <td>
                {Math.round(data[realmName][72092].mean_price / 100) / 100}
              </td>
              <td>
                {Math.round(data[realmName][72096].mean_price / 100) / 100}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
