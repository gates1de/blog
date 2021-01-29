import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'

import { NavigationItem } from 'types'

type Props = {
  title: string
  navigationItems: Array<NavigationItem>
}

const Header: React.FC<Props> = ({ title = 'Title', navigationItems = [] }) => (
  <React.Fragment>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <HeaderContent>
      <BlogTitle href="/">gates1de のブログ (仮)</BlogTitle>
      <nav>
        {navigationItems.map((item) => (
          <Link key={item.title} href={item.link}>
            <a>{item.title}</a>
          </Link>
        ))}
      </nav>
    </HeaderContent>
  </React.Fragment>
)

export default Header

const HeaderContent = styled.header`
  padding: 2rem;
`

const BlogTitle = styled.a`
  font-size: 2.4rem;
  color: #37352f;

  :visited {
    color: #37352f;
  }
`
