import * as React from "react";
import { ThemeProvider } from "styled-components";
import Navigation from "./infrastructure/navigation";
import theme from "./infrastructure/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Navigation />
    </ThemeProvider>
  );
}

export default App;
