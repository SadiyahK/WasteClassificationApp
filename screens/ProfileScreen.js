/**
 * ProfileScreen: Handles displaying the user's details by reading data
 * from the remote database.
 */
import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import firebase from '../database/firebase';
import stylesheet from '../styles/stylesheet.js'

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
      this.props.navigation.navigate('Signin')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  

  render() {
    this.state = { 
      displayName: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
      uid: firebase.auth().currentUser.uid
    }    
    return (
    <View>
      {/* Icon */}
      <View style={stylesheet.topContainer}>
        <Image source={require('../assets/p-trans.png')} style={stylesheet.imageIcon}/>
      </View>

      {/* Display user data */}
      <View style={stylesheet.container}>
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
        <Button title="Reset Password" onPress={() => this.props.navigation.navigate('ResetPassword')} />
        <TouchableOpacity onPress={() => this.onSignOutClick()} style={stylesheet.appButtonContainer}>
          <Text style={ stylesheet.button } onPress={() => this.onSignOutClick()}>Logout</Text>
        </TouchableOpacity>
        
      </View>                      
    </View>
    );
  }
}
