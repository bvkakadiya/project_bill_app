import "./App.css";
import CsvParser from "./component/CSVParser";
import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./ThemeProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="m">
        <h1>Upload CSV and See Magic!!</h1>
        <CsvParser />
      </Container>
    </ThemeProvider>
  );
}

export default App;
