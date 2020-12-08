import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AuctionContext } from '../contexts/AuctionContext';
import ItemMenu from '../components/ItemMenu';
import ItemSortTable from '../components/ItemSortTable';
import UpdateButton from '../components/UpdateButton';
import InfoTab from '../components/InfoTab';

const Page = styled.div`
  background-color: #222;
`;
const Menu = styled.div`
  display: flex;
  justify-content: start;
`;

export default () => {
  const { items, loaded } = useContext(AuctionContext);
  const [itemId, setItemId] = useState(null);

  useEffect(() => {
    if (loaded) {
      setItemId(items[0].id);
    }
  }, [items, loaded]);

  if (!loaded || !itemId) return <div>LOADING</div>;

  return (
    <Page>
      <Menu>
        <ItemMenu items={items} setItemId={setItemId} itemId={itemId} />
        <UpdateButton />
        <InfoTab />
      </Menu>
      <ItemSortTable itemId={itemId} />
    </Page>
  );
};
