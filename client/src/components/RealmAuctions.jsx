import React, { memo, useMemo } from 'react';
import styled from 'styled-components';

const AuctionsContainer = styled.div`
  display: flex;
`;
const Auction = styled.div`
  min-width: 16px;
  height: 20px;
  margin: 1px;
  padding: 2px 5px;
  color: black;
  border-radius: 3px;
  text-align: center;
  background-color: ${({ ownAuction }) =>
    ownAuction ? 'palegoldenrod' : 'lightslategray'};
`;

export default memo(({ auctions, ownAuctionIds }) => {
  const combinedAuctions = useMemo(() => {
    const combined = [{ ...auctions[0] }];
    auctions.slice(1).forEach(auc => {
      const chunk = combined[combined.length - 1];
      if (chunk.own_auc === auc.own_auc && chunk.price === auc.price) {
        chunk.quantity = chunk.quantity + auc.quantity;
      } else {
        combined.push({ ...auc });
      }
    });
    return combined;
  }, [auctions, ownAuctionIds]);

  return (
    <AuctionsContainer>
      {combinedAuctions.map(auc => (
        <Auction key={auc.id} ownAuction={auc.own_auc}>
          {auc.quantity}
        </Auction>
      ))}
    </AuctionsContainer>
  );
});
