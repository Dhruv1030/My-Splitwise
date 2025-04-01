import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/GlobalStyle";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ExpenseProvider } from "../src/contexts/ExpenseContext";
import Layout from "../src/components/layout/Layout";

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
