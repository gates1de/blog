import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: auto;
    background-color: white;
    font-size:62.5%;
    height: 100%;
  }

  body {
    color: #37352f;
    font-family: -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Helvetica,
      "Apple Color Emoji",
      Arial,
      sans-serif,
      "Segoe UI Emoji",
      "Segoe UI Symbol";
    font-weight: 400;
    font-size: 1.6rem;
    height: 100%;
    line-height: 2.4rem;
    white-space: pre-wrap;
  }

  div {
    box-sizing: border-box;
  }

  div#__next {
    height: 100%;
  }

  a {
    color: #1a73e8;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s ease-in;

    :hover {
      opacity: 0.5;
    }

    :visited {
      color: #1a73e8;
    }
  }
`
export default GlobalStyle
