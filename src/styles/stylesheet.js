/**
 * External stylesheet for styling
 */
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    appButtonContainer:{
        marginTop: 10,
        backgroundColor: '#8FD14F',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: '40%',
        alignContent: 'center'
    },  
    button:{
        color: '#FFFEF2',
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
    },
    loginText: {
        color: '#fff',
        marginTop: 25,
        textAlign: 'center'
      },
      preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
      },
      imageContainer: {
        height: '100%',
        width: '100%',
        opacity: 0.7,
        justifyContent: 'center',
    
    },
    inputStyle: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1,
        textShadowColor: '#fff',
        paddingLeft: 8,
        paddingTop: 15,
        color: '#fff'
      },
      text:{
        color: '#fff',
    },
    container: {
        flexDirection: "column",
        justifyContent: "center",
        height: '50%',
        width: '90%',
        marginHorizontal: '5%',
        backgroundColor: 'rgba(52, 52, 52, 0.55)',
        alignItems: 'center',
        borderRadius: 5,
      },
      imageIcon: {
        width: "40%", 
        height: "80%", 
        borderRadius: 200 / 2,
      },
      topContainer:{
        flexDirection: "column",
        justifyContent: "center",
        height: '35%',
        width: '100%',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
      }
});