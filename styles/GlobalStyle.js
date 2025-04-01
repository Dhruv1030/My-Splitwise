import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
  }

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .btn-primary {
    background-color: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
    
    &:hover, &:focus, &:active {
      background-color: ${(props) => props.theme.colors.primaryDark};
      border-color: ${(props) => props.theme.colors.primaryDark};
    }
  }

  .card {
    border-radius: ${(props) => props.theme.borderRadius};
    box-shadow: ${(props) => props.theme.boxShadow};
    border: none;
  }
`;

export default GlobalStyle;
