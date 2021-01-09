import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, Image, AsyncStorage, Alert} from 'react-native';

import { View } from '../components/Themed';
import SwitchSelector from "react-native-switch-selector";

export default function RegisterScreen(props: any) {
  const { updateMode, emailP, sexP, nameP, birthDateP, languageP } = props;
  const [email, setEmail] = useState();
  const [sex, setSex] = useState("MALE");
  const [name, setName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [language, setLangauge] = useState("EN");

  const options = [
    { label: "MALE", value: "MALE" },
    { label: "FEMALE", value: "FEMALE" }
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
      // console.log(data);
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
            Alert.alert("", "Your information was updated!")
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
          placeholder={updateMode === "true" ? email : 'Email'}
          autoCapitalize="none"
          placeholderTextColor={color}
          onChangeText={val => setEmail(val)}
        />
        <TextInput
          style={styles.input}
          placeholder={updateMode === "true" ? name : 'Name'}
          //secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor={color}
          onChangeText={val => setName(val)}
        />
        <SwitchSelector
          options={options}
          textColor={color}
          buttonColor={color}        
          initial={sexP === "FEMALE" ? 1 : 0}
          onPress={val => setSex(val)}
          hasPadding
          borderColor={color}
          style={{width: updateMode != "true" ? '83%' : '100%', height: 50, top: '1%', bottom: '1%'}}
        />        
        <TextInput
          style={styles.input}
          placeholder={updateMode === "true" ? birthDate : 'Birth Date'}
          autoCapitalize="none"
          placeholderTextColor={color}
          onChangeText={val => setBirthDate(val)}
        />
        <SwitchSelector
          options={optionsLang}
          textColor={color}
          buttonColor={color}
          initial={languageP === "TR" ? 1 : 0}
          onPress={val => setLangauge(val)}
          hasPadding
          borderColor={color}
          style={{width: updateMode != "true" ? '83%' : '100%', height: 50, top: '1%', bottom: '1%'}}
        />
        <TouchableOpacity style={{ borderWidth: 1, borderColor: color, width: 170, height: 40, borderRadius: 8, top: '1%' }} onPress={registerOrUpdate}>
          <Text style={{ fontSize: 18, color: color, textAlign: 'center', top: 8, }}>{updateMode === "true" ? 'Update' : 'Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ borderWidth: 1, borderColor: color, width: 170, height: 40, borderRadius: 8, top: '3%' }} onPress={logout}>
          <Text style={{ fontSize: 18, color: color, textAlign: 'center', top: 8, }}>Logout</Text>
        </TouchableOpacity>
      </View>
  );
}

const color = "#F9B99D";

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: 'white',
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
    width: 260,
    height: 260,
    bottom: '5%'

  },
})
