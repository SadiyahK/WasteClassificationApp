/**
 * ResetPasswordScreen: Handles the resetting of a user's password.
 */
import React, { Component } from 'react';
import {View, StyleSheet, Text, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import firebase from '../../database/Firebase';
import stylesheet from '../../styles/stylesheet.js'

export default class ResetPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
        };
    }

    // Handles communicating to firebase to send reset email
    onResetPasswordClick = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .then(() => {
            Alert.alert("Password reset email has been sent. Please check your spam box.");
            this.setState({ email: ""})
        }, (error) => {
            Alert.alert(error.message);
        });
    }

    render() {
        return (
        <View style={stylesheet.outerContainer}>
            {/* Top Icon */}
            <View style={stylesheet.topContainer}>
                <Image source={require('../../assets/recycle-leaf.png')} style={stylesheet.imageIcon}/>
            </View>

            <View style={{...stylesheet.greyContainer, height: '40%'}}>
                {/* Input text field */}
                <TextInput style={{...stylesheet.inputStyle, borderTopWidth: 1,}}
                    testID="reset.EmailInput"
                    value={this.state.email}
                    onChangeText={(text) => { this.setState({email: text}) }}
                    placeholder="Email"
                    placeholderTextColor= '#fff'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false} />
                {/* Reset button */}
                <TouchableOpacity testID="reset.Button" onPress={this.onResetPasswordClick} style={{...stylesheet.appButtonContainer, width: '70%'}}>
                    <Text style={ stylesheet.button } onPress={this.onResetPasswordClick}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    }
}