import styled from 'styled-components'

import Header from 'components/Header'
import Footer from 'components/Footer'

import GlobalStyle from 'styles/global'
import { NavigationItem } from 'types'

type Props = {
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
  <div>
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
  </div>
)

export default Layout

const ChildrenContainer = styled.div`
  overflow-x: hidden;
`
