import React, { Component } from 'react';
import {View, StyleSheet, Text, StatusBar, Button, TextInput, Alert } from 'react-native';
import firebase from '../database/firebase';

export default class SettingsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            displayName: "",
            errors: "",
        };
    }

    updateEmail = () =>{
        var user = firebase.auth().currentUser;
        user.updateEmail(this.state.email)
        .then(() => {
            this.setState({email: ""})
        }).catch(function(error) {
            this.setState({ errors: "Unable to update email."})
            //Alert.alert(error.message);
        });
    }

    updateDisplayName = () =>{
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: this.state.displayName
          })
        .then(function() {
            this.setState({displayName: ""})
        }).catch(function(error) {
            str = this.state.errors + "\n Unable to update displayName."
            this.setState({ errors: str})
        });
    }

    onUpdatePress = () =>{
        if(this.state.email == "" && this.state.displayName == ""){
            Alert.alert("Please enter your updated details into the fields");
            return;
        }
        if(this.state.email != ""){
            this.updateEmail()
        }
        if(this.state.displayName != ""){
            this.updateDisplayName()
        }

        if(this.state.errors == ""){
            Alert.alert("Details have been updated!");
        }else{
            error = this.state.errors + "\n Please try again."
            Alert.alert(error);
        }
    }

    render() {
        return (
            <View style={{paddingTop:50, alignItems:"center"}}>

                <Text>Change displayName</Text>
                <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                    value={this.state.displayName}
                    onChangeText={(text) => { this.setState({displayName: text}) }}
                    placeholder="Name"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Text>Change Email</Text>
                <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                    value={this.state.email}
                    onChangeText={(text) => { this.setState({email: text}) }}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Button title="Update" onPress={this.onUpdatePress} />
                <Button title="Reset Password" onPress={() => this.props.navigation.navigate('ResetPassword')} />
                <Button title="Back to Profile" onPress={() => this.props.navigation.navigate('Profile')} />
            </View>
        );
    }
}