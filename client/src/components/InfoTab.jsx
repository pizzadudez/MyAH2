import React, { useContext } from 'react';
import styled from 'styled-components';

import { AuctionContext } from '../contexts/AuctionContext';

const InfoList = styled.ul`
  li {
    display: flex;
    justify-content: space-between;
    span {
      margin: 2px;
    }
  }
`;

export default () => {
  const { info } = useContext(AuctionContext);
  console.log(info);
  return (
    <InfoList>
      {Object.entries(info).map(([name, value]) => (
        <li>
          <span>{name}</span>
          <span>{new Date(Number(value) * 1000).toLocaleString()}</span>
        </li>
      ))}
    </InfoList>
  );
};
