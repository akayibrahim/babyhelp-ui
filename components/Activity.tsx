import * as React from 'react';
import {useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from './Themed';
import Modal from 'react-native-modal';
import useColorScheme from '../hooks/useColorScheme';
import HTML from "react-native-render-html";
import ipAddress from '../hooks/ipAddress';
const ip = ipAddress();

export default function Activity(props: any) {
  const {activityColor, type, label, typeName, detail, id, readBefore} = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [opa, setOpa] = useState(1);
  const colorScheme = useColorScheme();
  const opacityOfActivity = 0.75;
  const contentWidth = useWindowDimensions().width;
  const modalBackColor = "white";
  const modalOpacity = 1;

  const openModal = () => {
    read(id);
    setModalVisible(true);
  };

  const closeModal = () => {    
    setModalVisible(false);
  };
  
  const read = (read: any) => {
    try {
      AsyncStorage.getItem('id').then((value) => {          
        if (value !== null && JSON.parse(value) != null) {
          var id = JSON.parse(value);
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read, id })
          };          
          fetch(ip + '/api/v1/read', requestOptions).then((response) => response.json()).then((data) => {
            //console.log(data);
            setOpa(opacityOfActivity);
          }).catch((error) => {
              console.error(error);
          });       
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    setOpa(!readBefore ? 1 : opacityOfActivity);
  }, [readBefore]);

  return (
    <View style={styles.containerName}>
      {
        //console.log(readBefore)
        //console.log(opa)
      }
      <TouchableOpacity onPress={openModal} style={{ alignItems: "center", width: '100%' }}>
        <View style={[styles.containerIn, {backgroundColor: activityColor, opacity: opa}]}>
          <Ionicons size={32} style={{ position: "absolute", left: '6%', top: '32%' }} name={type} color={'black'} />
          <Text style={[styles.title, {color:'black', fontSize:label.length < 18 ? 20 : label.length > 25 ? 15 : 17}]}>{label}</Text>
          <Text style={[styles.type2, {color:'black'}]}>{typeName}</Text>
          <Ionicons size={25} style={{ position: "absolute", right: '1%', top: '35%' }} name="chevron-forward-outline" color={'black'} />
        </View>
      </TouchableOpacity>
      <Modal 
        isVisible={isModalVisible}
        onSwipeComplete={closeModal}
        onBackdropPress={closeModal}
        swipeDirection={['down']}
        propagateSwipe={true}
        style={styles.modal}
      > 
        <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: colorScheme === 'dark' ? modalBackColor : modalBackColor, flex: detail.split(" ").length > 50 ? 0.6 : 0.3, padding: '10%', opacity: modalOpacity}}>
          <TouchableOpacity onPress = { () => closeModal()} style={{zIndex: 1}}>
            <View style={{ width: 80, height: 50,  position: "absolute", right: -20, borderWidth: 0, top: -20, backgroundColor: 'transparent' }} >
              <Ionicons size={32} style={{right: 0, position: "absolute"}} name="close-outline" color={colorScheme === 'dark' ? 'black' : 'black'} />
            </View>
          </TouchableOpacity>          
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 20, top: 40, color: colorScheme === 'dark' ? 'black' : 'black'}}>{label}</Text>
            <TouchableOpacity>
              <HTML source={{ html: detail +"<br>" }} contentWidth={contentWidth} containerStyle={{top: 40, backgroundColor: modalBackColor, }} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerName: {
    flexDirection: 'row',
    height: 90,
    top: 15,
  },
  containerIn: {
    width: '80%',
    height: 80,
    bottom:0,    
    borderRadius: 6,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  backOfType: {    
    backgroundColor: 'white',
    width: '16%',
    height: 30,
    position: "absolute",
    right: '18%',
    top: 0,
  },
  title: {
    fontSize: 20,
    marginLeft: 60,
    padding: 5,
    top: 10,    
  },
  detail: {
    fontSize: 15,
    marginLeft: 14,
    padding: 5,
    position: "absolute",
    bottom: 5,
    color: 'black',
  },
  type: {
    fontSize: 12,    
    justifyContent: "center",
    margin: '10%',
    color: 'black',
  },
  type2: {
    position: "absolute",
    fontSize: 15,
    marginLeft: 62,
    padding: 5,
    top: 42,    
  },
});
