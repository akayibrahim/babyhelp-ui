import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, Image, AsyncStorage, Button} from 'react-native';

import { View } from '../components/Themed';
import SwitchSelector from "react-native-switch-selector";
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import useColorScheme from '../hooks/useColorScheme';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import activityColor from '../hooks/activityColor';
const color = activityColor();
import ipAddress from '../hooks/ipAddress';
const ip = ipAddress();

export default function RegisterScreen(props: any) {
  const { updateMode, emailP, sexP, nameP, birthDateP, languageP, colorText } = props;
  const [email, setEmail] = useState();
  const [sex, setSex] = useState("MALE");
  const [name, setName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [language, setLangauge] = useState("EN");
  const colorScheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [pickDate, setPickDate] = useState(false);

  const options = [
    { label: "MALE", value: "MALE" },
    { label: "FEMALE", value: "FEMALE" }
  ];
  const optionsTr = [
    { label: "ERKEK", value: "MALE" },
    { label: "KADIN", value: "FEMALE" }
  ];

  const optionsLang = [
    { label: "EN", value: "EN" },
    { label: "TR", value: "TR" }
  ];

  const registerOrUpdate = async () => {
    if (updateMode != null && updateMode === "true") {
      update();
    } else {
      register(); 
    }
  }

  const logout = async () => {
    AsyncStorage.removeItem('id');
  }

  const register = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ email, sex, name, birthDate, language }),
    };
    fetch(ip + '/api/v1/addUser', requestOptions).then((response) => response.json()).then((data) => {      
      console.log(data);
      storeData(data.response.insertId);
      props.navigation.replace('Root');
    }).catch((error) => {
      console.error(error);
    });
  }

  const update = () => {
    try {
      AsyncStorage.getItem('id').then((value) => {          
        if (value !== null && JSON.parse(value) != null) {
          var id = JSON.parse(value);
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, sex, name, birthDate, language, id })
          };
          fetch(ip + '/api/v1/updateUser', requestOptions).then((response) => response.json()).then((data) => {            
            setModalVisible(true);
            setTimeout(() => {
              setModalVisible(false);
            }, 1000);
          }).catch((error) => {
              console.error(error);
          });       
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  const storeData = async (isRegistered:string) => {    
    try {
        await AsyncStorage.setItem('id', JSON.stringify(isRegistered));
    } catch (e) {
        console.error(e);
    }
  }

  useEffect(() => {
    if (updateMode === "true") {
      setName(nameP);
      setSex(sexP);
      setEmail(emailP);
      setBirthDate(birthDateP);
      setLangauge(languageP);      
    } else {
      setBirthDate(Moment(new Date()).format('YYYY-MM-DD'));
    }
  }, []);
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);    
  };

  const onFocus = () => {
    setPickDate(!pickDate);
  }

  return (    
      <View style={styles.container}>        
        <Image source={require('../assets/images/babyhelpicon.png')} style={styles.image}/>
        <TextInput
          style={[styles.input, {color: colorText}]}
          placeholder={language==="TR"?"Mail":'Email'}
          value={email}
          autoCapitalize="none"
          placeholderTextColor={colorText}
          onChangeText={val => setEmail(val)}
        />
        <TextInput
          style={[styles.input, {color: colorText}]}
          placeholder={language==="TR"?"İsim":'Name'}
          value={name}
          autoCapitalize="none"
          placeholderTextColor={colorText}
          onChangeText={val => setName(val)}
        />
        <TextInput
          style={[styles.input, {color: colorText}]}
          placeholder={Moment(birthDate).format('YYYY-MM-DD')}
          value={Moment(birthDate).format('YYYY-MM-DD')}
          autoCapitalize="none"
          placeholderTextColor={colorText}
          onTouchStart={onFocus}
        />
        <SwitchSelector
          options={language==="TR"?optionsTr:options}
          textColor={color}
          selectedColor={colorText}
          buttonColor={color}        
          initial={sexP === "FEMALE" ? 1 : 0}
          onPress={val => setSex(val)}
          hasPadding
          borderColor={color}
          backgroundColor= {colorScheme === 'dark' ? 'black' : "white"}
          style={{width: '85%', height: 50, top: '1%', bottom: '1%'}}
        />
        <SwitchSelector
          options={optionsLang}
          textColor={color}
          selectedColor={colorText}
          buttonColor={color}
          initial={languageP === "TR" ? 1 : 0}
          onPress={val => setLangauge(val)}
          hasPadding
          borderColor={color}
          backgroundColor= {colorScheme === 'dark' ? 'black' : "white"}
          style={{width: '85%', height: 50, top: '5%', bottom: '1%'}}
        />
        <TouchableOpacity style={{ borderWidth: 1, borderColor: color, width: '40%', height: 40, borderRadius: 8, top: '3%' }} onPress={registerOrUpdate}>
          <Text style={{ fontSize: 18, color: colorText, textAlign: 'center', top: 8, }}>{updateMode === "true" ? language==="TR"?'Güncelle':'Update' : language==="TR"?'Kayıt Ol':'Register'}</Text>
        </TouchableOpacity>
        {updateMode === "true" && 
        <TouchableOpacity style={{ borderWidth: 1, borderColor: color, width: '20%', height: 40, borderRadius: 8, top: '5%' }} onPress={logout}>
          <Text style={{ fontSize: 18, color: colorText, textAlign: 'center', top: 8, }}>{language==="TR"?'Çıkış':'Logout'}</Text>
        </TouchableOpacity>
        }
        <Modal 
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          style={{alignItems: "center"}}>
          <View style={{borderRadius: 15, backgroundColor: colorScheme === 'dark' ? "black" : 'white', flex:0.03, width: '60%', padding: '4%', 
                        alignItems: "center", justifyContent: "center"}}>
            <Ionicons size={20} style={{ position: "absolute", left: 35 }} name="checkmark-done-outline" color={colorScheme === 'dark' ? "white" : 'black'} />
            <Text style={{fontWeight:"bold"}}>{language==="TR"?"GÜNCELLENDİ!":"UPDATED!"}</Text>
          </View>
        </Modal>
        <Modal 
          isVisible={pickDate}
          style={styles.modal}>
          <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: colorScheme === 'dark' ? "black" : 'white', flex: 0.24, padding: '10%'}}>
            <View style={{position: "absolute", right: 30, top: 5}}>
              <Button title={language==="TR"?"Bitti":"Done"} onPress={() => onFocus()}></Button>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor={colorScheme === 'dark' ? "white" : "rgba(255,255,255,0.1)"} />
            <DateTimePicker
              value={new Date(Moment(birthDate).format('YYYY-MM-DD'))}
              mode='date'
              display="default"
              onChange={(event, date) => {
                setBirthDate(Moment(date).format('YYYY-MM-DD'));
              }}
              locale={language==="TR"?"tr-TR":"en-EN"}
              style={{width: '100%', height: 180, backgroundColor: colorScheme === 'dark' ? 'black' : "white", borderWidth: 1,  color: color, 
              borderColor: color, borderRadius: 14, top: '5%', bottom: '1%'}}
            />
          </View>          
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '85%',
    height: 55,  
    margin: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: color,
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',  
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '65%',
    height: '30%',
    bottom: '1%'
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  separator: {
    marginVertical: 2,
    height: 1,
    width: '150%',
    left: '-20%'
  },
})
