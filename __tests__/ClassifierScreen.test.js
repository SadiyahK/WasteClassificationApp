import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native'

import ClassifierScreen from '../screens/ClassifierScreen';
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

it("renders default elements", () =>{
    const { getAllByText, getByPlaceholderText } = render(<ClassifierScreen />)

    expect(getAllByText("Reset").length).toBe(1)
    expect(getAllByText("Once the model has loaded tap the green box to take a picture to classify!").length).toBe(1)
    expect(getAllByText("Waiting for Model to Load").length).toBe(1)
})


// check it says 'model loading' then after a while 'tap to open camera
// check if i tap then the camera opens
// check if i tap before model is ready that the alert appears
// check prediction box is present at start
// check predictions contain text once a prediction is made?
// check reset button does it's job.

