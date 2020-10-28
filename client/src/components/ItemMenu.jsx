import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const Tab = memo(styled.div`
  padding: 20px;
  background-color: ${({ selected }) => (selected ? 'darkgrey' : 'grey')};
`);

export default memo(({ items, setItemId, itemId }) => {
  const selectHandler = useCallback(
    e => {
      const itemId = e.target.dataset['id'];
      setItemId(itemId);
    },
    [setItemId]
  );

  const tabs = Object.entries(items).map(([id, name]) => (
    <Tab key={id} data-id={id} onClick={selectHandler} selected={itemId === id}>
      {name}
    </Tab>
  ));

  return <Container>{tabs}</Container>;
});
