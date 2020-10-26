import React, { memo, useCallback } from 'react';
import styled from 'styled-components'


export default memo(({items, selectItem}) => {
  // const onClickHandlers = Object.keys(items).reduce((obj, id) => {
  //   obj[id] = useCallback(() => selectItem(id), []); return obj
  // }, {})

  // console.log('render bar')
  // return (
  //   <Container>
  //     {Object.entries(items).map(([id, name]) => (<Tab onClick={onClickHandlers[id]} key={id}>{`${name} (${id})`}</Tab>))}
  //   </Container>
  // )

  const selectHandler = useCallback(e => {
    const itemId = Number(e.target.dataset['id'])
    selectItem(itemId)
  }, [selectItem])

  const tabs = Object.entries(items).map(([id, name]) => (
    <Tab key={id} data-id={id} onClick={selectHandler}>{name}</Tab>
  )) 

  return (
    <Container>
      {tabs}
    </Container>
  )
})

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Tab = styled.div`
  padding: 20px;
  background-color: gray;
`;