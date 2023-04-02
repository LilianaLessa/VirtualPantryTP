import * as React from "react";
import { ThemeProvider } from "styled-components";
import Navigation from "./infrastructure/navigation";
import theme from "./infrastructure/theme";

function App() {
  // import font from './vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';

  return (
    <ThemeProvider theme={theme}>
      <Navigation />
    </ThemeProvider>
  );
}

export default App;
