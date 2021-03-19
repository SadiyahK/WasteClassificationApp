import React, { Component } from 'react';
import {View, StyleSheet, Text, StatusBar, Button, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import firebase from '../database/firebase';
import stylesheet from '../styles/stylesheet.js'

export default class ResetPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
        };
    }

    onResetPasswordPress = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                Alert.alert("Password reset email has been sent.");
                this.setState({ email: ""})
            }, (error) => {
                Alert.alert(error.message);
            });
    }

    render() {
        return (
            <View>
    <View style={stylesheet.topContainer}>
      <Image source={require('../assets/p-trans.png')} style={stylesheet.imageIcon}/>
    </View>
        <View style={{...stylesheet.container, height: '40%'}}>
                <TextInput style={{...stylesheet.inputStyle, borderTopWidth: 1,}}
                    value={this.state.email}
                    onChangeText={(text) => { this.setState({email: text}) }}
                    placeholder="Email"
                    placeholderTextColor= '#fff'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            <TouchableOpacity onPress={this.onResetPasswordPress} style={{...stylesheet.appButtonContainer, width: '70%'}}>
                <Text style={ stylesheet.button } onPress={this.onResetPasswordPress}>Reset Password</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={stylesheet.appButtonContainer}>
                <Text style={ stylesheet.button } onPress={() => this.props.navigation.goBack(null)}>Go Back</Text>
            </TouchableOpacity> */}
                {/* <Button title="Reset Password" onPress={this.onResetPasswordPress} />
                <Button title="Go Back" onPress={() => this.props.navigation.goBack(null)} />   */}
        </View>
      </View>
            // <View style={{paddingTop:50, alignItems:"center"}}>
            //     <Text>Forgot Password</Text>
            //     <TextInput style={{width: 200, height: 40, borderWidth: 1}}
            //         value={this.state.email}
            //         onChangeText={(text) => { this.setState({email: text}) }}
            //         placeholder="Email"
            //         keyboardType="email-address"
            //         autoCapitalize="none"
            //         autoCorrect={false}
            //     />
            //     <Button title="Reset Password" onPress={this.onResetPasswordPress} />
            //     <Button title="Go Back" onPress={() => this.props.navigation.goBack(null)} /> 
            //     {/* onPress={() => this.props.navigation.navigate('Signin')} */}
            // </View>
        );
    }
}