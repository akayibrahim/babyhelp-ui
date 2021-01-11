import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, Image, AsyncStorage, Alert} from 'react-native';

import { View } from '../components/Themed';
import SwitchSelector from "react-native-switch-selector";
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import useColorScheme from '../hooks/useColorScheme';

export default function RegisterScreen(props: any) {
  const { updateMode, emailP, sexP, nameP, birthDateP, languageP } = props;
  const [email, setEmail] = useState();
  const [sex, setSex] = useState("MALE");
  const [name, setName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [language, setLangauge] = useState("EN");
  const colorScheme = useColorScheme();

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, sex, name, birthDate, language })
    };
    fetch('http://localhost:4001/api/v1/addUser', requestOptions).then((response) => response.json()).then((data) => {      
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
          fetch('http://localhost:4001/api/v1/updateUser', requestOptions).then((response) => response.json()).then((data) => {
            Alert.alert("", "Updated!")
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
    }
  }, []);
  
  return (    
      <View style={styles.container}>        
        <Image source={require('../assets/images/babyhelplogo.png')} style={styles.image}/>        
        <TextInput
          style={styles.input}
          placeholder={language==="TR"?"Mail":'Email'}
          value={email}
          autoCapitalize="none"
          placeholderTextColor={color}
          onChangeText={val => setEmail(val)}
        />
        <TextInput
          style={styles.input}
          placeholder={language==="TR"?"İsim":'Name'}
          value={name}
          autoCapitalize="none"
          placeholderTextColor={color}
          onChangeText={val => setName(val)}
        />
        <SwitchSelector
          options={language==="TR"?optionsTr:options}
          textColor={color}
          buttonColor={color}        
          initial={sexP === "FEMALE" ? 1 : 0}
          onPress={val => setSex(val)}
          hasPadding
          borderColor={color}
          backgroundColor= {colorScheme === 'dark' ? 'black' : "white"}
          style={{width: '85%', height: 50, top: '1%', bottom: '1%'}}
        />                
        {true && 
        <DateTimePicker
          value={new Date(Moment(birthDate).format('YYYY-MM-DD'))}
          mode='date'
          display="default"
          onChange={(event, date) => {
            setBirthDate(Moment(date).format('YYYY-MM-DD'));
          }}
          locale={language==="TR"?"tr-TR":"en-EN"}
          style={{width: '85%', height: 120, backgroundColor: colorScheme === 'dark' ? 'black' : "white", borderWidth: 1,  color: color, 
          borderColor: color, borderRadius: 14, top: '1%', bottom: '1%'}}
        />}
        <SwitchSelector
          options={optionsLang}
          textColor={color}
          buttonColor={color}
          initial={languageP === "TR" ? 1 : 0}
          onPress={val => setLangauge(val)}
          hasPadding
          borderColor={color}
          backgroundColor= {colorScheme === 'dark' ? 'black' : "white"}
          style={{width: '85%', height: 50, top: '5%', bottom: '1%'}}
        />
        <TouchableOpacity style={{ borderWidth: 1, borderColor: color, width: '40%', height: 40, borderRadius: 8, top: '3%' }} onPress={registerOrUpdate}>
          <Text style={{ fontSize: 18, color: color, textAlign: 'center', top: 8, }}>{updateMode === "true" ? language==="TR"?'Güncelle':'Update' : language==="TR"?'Kayıt Ol':'Register'}</Text>
        </TouchableOpacity>
        {updateMode === "true" && 
        <TouchableOpacity style={{ borderWidth: 1, borderColor: color, width: '20%', height: 40, borderRadius: 8, top: '5%' }} onPress={logout}>
          <Text style={{ fontSize: 18, color: color, textAlign: 'center', top: 8, }}>{language==="TR"?'Çıkış':'Logout'}</Text>
        </TouchableOpacity>
        }
        
      </View>
  );
}

const color = "#F9B99D";

const styles = StyleSheet.create({
  input: {
    width: '85%',
    height: 55,  
    margin: 10,
    padding: 8,
    color: color,
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
    width: '66%',
    height: '30%',
    bottom: '1%'
  },
})
