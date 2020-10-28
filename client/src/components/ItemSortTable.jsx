import React, {
  memo,
  useContext,
  useMemo,
  useCallback,
  useReducer,
} from 'react';
import styled from 'styled-components';

import { AuctionContext } from '../contexts/AuctionContext';

const tableColumns = ['mean_price', 'quantity', 'my_quantity'];
const sortFn = (isDescSort, sortCol) => (a, b) => {
  return (a[1][sortCol] - b[1][sortCol]) * (isDescSort ? -1 : 1);
};
const initialSort = { isDesc: true, col: tableColumns[0] };
const sortReducer = (state, column) => {
  if (column === state.col) {
    return {
      ...state,
      isDesc: !state.isDesc,
    };
  } else {
    return {
      ...state,
      col: column,
    };
  }
};

export default memo(({ itemId }) => {
  const { auctions } = useContext(AuctionContext);
  const [sort, sortDispatch] = useReducer(sortReducer, initialSort);

  const tableRows = useMemo(
    () => Object.entries(auctions[itemId]).sort(sortFn(sort.isDesc, sort.col)),
    [itemId, auctions, sort.isDesc, sort.col]
  );
  const sortClickHandler = useCallback(
    e => sortDispatch(e.target.dataset['col']),
    [sortDispatch]
  );

  return (
    <StyledTable>
      <thead>
        <tr>
          <th>realm</th>
          <th data-col={'mean_price'} onClick={sortClickHandler}>
            price
          </th>
          <th data-col={'my_quantity'} onClick={sortClickHandler}>
            inventory
          </th>
          <th data-col={'quantity'} onClick={sortClickHandler}>
            ah qty(K)
          </th>
        </tr>
      </thead>
      <tbody>
        {tableRows.map(([realmName, data]) => (
          <tr key={realmName}>
            <td>{realmName}</td>
            <td>{Math.round(data.mean_price / 100) / 100}</td>
            <td>{data.my_quantity}</td>
            <td>{data.quantity}</td>
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
