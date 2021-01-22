import React from 'react'
import styled from 'styled-components'

const Footer: React.FC = () => (
  <React.Fragment>
    <hr />
    <StyledFooter>
      <span>I'm here to stay (Footer)</span>
    </StyledFooter>
  </React.Fragment>
)

export default Footer

const StyledFooter = styled.footer`
  padding: 1rem;

  span {
    font-size: 1.4rem;
  }
`
