import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, AsyncStorage} from 'react-native';

import { View } from '../components/Themed';
import Activity from '../components/Activity';
import activityColor from '../hooks/activityColor';

export default function TabOneScreen(props:any) {
  const colorOfActivity = activityColor();
  const [helps, setHelps] = useState();

  useEffect(() => {    
    const options = { method: "GET", headers: { Accept: 'application/json', 'Content-Type': 'application/json'}};
    const getHelps = async () => {
      try {
        await AsyncStorage.getItem('id').then((value) => {
          if (value !== null && JSON.parse(value) != null) {
            fetch('http://localhost:4001/api/v1/helps?id='+JSON.parse(value), options).then((response) => response.json()).then((json) => {
              var jsonStr = JSON.stringify(json);
              // console.log(jsonStr);
              setHelps(jsonStr);
            }).catch((error) => {
              console.error(error);
            });
          } else {
            props.navigation.replace('Register');
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
      <View style={styles.activities}>
        <ScrollView style={styles.activitiesScroll} showsVerticalScrollIndicator={false}>
            {helps == null ? null : JSON.parse(helps).response.map((item:any, index:number) => 
              <Activity key={index} label={item.label} typeName={item.type} type={getTypeIcon(item.type)} 
              detail={item.detail} activityColor={colorOfActivity}></Activity>)
            }
        </ScrollView>
      </View>
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
