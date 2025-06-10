import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/GlobalStyle";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ExpenseProvider } from "../src/contexts/ExpenseContext";
import Layout from "../src/components/layout/Layout";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    textLight: "#6c757d", // Or whatever color you want
    // ...other colors
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default MyApp;
