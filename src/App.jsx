import "./App.css";
import CsvParser from "./component/CSVParser";
import { Container,  } from "@mui/material";

function App() {
  return (
<Container maxWidth="m">
    <h1>Upload CSV and See Magic!!</h1>
        <CsvParser />
    </Container>
  );
}

export default App;
