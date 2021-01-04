import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from './Themed';

export default function NameAndWeek(props: any) {
  return (
    <View style={styles.containerName}>
      <Text style={styles.title}>LUKE BABY</Text>
      <Text style={styles.week}>WEEK: 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerName: {
    flexDirection: 'row',
    top: '3%',
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    borderWidth: 0.2,
    borderColor: '#487EB8',
    height: 40,
    padding: 6,
    width: '60%',
    borderRadius: 5
  },
  week: {
    fontSize: 20,    
    borderWidth: 0.2,
    borderColor: '#487EB8',
    height: 40,
    marginLeft: '1%',
    padding: 6,    
    width: '33%',
    borderRadius: 5,
    textAlign: "right",
  }
});
