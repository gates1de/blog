import React from 'react'
import App, { AppProps } from 'next/app'

import 'normalize.css'

type BlogProps = AppProps & {
  myProp: string
}

export default class Blog extends App<BlogProps> {
  render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}
