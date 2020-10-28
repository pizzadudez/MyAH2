import React, { memo, useContext, useState } from 'react';
import styled from 'styled-components';

import { AuctionContext } from '../contexts/AuctionContext';

export default memo(({ itemId }) => {
  const { auctions } = useContext(AuctionContext);

  return (
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
        {Object.keys(auctions[itemId]).map(realmName => (
          <tr key={realmName}>
            <td>{realmName}</td>
            <td>
              {auctions[itemId][realmName] &&
                Math.round(auctions[itemId][realmName].mean_price / 100) / 100}
            </td>
            <td>{auctions[itemId][realmName].my_quantity}</td>
            <td>{auctions[itemId][realmName].quantity}</td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
});

const StyledTable = styled.table`
  td {
    min-width: 80px;
    padding: 0 10px;
  }
`;
