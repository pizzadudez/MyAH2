import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { AuctionProvider } from './contexts/AuctionContext';
import AuctionsView from './views/AuctionsView';

const GlobalStyle = createGlobalStyle`
  html {
    font-family: "Calibri","Raleway","Proxima Nova","Montserrat",
    Roboto,"Segoe UI",Oxygen-Sans,
    Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    /* Scrollbar */
    --scrollbarBG: #2b2b2b;
    --thumbBG: dimgray;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #212121;
    color: whitesmoke;
  }
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 16px;
  }
  ::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG) ;
    border-radius: 6px;
    border: 3px solid var(--scrollbarBG);
  }
`;

export default () => {
  return (
    <AuctionProvider>
      <GlobalStyle />
      <AuctionsView />
    </AuctionProvider>
  );
};
