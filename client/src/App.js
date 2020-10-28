import React from 'react';

import { AuctionProvider } from './contexts/AuctionContext';
import AuctionsView from './views/AuctionsView';

export default () => {
  return (
    <AuctionProvider>
      <AuctionsView />
    </AuctionProvider>
  );
};
