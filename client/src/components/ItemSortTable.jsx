import React, {
  memo,
  useContext,
  useMemo,
  useCallback,
  useReducer,
} from 'react';
import styled from 'styled-components';

import { AuctionContext } from '../contexts/AuctionContext';
import RealmAuctions from './RealmAuctions';

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
          <th>Realm</th>
          <th data-col={'mean_price'} onClick={sortClickHandler}>
            Price
          </th>
          <th data-col={'my_quantity'} onClick={sortClickHandler}>
            Qty
          </th>
          <th data-col={'quantity'} onClick={sortClickHandler}>
            AH Qty
          </th>
          <th>Auctions</th>
        </tr>
      </thead>
      <tbody>
        {tableRows.map(([realmName, data]) => (
          <tr key={realmName}>
            <td style={{ textAlign: 'left' }}>{realmName}</td>
            <td>{(data.mean_price / 10000).toFixed(1)}</td>
            <td>{data.my_quantity !== 0 ? data.my_quantity : '-'}</td>
            <td>{data.quantity}</td>
            <td>
              <RealmAuctions
                auctions={data.auctions}
                ownAuctionIds={data.my_auction_ids}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
});

const StyledTable = styled.table`
  padding: 10px 12px;
  td {
    min-width: 36px;
    padding: 0 10px;
    text-align: right;
  }
  th {
    text-align: left;
    padding: 0 0 12px 10px;
  }
`;
