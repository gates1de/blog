import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: auto;
    background-color: white;
    font-size:62.5%;
    font-family: -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Helvetica,
      "Apple Color Emoji",
      Arial,
      sans-serif,
      "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  a {
    text-decoration: none;
    transition: 0.1s ease-in;

    :hover {
      opacity: 0.7;
    }
  }
`
export default GlobalStyle
