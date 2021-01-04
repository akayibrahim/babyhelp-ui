import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from './Themed';

export default function Subheader(props: any) {
    const {title, headerColor} = props;
  return (
    <View style={[styles.containerName, {backgroundColor: headerColor}]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerName: {
    flexDirection: 'row',
    width: '96%',
    height: 30,
    marginLeft: '2%',
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
    padding: 4,
    color: 'white',
  },
});
