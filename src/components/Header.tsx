import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'

import { BLOG_TITLE } from 'constants/text'
import { NavigationItem } from 'types'

type Props = {
  description?: string
  imageURL?: string
  navigationItems: Array<NavigationItem>
  title: string
  url?: string
}

const Header: React.FC<Props> = ({
  description,
  imageURL,
  navigationItems = [],
  title = 'Title',
  url,
}) => (
  <React.Fragment>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta charSet="utf-8" />
      {process.env.APP_ENV !== 'production' && (
        <meta name="robots" content="noindex" />
      )}
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta property="og:title" content={title || ` | ${BLOG_TITLE}`} />
      <meta property="og:description" content={description || ''} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      {imageURL && <meta property="og:image" content={imageURL} />}
      <link rel="icon" href="/static/images/favicon.ico" />
      <link rel="shortcut icon" href="/static/images/favicon.ico" />
    </Head>
    <HeaderContent>
      <BlogTitle href="/">{BLOG_TITLE}</BlogTitle>
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
