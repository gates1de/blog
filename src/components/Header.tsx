import React from 'react'
import Link from 'next/link'
import Head from 'next/head'

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
    <header>
      <nav>
        {navigationItems.map((item) => (
          <Link key={item.title} href={item.link}>
            <a>{item.title}</a>
          </Link>
        ))}
      </nav>
    </header>
  </React.Fragment>
)

export default Header
