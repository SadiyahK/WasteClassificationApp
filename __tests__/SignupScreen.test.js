import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native'

import SignUpScreen from '../src/containers/screens/SignUpScreen';
import { Alert } from 'react-native'

//mock alert
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native')

    return Object.setPrototypeOf(
        {
            Alert: {
                ...RN.Alert,
                alert: jest.fn(),
            },
        },
        RN,
    )
})

//mock firebase
jest.mock('firebase', () => {
    return {
    initializeApp: jest.fn(),
    auth: () => ({
        createUserWithEmailAndPassword: () => Promise.resolve(),
        signOut: () => Promise.resolve(),
      }),
    };
  });

  it("renders default elements", () =>{
    const { getAllByText, getByPlaceholderText } = render(<SignUpScreen />)

    expect(getAllByText("Sign Up").length).toBe(1)
    //if placeholder text is shown then that means input fields are empty as expected
    getByPlaceholderText("Name")
    getByPlaceholderText("Email")
    getByPlaceholderText("Password")
})

it("navigate to signin", ()=>{
    const navigationMock = jest.fn()
    const { getByTestId } = render(<SignUpScreen navigation={{ replace: navigationMock}} />)

    fireEvent.press(getByTestId("signUp.signInLink"))
    expect(navigationMock).toBeCalledWith('SignIn')
})

it("shows invalid input message when only password input", ()=>{
    const { getByTestId, getByText } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("shows invalid input message when only email input", ()=>{
    const { getByTestId, getByText } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("shows invalid input message when only name input", ()=>{
    const { getByTestId, getByText } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("shows invalid input message when only email and password input", ()=>{
    const { getByTestId, getByText } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("shows invalid input message when only name and password input", ()=>{
    const { getByTestId, getByText } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

it("shows invalid input message when only name and email input", ()=>{
    const { getByTestId, getByText } = render(<SignUpScreen />)

    fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
    fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
    fireEvent.press(getByTestId("signUp.Button"))
    expect(Alert.alert).toHaveBeenCalled()
})

//  TODO:
// it("valid input data", async ()=>{
//     const navigationMock = jest.fn()
//     const { getByTestId, getByText } = render(<SignUpScreen navigation={{ navigate: navigationMock}} />)

//     fireEvent.changeText(getByTestId("signUp.EmailInput"), 'test123@hotmail.com')
//     fireEvent.changeText(getByTestId("signUp.NameInput"), 'name123')
//     fireEvent.changeText(getByTestId("signUp.PasswordInput"), 'test123')
//     fireEvent.press(getByTestId("signUp.Button"))
    
//     await act(() => new Promise((resolve) => setImmediate(resolve)))
//     expect(createUserWithEmailAndPassword).toHaveBeenCalled()
//     //!expect(navigationMock).toBeCalledWith('Signup')
// })

//can email be in non-conventional format?
// should i add more requirements to password e.g at least 4leters, nums + characters?
// validation of name?

