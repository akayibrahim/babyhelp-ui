import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, Image, AsyncStorage, Button, Platform, Keyboard,  TouchableWithoutFeedback } from 'react-native';

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
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RegisterScreen(props: any) {
  const { updateMode, emailP, sexP, nameP, birthDateP, languageP } = props;
  const [email, setEmail] = useState("mail");
  const [sex, setSex] = useState("MALE");
  const [name, setName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [language, setLangauge] = useState("EN");
  const colorScheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [pickDate, setPickDate] = useState(false);
  const [colorText, setColorText] = useState();
  const [isWarmVisible, setWarmVisible] = useState(false);  
  const logoutFlag = false;
  const [pushToken, setPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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
      body: JSON.stringify({ email, sex, name, birthDate, language, pushToken }),
    };
    fetch(ip + '/api/v1/addUser', requestOptions).then((response) => response.json()).then((data) => {      
      //console.log(data);
      storeData(data.response.insertId);
      setWarmVisible(true);      
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
          // schedulePushNotification();
          fetch(ip + '/api/v1/updateUser', requestOptions).then((response) => response.json()).then((data) => {            
            setModalVisible(true);
            props.reRender();
            setTimeout(() => {
              setModalVisible(false);              
            }, 3000);
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
    setColorText(colorScheme === "dark" ? "white" : "black");
  }, []);
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);    
  };

  const onFocus = () => {
    setPickDate(!pickDate);
  }

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
    );

  const closeWarm = () => {
    setWarmVisible(false);
    props.navigation.replace('Root');
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      // alert('Must use physical device for Push Notifications');
      console.log('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  return (    
      <View style={styles.container}>        
        <Image source={require('../assets/images/babyhelpicon.png')} style={styles.image}/>
        {false && 
        <TextInput
        style={[styles.input, {color: colorText}]}
        placeholder={language==="TR"?"Mail":'Email'}
        value={email}
        autoCapitalize="none"
        placeholderTextColor={colorText}
        onChangeText={val => setEmail(val)}
        />}
        <TextInput
          style={[styles.input, {color: colorText}]}
          placeholder={language==="TR"?"İsim":'Name'}
          value={name}
          autoCapitalize="none"
          placeholderTextColor={colorText}
          onChangeText={val => setName(val)}
        />
        <DismissKeyboard>
          <TextInput
              style={[styles.input, {color: colorText}]}
              placeholder={Moment(birthDate).format('YYYY-MM-DD')}
              value={Moment(birthDate).format('YYYY-MM-DD')}
              autoCapitalize="none"
              placeholderTextColor={colorText}
              onTouchStart={onFocus}                          
            />
        </DismissKeyboard>        
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
          style={{width: '85%', height: 50, top: '1%', bottom: '1%'}}
        />
        <TouchableOpacity style={{ borderWidth: 1, borderColor: color, width: '40%', height: 40, borderRadius: 8, top: '1%', }} onPress={registerOrUpdate}>
          <Text style={{ fontSize: 18, color: colorText, textAlign: 'center', top: 8, }}>{updateMode === "true" ? language==="TR"?'Güncelle':'Update' : language==="TR"?'Kayıt Ol':'Register'}</Text>
        </TouchableOpacity>
        {updateMode === "true" && logoutFlag && 
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
            <Ionicons size={20} style={{ position: "absolute", left: 20 }} name="checkmark-done-outline" color={colorScheme === 'dark' ? "white" : 'black'} />
            <Text style={{fontWeight:"bold"}}>{language==="TR"?"GÜNCELLENDİ!":"UPDATED!"}</Text>
          </View>
        </Modal>
        {Platform.OS === 'ios' ? 
          <Modal 
          isVisible={pickDate}
          style={styles.modal}>
          <View style={{borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: colorScheme === 'dark' ? "black" : 'white', flex: 0.28, padding: '10%'}}>
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
              maximumDate={new Date(Moment(new Date()).format('YYYY-MM-DD'))}
              textColor= "#000"
              locale={language==="TR"?"tr-TR":"en-EN"}
              style={{width: '100%', height: 180, backgroundColor: colorScheme === 'dark' ? 'black' : "white", borderWidth: 0, color: color,
                borderColor: color, borderRadius: 14, top: '5%', bottom: '1%', }}
            />
          </View>          
        </Modal>
        : pickDate &&
          <DateTimePicker
              value={new Date(Moment(birthDate).format('YYYY-MM-DD'))}
              mode='date'
              display="default"
              onChange={(event, date) => {
                if (event.type == "set") {
                  onFocus();
                  setBirthDate(Moment(date).format('YYYY-MM-DD'));                  
                } else if (event.type == "dismiss") {
                  onFocus();
                }
              }}
              maximumDate={new Date(Moment(new Date()).format('YYYY-MM-DD'))}
              textColor= "#000"
              locale={language==="TR"?"tr-TR":"en-EN"}
              style={{width: '100%', height: 180, backgroundColor: colorScheme === 'dark' ? 'black' : "white", borderWidth: 1,  color: color, 
              borderColor: color, borderRadius: 14, top: '5%', bottom: '1%'}}
            />
        }
        <Modal 
          isVisible={isWarmVisible}
          onBackdropPress={closeWarm}
          style={{alignItems: "center"}}>
          <View style={{borderRadius: 15, backgroundColor: colorScheme === 'dark' ? "black" : 'white', width: '95%', padding: '4%', alignItems: "center", }}>
            <Ionicons size={30} style={{ top:3, }} name="alert-circle-outline" color={colorScheme === 'dark' ? "white" : 'black'} />
            <Text style={{top: 5}}>{language==="TR"?
            "Bu uygulamada paylaşılan bilgiler genel olup bebeğinizin içinden geçeceği büyüme konuları ile ilgili yardımcı bilgi içermektedir. Her bebeğin büyümesi kendine özel olması sebebi ile en doğru bilgiyi doktorunuzdan alabilirsiniz"
            :
            "The information shared in this application is general and contains helpful information about the growth content your baby will be contaminated. Since each baby's growth is unique, please contact your doctor."}</Text>
            <View style={styles.separatorWarm} lightColor="#eee" darkColor={colorScheme === 'dark' ? "white" : "rgba(255,255,255,0.1)"} />
            <View style={{width: 120, top: 12}}>
              <Button title={language==="TR"?"Tamam":"OK"} onPress={() => closeWarm()}></Button>
            </View>            
          </View>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '85%',
    height: 55,  
    margin: 5,
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
    alignItems: 'center',
  },
  image: {
    width: '65%',
    height: '35%',
    bottom: '0%'
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
  separatorWarm: {
    marginVertical: 3,
    height: 1,
    width: '100%',
    left: '0%',
    top:15
  },
})
