import * as React from 'react';
import {useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const [name, setName] = useState();
  const [sex, setSex] = useState();
  const [birthDate, setBirdthDate] = useState();

  useEffect(() => {
    const getUserInfo = () => {
      fetch('http://localhost:4001/api/v1/users').then((response) => response.json()).then((json) =>
      json.response).then((data) => {
        var usr = data[0];
        setName(usr.name);
        setSex(usr.sex);
        setBirdthDate(usr.birthDate);      
      }).catch((error) => {
          console.error(error);
      });
    }
    getUserInfo();
  }, [name]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}><Text style={{color: colorScheme === 'dark' ? 'gray' : '#000', fontWeight: "normal"}}>Name: </Text>{name}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor={colorScheme === 'dark' ? "white" : "rgba(255,255,255,0.1)"} />
      <Text style={styles.title}><Text style={{color: colorScheme === 'dark' ? 'gray' : '#000', fontWeight: "normal"}}>Sex: </Text>{sex}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor={colorScheme === 'dark' ? "white" : "rgba(255,255,255,0.1)"} />
      <Text style={styles.title}><Text style={{color: colorScheme === 'dark' ? 'gray' : '#000', fontWeight: "normal"}}>BirthDate: </Text>{birthDate}</Text>
      <TouchableOpacity>
        <View style={{ backgroundColor: "#487EB8", width: 170, height: 40, borderRadius: 8, top: 50, }}>
          <Text style={{ fontSize: 20, color: "white", textAlign: 'center', top: 8, }}>Edit</Text>
          <Ionicons size={20} style={{ position: "absolute", left: 30, top: 10 }} name="pencil" color={"white"} />  
        </View>        
      </TouchableOpacity>      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',    
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
