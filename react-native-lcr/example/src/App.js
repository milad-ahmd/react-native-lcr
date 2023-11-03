import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply } from 'react-native-lcr';
import {PrintRequest} from 'react-native-lcr'

export default function App() {
  const [result, setResult] = React.useState();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
    let field = new Field(6, new AsciiType())
    // field.value = `\n\n\n\n\n.`
    // let deviceAddress = 1
    // PrintRequest(250,100);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
