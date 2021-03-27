/**
 * ProfileScreen: Handles displaying the user's details by reading data
 * from the remote database.
 */
import React, { Component, Alert } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import firebase from '../../database/Firebase';
import stylesheet from '../../styles/stylesheet.js'

export default class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = { 
      uid: ''
    }
  }

  // handles signin the user out of their account.
  onSignOutClick = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.replace('SignIn')
    })
    .catch(error => Alert.alert(error.message + "\n There was an issue signing you out. Please try again later."))
  }  

  render() {
    this.state = { 
      displayName: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
      uid: firebase.auth().currentUser.uid
    }
    return (
    <View style={stylesheet.outerContainer}>
      {/* Icon */}
      <View style={stylesheet.topContainer}>
        <Image source={require('../../assets/recycle-leaf.png')} style={stylesheet.imageIcon}/>
      </View>

      {/* Display user data */}
      <View style={stylesheet.greyContainer}>
        <View style={stylesheet.inputStyle}>
          <Text style={stylesheet.text}>Name: {this.state.displayName}</Text>
        </View>
        <View style={stylesheet.inputStyle}>
          <Text style={stylesheet.text}>Email: {this.state.email}</Text>
        </View>
        <View style={stylesheet.inputStyle}>
          <Text style={stylesheet.text}>Password: **********</Text>
        </View>

        {/* Navigation options: reset password + sign out */}
        <Text testID="profile.forgotPasswordLink" style={stylesheet.loginText} onPress={() => this.props.navigation.navigate('ResetPassword')}>
          Reset Password
        </Text>
        <TouchableOpacity testID="profile.signOutButton" onPress={() => this.onSignOutClick()} style={stylesheet.appButtonContainer}>
          <Text style={ stylesheet.button } onPress={() => this.onSignOutClick()}>Sign Out</Text>
        </TouchableOpacity>
      </View>                      
    </View>
    );
  }
}
