import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  .form-label {
    position: absolute;
    left: 0;
    top: 10px;
    color: #999;
    background-color: #fff;
    z-index: 10;
    transition: transform 150ms ease-out, font-size 150ms ease-out;
  }

  .focused .form-label {
    transform: translateY(-125%);
    font-size: .75em;
  }

`;

export default GlobalStyle;
