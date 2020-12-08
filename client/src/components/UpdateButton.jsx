import React from 'react';
import styled from 'styled-components';

import useUpdate from '../hooks/useUpdate';

const StyledButton = styled.button`
  color: goldenrod;
`;

export default () => {
  const { update } = useUpdate();

  return <StyledButton onClick={update}>Update Data</StyledButton>;
};
