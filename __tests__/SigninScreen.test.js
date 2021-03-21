
import React from 'react';
import create from "react-test-renderer";
import ReactDOM from 'react-dom'
import renderer from "react-test-renderer";
//import { render, fireEvent, screen } from '@testing-library/react'
import { render } from '@testing-library/react-native'
import { shallow } from 'enzyme'

import SigninScreen from '../screens/SigninScreen';



// check placeholder text of email and password
// check alert pops up when one or more text fields is left blank
// check screen navigates to profile when input is correct and the sign in button is pressed
// check navigation to resetPass when link clicked
// check navigation to sign-up when link clicked.
{/* <input> element value should be empty (2x of these)
should update the state when a value is input
should display an error when no value is input */}

it("renders default elements", () =>{
    const { getAllByText, getByPlaceholderText } = render(<SigninScreen />)

    expect(getAllByText("Sign In").length).toBe(1)
    getByPlaceholderText("Email")
    getByPlaceholderText("Password")
})


// it('renders without crashing', () =>{
//     shallow(<SigninScreen />)
// })

// test('something'), () =>{
//     expect('something').to
// })

// const navigation = {
//     navigation: jest.fn()
// }
// const tree = renderer.create(<SigninScreen navigation={ navigation } />).toJSON();

// test('snapshot', () =>{
//     expect(tree).toMatchSnapshot()
// })

// test('navigate to signup', () =>{
//     const text = tree.root.findByProps({testID: 'sign-up-txt'}).props
//     text.onPress()
//     expect(navigation.navigate).toBeCalledWith('Signup')
// })

// test('placeholders', async () =>{
//     // const placeholder = tree.root.getByPlaceholderText('Email'); 
//     // expect(placeholder).tob
//     render(<SigninScreen />)
//     const text = screen.findByPlaceholderText("Email")
//     expect(text).toBe("Email")
// })

// describe("<App />", () => {
//     it('has 1 child', () => {
//         const tree = renderer.create(<App />).toJSON();
//         expect(tree.children.length).toBe(1);
//     });
// });