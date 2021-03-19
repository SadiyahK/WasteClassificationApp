import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 

import ProfileScreen from './screens/ProfileScreen'
import SettingsScreen from './screens/SettingsScreen'
import ClassifierScreen from './screens/ClassifierScreen'
import SignupScreen from './screens/SignupScreen'
import SigninScreen from './screens/SigninScreen'
import ResetPassword from './screens/ResetPasswordScreen'

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#8FD14F',//'#228C22',
        height: 100
      },
      headerTintColor: '#FFFEF2',
      headerTitleStyle: {
        fontWeight: '800',
        fontFamily: 'System',
        fontSize: 35,
      },
      headerLeft: () => (
        <Icon style={{ marginLeft: 85 }} name="ios-leaf" color={'#228C22'} size={40}/>
      ),
    }}>
      <HomeStack.Screen name="Home" component={ClassifierScreen} options={{ headerTitle: "Classifier" }}/>
    </HomeStack.Navigator>
  );
}

const AccountStack = createStackNavigator();

function AccountStackScreen() {
  return (
    <AccountStack.Navigator       
    screenOptions={{
      headerStyle: {
        backgroundColor: '#8FD14F',//'#228C22',
        height: 100
      },
      headerTintColor: '#FFFEF2',
      headerTitleStyle: {
        fontWeight: '800',
        fontFamily: 'System',
        fontSize: 35,
      },
      // headerLeft: () => (
      //   <Icon style={{ marginLeft: 85 }} name="ios-leaf" color={'#228C22'} size={40}/>
      // ),
    }}>
      <AccountStack.Screen name="Signup" component={SignupScreen} options={{ headerTitle: "Sign Up" }}/>
      <AccountStack.Screen name="Signin" component={SigninScreen} options={{ headerTitle: "Sign In" }}/>
      <AccountStack.Screen name="Profile" component={ProfileScreen} options={{ headerTitle: "Profile" }}/>
      <AccountStack.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: "Settings" }}/>
      <AccountStack.Screen name="Reset Password" component={ResetPassword} options={{ headerTitle: "Reset Password" }}/>
    </AccountStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      
        tabBarOptions={{
          activeTintColor:  '#228C22',
          inactiveTintColor: '#FFFEF2',
          style: {
            backgroundColor: '#8FD14F',//'#228C22',
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
          }
        }}
      >
        <Tab.Screen 
          name="Classifier" 
          component={HomeStackScreen} 
          options={{
            showLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="ios-camera" color={color} size={size}/>
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={AccountStackScreen} 
          options={{
            showLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="ios-person" color={color} size={size}/> 
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}