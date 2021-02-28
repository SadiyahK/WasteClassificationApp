import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';  

import AccountStack from './AccountStack';
import ClassifierScreen from '../screens/ClassifierScreen'

const RootNavigator = createBottomTabNavigator({
    Home: {
        screen: ClassifierScreen,
        navigationOptions:{  
            tabBarLabel:'Classifier',  
            tabBarIcon:({tintColor})=>(  
                <Icon name="ios-camera" color={tintColor} size={25}/>  
            )  
          } 
    },
    // Notifications: {
    //     screen: NotificationScreen,
    //     navigationOptions:{  
    //         tabBarLabel:'Notifications',  
    //         tabBarIcon:({tintColor})=>(  
    //             <Icon name="ios-notifications" color={tintColor} size={25}/>  
    //         )  
    //       }  
    // },
    Account: {
        screen: AccountStack,
        navigationOptions:{  
            tabBarLabel:'Profile',  
            tabBarIcon:({tintColor})=>(  
                <Icon name="ios-person" color={tintColor} size={25}/>  
            )  
          }  
    }, 
})

export default RootNavigator;
