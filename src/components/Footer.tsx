import React from 'react'
import styled from 'styled-components'

const Footer: React.FC = () => (
  <React.Fragment>
    <StyledFooter>
      <p className="copyright">© {new Date().getFullYear()} gates1de.</p>
    </StyledFooter>
  </React.Fragment>
)

export default Footer

const StyledFooter = styled.footer`
  display: flex;
  min-height: 6rem;
  padding: 3rem 2rem 1rem;

  p.copyright {
    font-size: 1.2rem;
    margin: auto auto 0 auto;
  }
`
