import styled from 'styled-components'

import Header from 'components/Header'
import Footer from 'components/Footer'

import GlobalStyle from 'styles/global'

type Props = {
  title?: string
}

const Layout: React.FC<Props> = ({ children, title = 'Untitled' }) => (
  <div>
    <GlobalStyle />
    <Header title={title} navigationItems={[]} />
    <ChildrenContainer>{children}</ChildrenContainer>
    <Footer />
  </div>
)

export default Layout

const ChildrenContainer = styled.div`
  overflow-x: hidden;
`
