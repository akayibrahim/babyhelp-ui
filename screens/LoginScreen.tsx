import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Button} from 'react-native';

import { View } from '../components/Themed';

export default function LoginScreen(props: any) {

  return (    
    <View style={styles.container}>    
      <View style={styles.activities}>          
          <Button title="Login" onPress={() => { 
            props.navigation.replace('Root', { name: 'Jane' });
          }} />
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activities: {
    top: '3%',    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  activitiesScroll: {
    height: '97%',
    top: 0,    
  },
});
