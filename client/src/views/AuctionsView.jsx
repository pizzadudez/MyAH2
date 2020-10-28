import React, { useContext, useEffect, useState } from 'react';

import { AuctionContext } from '../contexts/AuctionContext';
import ItemMenu from '../components/ItemMenu';
import ItemTable from '../components/ItemTable';

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
      <ItemTable itemId={itemId} />
    </div>
  );
};
