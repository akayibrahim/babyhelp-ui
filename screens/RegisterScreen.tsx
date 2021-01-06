import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, Image, AsyncStorage, Alert} from 'react-native';

import { View } from '../components/Themed';

export default function RegisterScreen(props: any) {
  const [email, setEmail] = useState();
  const [sex, setSex] = useState();
  const [name, setName] = useState();
  const [birthDate, setBirthDate] = useState();
  const {updateMode} = props;

  const registerOrUpdate = async () => {
    if (updateMode != null && updateMode === "true") {
      update();
    } else {
      register(); 
    }
  }

  const register = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, sex, name, birthDate })
  };
    fetch('http://localhost:4001/api/v1/addUser', requestOptions).then((response) => response.json()).then((data) => {
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
            body: JSON.stringify({ email, sex, name, birthDate, id })
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

  const ifExistAtStoreNavigate = async () => {
    try {
        await AsyncStorage.getItem('id').then((value) => {          
          if (updateMode != "true" && value !== null && JSON.parse(value) != null) {
            props.navigation.replace('Root');
          }
        });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    ifExistAtStoreNavigate();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        await AsyncStorage.getItem('id').then((value) => {          
          if (value !== null && JSON.parse(value) != null) {
            fetch('http://localhost:4001/api/v1/users?id='+JSON.parse(value)).then((response) => response.json()).then((json) =>
              json.response).then((data) => {                
                var usr = data[0];
                setEmail(usr.email);
                setName(usr.name);
                setSex(usr.sex);
                setBirthDate(usr.birthDate);
            }).catch((error) => {
                console.error(error);
            });
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
    if (updateMode != null && updateMode === "true") {
      getUserInfo();
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
        <TextInput
          style={styles.input}
          placeholder={updateMode === "true" ? sex : 'Sex'}
          autoCapitalize="none"
          placeholderTextColor={color}
          onChangeText={val => setSex(val)}
        />
        <TextInput
          style={styles.input}
          placeholder={updateMode === "true" ? birthDate : 'Birth Date'}
          autoCapitalize="none"
          placeholderTextColor={color}
          onChangeText={val => setBirthDate(val)}
        />
        <TouchableOpacity style={{ borderWidth: 1, borderColor: color, width: 170, height: 40, borderRadius: 8, top: '1%' }} onPress={registerOrUpdate}>
          <Text style={{ fontSize: 18, color: color, textAlign: 'center', top: 8, }}>{updateMode === "true" ? 'Update' : 'Register'}</Text>
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
