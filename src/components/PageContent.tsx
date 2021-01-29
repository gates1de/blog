import React from 'react'
import styled from 'styled-components'

import breakpoint from 'styles/breakpoint'

export const PageContent: React.FC = ({ children }) => {
  return (
    <ScrollContainer>
      <Container>{children}</Container>
    </ScrollContainer>
  )
}

const ScrollContainer = styled.div`
  width: 100%;
  overflow: auto;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 90rem;

  @media (max-width: ${breakpoint.tablet}px) {
    max-width: 100%;
    width: 100%;
  }
`
