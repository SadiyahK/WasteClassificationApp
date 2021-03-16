//             <Button title="settings" onPress={() => navigation.navigate('Settings')} />
import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, ImageBackground } from 'react-native';
import firebase from '../database/firebase';
import stylesheet from '../styles/stylesheet.js'

export default class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = { 
      uid: ''
    }
  }

  signOut = () => {
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
            <ImageBackground
            style={stylesheet.imageContainer}
            source={require('../assets/recycle.jpg')}>
      <View style={stylesheet.container}>
          {/* <Image source={require('../assets/third.jpg')} style={styles.imageContainer} /> */}
          <View style={stylesheet.inputStyle}>
            <Text style={stylesheet.text}>Name: {this.state.displayName}</Text>
          </View>
          <View style={stylesheet.inputStyle}>
            <Text style={stylesheet.text}>Email: {this.state.email}</Text>
          </View>
          <View style={stylesheet.inputStyle}>
            <Text style={stylesheet.text}>Password: **********</Text>
          </View>
        <TouchableOpacity onPress={() => this.signOut()} style={stylesheet.appButtonContainer}>
            <Text style={ stylesheet.button } onPress={() => this.signOut()}>Logout</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>                       
      </View>
    );
  }
}

const styles = StyleSheet.create({});