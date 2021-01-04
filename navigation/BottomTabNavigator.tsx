import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import headerColor from '../hooks/headerColor';
import { Text, View } from '../components/Themed';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorOfHeader = headerColor();  

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{ activeTintColor: "white", inactiveTintColor: "black", style:{ backgroundColor: colorOfHeader, 
        shadowColor: "#000000", shadowOpacity: 1, shadowRadius: 30, shadowOffset: { height: 10, width: 10 }, elevation: 5 }, showLabel: false, }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="book-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
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

function TabOneNavigator() {
  const colorOfHeader = headerColor();
  const colorScheme = useColorScheme();
  const [week, setWeek] = useState();
  
  useEffect(() => {    
    const options = { method: "GET", headers: { Accept: 'application/json', 'Content-Type': 'application/json'}};
    const getWeeks = async () => {
      fetch('http://localhost:4001/api/v1/week', options).then((response) => response.json()).then((json) => 
      json.response).then((data) => {
        var week = data[0];
        setWeek(week.weeks);
      }).catch((error) => {
          console.error(error);
      });
    }
    getWeeks();
  }, []);

  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ 
          headerTitle: 'LUKE', 
          headerStyle: {
            // backgroundColor: colorOfHeader,
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS         
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          headerTitleStyle: {
            // fontWeight: 'bold',
            fontSize: 26,            
          },
          headerRight: () => (
            <View style={{ width: 50, top: 1}}>              
              <Text style={{fontSize: 10, textAlign: "center", }}>Week</Text>
              <Text style={{fontSize: 18, textAlign: "center", fontWeight: 'bold',}}>{week}</Text>
            </View>
          ),
      }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Profile' }}
      />
    </TabTwoStack.Navigator>
  );
}
