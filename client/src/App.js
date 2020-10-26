import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import useAuctions from './hooks/useAuctions';
import useInventory from './hooks/useInventory';

import ItemMenu from './components/ItemMenu';

import items from './config/items.json';

const StyledTable = styled.table`
  td {
    min-width: 80px;
    padding: 0 10px;
  }
`;

function App() {
  const [auctions, auctionsLoading] = useAuctions();
  const [inventory, inventoryLoading] = useInventory();

  const loading = auctionsLoading && inventoryLoading;

  const [itemId, setItemId] = useState(Object.keys(items)[0]);

  const selectItem = useCallback(itemId => setItemId(itemId), []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ItemMenu items={items} selectItem={selectItem} />
      <StyledTable>
        <thead>
          <tr>
            <th>realm</th>
            <th>price</th>
            <th>inventory</th>
            <th>ah qty(K)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(auctions).map(realmName => (
            <tr key={realmName}>
              <td>{realmName}</td>
              <td>
                {auctions[realmName][itemId] &&
                  Math.round(auctions[realmName][itemId].mean_price / 100) /
                    100}
              </td>
              <td>
                {(inventory[realmName] &&
                  inventory[realmName].inventory[itemId]) ||
                  0 + inventory[realmName].auctions[itemId] ||
                  '-'}
              </td>
              <td>
                {auctions[realmName][itemId] &&
                  auctions[realmName][itemId].quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>
  );
  // return (
  //   <div>
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>realm</th>
  //           <th>GIO Price</th>
  //           <th>GIO Inventory</th>
  //           <th>GIB Price</th>
  //           <th>GIB Inventory</th>
  //           <th>Khorium O</th>
  //           <th>Khorium B</th>
  //           <th>KhoriumO Inventory</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {Object.keys(auctions).map(realmName => (
  //           <tr key={realmName}>
  //             <td>{realmName}</td>
  //             <td>
  //               {Math.round(auctions[realmName][72092].mean_price / 100) / 100}
  //             </td>
  //             {inventory[realmName] ? (
  //               <td>
  //                 {inventory[realmName].inventory[72092] ||
  //                   0 + inventory[realmName].auctions[72092] ||
  //                   0}
  //               </td>
  //             ) : (
  //               0
  //             )}
  //             <td>
  //               {Math.round(auctions[realmName][72096].mean_price / 100) / 100}
  //             </td>
  //             {inventory[realmName] ? (
  //               <td>
  //                 {inventory[realmName].inventory[72096] ||
  //                   0 + inventory[realmName].auctions[72096] ||
  //                   0}
  //               </td>
  //             ) : (
  //               0
  //             )}
  //             <td>
  //               {auctions[realmName][23426] &&
  //                 Math.round(auctions[realmName][23426].mean_price / 100) / 100}
  //             </td>
  //             <td>
  //               {auctions[realmName][23449] &&
  //                 Math.round(auctions[realmName][23449].mean_price / 100) / 100}
  //             </td>
  //             {inventory[realmName] ? (
  //               <td>
  //                 {inventory[realmName].inventory[23426] ||
  //                   0 + inventory[realmName].auctions[23426] ||
  //                   0}
  //               </td>
  //             ) : (
  //               0
  //             )}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
}

export default App;
