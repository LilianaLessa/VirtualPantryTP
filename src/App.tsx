import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  basic: {
    marginTop: 50,
  },
});

function App() {
  return (
    <View style={styles.basic}>
      <Text>Hello Expo!</Text>
    </View>
  );
}

export default App;
