import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, AsyncStorage} from 'react-native';

import { View } from '../components/Themed';
import Activity from '../components/Activity';
import activityColor from '../hooks/activityColor';

export default function TabOneScreen(props:any) {
  const colorOfActivity = activityColor();
  const [helps, setHelps] = useState();
  const { language, navigation, read } = props

  useEffect(() => {    
    const options = { method: "GET", headers: { Accept: 'application/json', 'Content-Type': 'application/json'}};
    const getHelps = async () => {
      try {
        await AsyncStorage.getItem('id').then((value) => {
          if (value !== null && JSON.parse(value) != null) {
            fetch('http://localhost:4001/api/v1/helps?id='+JSON.parse(value), options).then((response) => response.json()).then((json) => {
              var jsonStr = JSON.stringify(json);
              //console.log(read);
              setHelps(jsonStr);
            }).catch((error) => {
              console.error(error);
            });
          } else {
            navigation.replace('Register');
          }
        });
      } catch (e) {
        console.error(e);
      }      
    }
    getHelps();
  }, []);

  const getTypeIcon = (type: string) => {
    if ("INFO" === type) {
      return "information-circle-outline";
    } else if ("ABILITY" === type ) {
      return "pulse-outline";
    } else if ("READY" === type ) {
      return "warning-outline";
    } else if ("FIRSTS" === type ) {
      return "medal-outline";
    } else if ("LEAP" === type ) {
      return "trending-up-outline";
    }
  }

  return (    
    <View style={styles.container}>      
      {helps == null || read === undefined || read.length === 0 || helps === undefined ? null : 
        <View style={styles.activities}>
          {
            console.log(read)
          }
          <ScrollView style={styles.activitiesScroll} showsVerticalScrollIndicator={false}>
              {JSON.parse(helps).response.sort((item:any, index:number) => read.includes(item.id) ? 1 : -1).map((item:any, index:number) =>             
                <Activity key={index} label={language === "TR" ? item.label : item.labelEng} typeName={language === "TR" ? item.type : item.typeEng} type={getTypeIcon(item.typeEng)} 
                detail={language === "TR" ? item.detail : item.detailEng} id={item.id} readBefore={read.includes(item.id)} activityColor={colorOfActivity} ></Activity>)              
              }
          </ScrollView>
        </View>
      }
    </View>
  );
}
/*
            {data == null ? null : data.map((item:any, index:number) => <Activity key={index} label="SLEEP QUALITY" typeName="INFO" type={"information-circle-outline"} activityColor={colorOfActivity}></Activity>)}
            <Activity key={1} label="RUTINES" typeName="INFO" type={"information-circle-outline"} activityColor={colorOfActivity}></Activity>
            <Activity key={2} label="FEEDING TIME" typeName="READY" type={"warning-outline"} activityColor={colorOfActivity}></Activity>
            <Activity key={3} label="VACCINE" typeName="READY" type={"warning-outline"} activityColor={colorOfActivity}></Activity>
            <Activity key={4} label="SLEEP TIME" typeName="INFO" type={"information-circle-outline"} activityColor={colorOfActivity}></Activity>
            <Activity key={5} label="BODY CONTROL" typeName="ABILITY" type={"pulse-outline"} activityColor={colorOfActivity}></Activity>
            <Activity key={6} label="POOP PATTERN" typeName="INFO" type={"information-circle-outline"} activityColor={colorOfActivity}></Activity>
            <Activity key={7} label="HEARING" typeName="ABILITY" type={"pulse-outline"} activityColor={colorOfActivity}></Activity>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activities: {
    top: '3%',    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  activitiesScroll: {
    height: '97%',
    top: 0,    
  },
});
