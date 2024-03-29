import * as React from 'react';
import {useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';

import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import Modal from 'react-native-modal';
import RegisterScreen from './RegisterScreen';
import Moment from 'moment';
import headerColor from '../hooks/headerColor';
const hColor = headerColor();
import ipAddress from '../hooks/ipAddress';
const ip = ipAddress();

export default function TabTwoScreen(props:any) {
  const colorScheme = useColorScheme();
  const [name, setName] = useState();
  const [sex, setSex] = useState();
  const [birthDate, setBirdthDate] = useState();
  const [language, setLangauge] = useState();
  const [email, setEmail] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const getUserInfo = () => {
      try {
        AsyncStorage.getItem('id').then((value) => {          
          if (value !== null && JSON.parse(value) != null) {
            fetch(ip + '/api/v1/users?id='+JSON.parse(value)).then((response) => response.json()).then((json) =>
              json.response).then((data) => {                
                var usr = data[0];
                setName(usr.name);
                setSex(usr.sex);
                setBirdthDate(usr.birthDate);
                setLangauge(usr.language);
                setEmail(usr.email);
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
  }, [isModalVisible]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}><Text style={{color: colorScheme === 'dark' ? 'gray' : '#000', fontWeight: "normal"}}>{language==="TR"?"İsim:":"Name:"} </Text>{name}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor={colorScheme === 'dark' ? "white" : "rgba(255,255,255,0.1)"} />
      <Text style={styles.title}><Text style={{color: colorScheme === 'dark' ? 'gray' : '#000', fontWeight: "normal"}}>{language==="TR"?"Cinsiyet:":"Sex:"} </Text>{language==="TR"?sex==="MALE"?"ERKEK":"KADIN":sex}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor={colorScheme === 'dark' ? "white" : "rgba(255,255,255,0.1)"} />
      <Text style={styles.title}><Text style={{color: colorScheme === 'dark' ? 'gray' : '#000', fontWeight: "normal"}}>{language==="TR"?"Doğum Günü:":"BirthDate:"} </Text>{Moment(birthDate).format('YYYY-MM-DD')}</Text>
      <Text style={{color: colorScheme === 'dark' ? 'gray' : '#000', fontWeight: "normal", fontSize: 12}}>{language==="TR"?"(Yıl-Ay-Gün)":"(Year-Month-Day)"}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor={colorScheme === 'dark' ? "white" : "rgba(255,255,255,0.1)"} />
      <Text style={styles.title}><Text style={{color: colorScheme === 'dark' ? 'gray' : '#000', fontWeight: "normal",}}>{language==="TR"?"Dil:":"Language:"} </Text>{language}</Text>
      <TouchableOpacity onPress={toggleModal} style={{position: "absolute", bottom:50}} >
        <View style={{ backgroundColor: hColor, width: 170, height: 40, borderRadius: 8,}}>
          <Text style={{ fontSize: 20, color: "white", textAlign: 'center', top: 8, }}>{language==="TR"?"Güncelle":"Edit"}</Text>
          <Ionicons size={20} style={{ position: "absolute", left: 20, top: 10 }} name="pencil" color={"white"} />  
        </View>        
      </TouchableOpacity>
      <Modal 
        isVisible={isModalVisible}
        onSwipeComplete={toggleModal}
        onBackdropPress={toggleModal}
        swipeDirection={['down']}
        propagateSwipe={true}
        style={styles.modal}
      >         
        <View style={{borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: colorScheme === 'dark' ? "black" : 'white', flex:0.88, padding: '8%'}}>
          <Text style={{ fontSize: 10, width:'100%', top: -18, textAlign: "center", color:"gray" }}>{language==="TR"?"Kapatmak için aşağı kaydır":"Swipe down to turn off"}</Text>
          <RegisterScreen updateMode={"true"} emailP={email} sexP={sex} languageP={language} nameP={name} birthDateP={birthDate} reRender={props.reRender} />
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
