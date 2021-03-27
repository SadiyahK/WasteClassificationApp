/**
 * External stylesheet for styling
 */
import { StyleSheet } from 'react-native';
import {vw, vh} from 'react-native-viewport-units';

export default StyleSheet.create({
outerContainer: {
    flex: 5,
    alignItems: 'stretch',
    color: '#FFFEF2'
},
topContainer:{
  flexDirection: "column",
  justifyContent: "center",
  flex: 1,
  // height: '35%',
  // width: '100%',
  alignItems: 'stretch',
  // paddingTop: 15,
  // paddingBottom: 15,
},
greyContainer: {
  flex: 3,
  // flexDirection: "column",
  justifyContent: "center",
  // height: '50%',
  // width: '90%',
  marginHorizontal: vw*5,
  backgroundColor: 'rgba(52, 52, 52, 0.55)',
  alignItems: 'stretch',
  borderRadius: vh*1,
  marginBottom: vh*14,
},
 imageContainer: {
   height: '100%',
   width: '100%',
   opacity: 0.7,
   justifyContent: 'center',

 },
appButtonContainer:{
  marginTop: vh*3,
  backgroundColor: '#8FD14F',
  borderRadius: vh*1,
  paddingVertical: vh*1,
  paddingHorizontal:  vh*1,
  width: vw*45,
  alignSelf: 'center',
  alignContent: 'center'
},  
button:{
    color: '#FFFEF2',
    fontSize: vw*5,
    fontWeight: "bold",
    alignSelf: "center",
},
loginText: {
    color: '#fff',
    marginTop: vh*3,
    textAlign: 'center'
  },
    inputStyle: {
        width: vw*88,//'100%',
        marginBottom: vh*3,
        paddingBottom: vh*1,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: vh*0.1,
        textShadowColor: '#fff',
        paddingLeft: vh*1,
        paddingTop: vh*3,
        color: '#fff'
      },
imageIcon: {
  width: vw*30,
  height: vh*15, 
  borderRadius: vh*1,
  alignSelf: "center",
},
preloader: {
  left: vw*0,
  right: vw*0,
  top: vh*0,
  bottom: vh*0,
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff'
},
text:{
  color: '#fff',
},
});