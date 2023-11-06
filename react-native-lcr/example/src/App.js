import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Field, AsciiType } from 'react-native-lcr';
import {PrintRequest} from 'react-native-lcr'

export default function App() {
  const [result, setResult] = React.useState(0);

  React.useEffect(() => {
    let field = new Field(6, new AsciiType())
    console.log(field);
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
