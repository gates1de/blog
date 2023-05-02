import styled from 'styled-components'

import Header from 'components/Header'
import Footer from 'components/Footer'

import GlobalStyle from 'styles/global'
import { NavigationItem } from 'types'

type Props = {
  children?: React.ReactNode
  description?: string
  imageURL?: string
  navigationItems?: Array<NavigationItem>
  title?: string
  url?: string
}

const Layout: React.FC<Props> = ({
  children,
  description,
  imageURL,
  navigationItems,
  title = 'Untitled',
  url,
}) => (
  <Container>
    <GlobalStyle />
    <Header
      description={description}
      imageURL={imageURL}
      navigationItems={navigationItems || []}
      title={title}
      url={url}
    />
    <ChildrenContainer>{children}</ChildrenContainer>
    <Footer />
  </Container>
)

export default Layout

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ChildrenContainer = styled.div``
