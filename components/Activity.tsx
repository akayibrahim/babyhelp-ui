import * as React from 'react';
import {useState} from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from './Themed';
import Modal from 'react-native-modal';
import useColorScheme from '../hooks/useColorScheme';
import HTML from "react-native-render-html";

export default function Activity(props: any) {
  const {activityColor, type, label, typeName, detail} = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  
  const contentWidth = useWindowDimensions().width;

  return (
    <View style={styles.containerName}>      
      <TouchableOpacity onPress={toggleModal} style={{ alignItems: "center", width: '100%' }}>
        <View style={[styles.containerIn, {backgroundColor: activityColor}]}>
          <Ionicons size={32} style={{ position: "absolute", left: '6%', top: '32%' }} name={type} color={'black'} />
          <Text style={[styles.title, {color:'black'}]}>{label}</Text>
          <Text style={[styles.type2, {color:'black'}]}>{typeName}</Text>
          <Ionicons size={25} style={{ position: "absolute", right: '1%', top: '35%' }} name="chevron-forward-outline" color={'black'} />
        </View>
      </TouchableOpacity>
      <Modal 
        isVisible={isModalVisible}
        onSwipeComplete={toggleModal}
        swipeDirection={['down']}
        propagateSwipe={true}
        style={styles.modal}
      > 
        <View style={{borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: colorScheme === 'dark' ? 'white' : 'white', flex:0.88, padding: '10%'}}>
          <TouchableOpacity onPress = { () => toggleModal()} style={{zIndex: 1}}>
            <View style={{ width: 80, height: 50,  position: "absolute", right: -15, borderWidth: 0, top: -15, backgroundColor: colorScheme === 'dark' ? 'white' : 'white' }} >
              <Ionicons size={32} style={{right: 0, position: "absolute"}} name="close-outline" color={colorScheme === 'dark' ? 'black' : 'black'} />
            </View>
          </TouchableOpacity>          
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 20, top: 40, color: colorScheme === 'dark' ? 'black' : 'black'}}>{label}</Text>
            <TouchableOpacity>
              <HTML source={{ html: detail }} contentWidth={contentWidth} containerStyle={{top: 40, backgroundColor: "white", }} />
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
