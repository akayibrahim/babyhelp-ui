import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import headerColor from '../hooks/headerColor';
import { Text, View } from '../components/Themed';
import ipAddress from '../hooks/ipAddress';
const ip = ipAddress();

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorOfHeader = headerColor();  
  const [updated, setUpdated] = useState(false);
  const [reRenderCount, setReRenderCount] = useState(0);

  useEffect(() => {
    setReRenderCount(reRenderCount+1);    
  }, [updated]);

  const reRender = () => {
    setUpdated(!updated);    
  }

  return (    
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{ activeTintColor: "white", inactiveTintColor: "black", style:{ backgroundColor: colorOfHeader, 
        shadowColor: "#000000", shadowOpacity: 1, shadowRadius: 30, shadowOffset: { height: 10, width: 10 }, elevation: 5 }, showLabel: false, }}>
      <BottomTab.Screen
        name="TabOne"
        //component={TabOneNavigator}
        children={()=><TabOneNavigator reRenderCount={reRenderCount} />}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="book-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        //component={TabTwoNavigator}
        children={()=><TabTwoNavigator reRender={reRender} />}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-outline" color={color} />,          
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator(props:any) {
  const colorOfHeader = headerColor();
  const colorScheme = useColorScheme();
  const [week, setWeek] = useState();
  const [name, setName] = useState();
  const [language, setLanguage] = useState();
  const [read, setRead] = useState([]);

  useEffect(() => {
    const getUserInfo = () => {
      try {
        AsyncStorage.getItem('id').then((value) => {          
          if (value !== null && JSON.parse(value) != null) {
            fetch(ip + '/api/v1/users?id='+JSON.parse(value)).then((response) => response.json()).then((json) =>
              json.response).then((data) => {                
                var usr = data[0];
                //console.log(usr);
                setName(usr.name);
                setLanguage(usr.language);
                setRead(usr.read.split(";").map(Number));
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
    const options = { method: "GET", headers: { Accept: 'application/json', 'Content-Type': 'application/json'}};
    const getWeeks = async () => {
      try {
        await AsyncStorage.getItem('id').then((value) => {
          if (value !== null && JSON.parse(value) != null) {
            fetch(ip + '/api/v1/week?id='+JSON.parse(value), options).then((response) => response.json()).then((json) => 
            json.response).then((data) => {
              var week = data[0];
              setWeek(week.weeks);
            }).catch((error) => {
                console.error(error);
            });     
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
    getWeeks();    
  }, [props.reRenderCount]);

  return (
    <TabOneStack.Navigator>
      {
        read.length === 0 ? <TabOneStack.Screen name=" " component={TabOneScreen}/> : 
        <TabOneStack.Screen
            name=" "
            //component={TabOneScreen}
            children={()=><TabOneScreen language={ language } read={read} navigation={props.navigation}/>}
            options={{ 
              headerTitle: name,
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS            
              },
              headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
              headerTitleStyle: {
                // fontWeight: 'bold',
                fontSize: 26,
                textTransform: 'uppercase',                
              },
              headerRight: () => (
                <View style={{ width: 50, top: 1}}>              
                  <Text style={{fontSize: 13, textAlign: "center", }}>{language === "TR" ? "Hafta" : "Week"}</Text>
                  <Text style={{fontSize: 19, textAlign: "center", fontWeight: 'bold',}}>{week}</Text>
                </View>
              ),
          }}
      />
      }
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator(props:any) {
  const [language, setLanguage] = useState();
  const colorScheme = useColorScheme();
  useEffect(() => {
    const getUserInfo = () => {
      try {
        AsyncStorage.getItem('id').then((value) => {          
          if (value !== null && JSON.parse(value) != null) {
            fetch(ip + '/api/v1/users?id='+JSON.parse(value)).then((response) => response.json()).then((json) =>
              json.response).then((data) => {                
                var usr = data[0];                
                setLanguage(usr.language);
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
  }, []);
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name=" "
        //component={TabTwoScreen}
        children={()=><TabTwoScreen reRender={ props.reRender } />}
        options={{ headerTitle: language==="TR"?"Profil":'PROFILE', headerStyle: { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff', } }}
      />
    </TabTwoStack.Navigator>
  );
}
