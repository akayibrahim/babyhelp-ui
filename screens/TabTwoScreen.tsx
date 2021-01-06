import * as React from 'react';
import {useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';

import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import Modal from 'react-native-modal';
import RegisterScreen from './RegisterScreen';

export default function TabTwoScreen(props:any) {
  const colorScheme = useColorScheme();
  const [name, setName] = useState();
  const [sex, setSex] = useState();
  const [birthDate, setBirdthDate] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const getUserInfo = () => {
      try {
        AsyncStorage.getItem('id').then((value) => {          
          if (value !== null && JSON.parse(value) != null) {
            fetch('http://localhost:4001/api/v1/users?id='+JSON.parse(value)).then((response) => response.json()).then((json) =>
              json.response).then((data) => {                
                var usr = data[0];
                setName(usr.name);
                setSex(usr.sex);
                setBirdthDate(usr.birthDate);      
            }).catch((error) => {
                console.error(error);
            });
          }
        });
      } catch (e) {
        console.error(e);
      }      
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
      <TouchableOpacity onPress={toggleModal}>
        <View style={{ backgroundColor: "#487EB8", width: 170, height: 40, borderRadius: 8, top: 50, }}>
          <Text style={{ fontSize: 20, color: "white", textAlign: 'center', top: 8, }}>Edit</Text>
          <Ionicons size={20} style={{ position: "absolute", left: 30, top: 10 }} name="pencil" color={"white"} />  
        </View>        
      </TouchableOpacity>
      <Modal 
        isVisible={isModalVisible}
        onSwipeComplete={toggleModal}
        swipeDirection={['down']}
        propagateSwipe={true}
        style={styles.modal}
      >         
        <View style={{borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white', flex:0.88, padding: '10%'}}>
          <TouchableOpacity onPress = { () => toggleModal()}>
            <View style={{ width: 80, height: 50,  position: "absolute", right: -25, borderWidth: 0, top: -25, backgroundColor: 'white' }} >
              <Ionicons size={32} style={{right: 0, position: "absolute"}} name="close-outline" color={"black"} />
            </View>
          </TouchableOpacity>    
          <RegisterScreen updateMode={"true"}/>
        </View>
      </Modal>
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
