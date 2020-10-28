import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AuctionContext } from '../contexts/AuctionContext';
import ItemMenu from '../components/ItemMenu';
import ItemSortTable from '../components/ItemSortTable';

const Page = styled.div`
  background-color: #222;
`;

export default () => {
  const { items, loaded } = useContext(AuctionContext);
  const [itemId, setItemId] = useState(null);
  useEffect(() => {
    setItemId(Object.keys(items)[0]);
  }, [items]);

  if (!loaded) return <div>LOADING</div>;

  return (
    <Page>
      <ItemMenu items={items} setItemId={setItemId} itemId={itemId} />
      <ItemSortTable itemId={itemId} />
    </Page>
  );
};
