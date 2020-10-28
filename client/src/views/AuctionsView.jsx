import React, { useContext, useEffect, useState } from 'react';

import { AuctionContext } from '../contexts/AuctionContext';
import ItemMenu from '../components/ItemMenu';
import ItemSortTable from '../components/ItemSortTable';

export default () => {
  const { items, loaded } = useContext(AuctionContext);
  const [itemId, setItemId] = useState(null);
  useEffect(() => {
    setItemId(Object.keys(items)[0]);
  }, [items]);

  if (!loaded) return <div>LOADING</div>;

  return (
    <div>
      <ItemMenu items={items} setItemId={setItemId} itemId={itemId} />
      <ItemSortTable itemId={itemId} />
    </div>
  );
};
