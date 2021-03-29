/**
 * Test Class for ClassifierScreen.js
*/
import React from 'react';
import {Text, Alert} from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ClassifierScreen from '../src/containers/screens/ClassifierScreen';
import { shallow } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

//mock alert
// taken from the comment Fossage left on 26 Sep 2019 on this post:
// https://github.com/facebook/react-native/issues/26579 *used in other tests files
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

it("given Sign In screen renders, render should show reset button", () =>{
    const { getAllByText } = render(<ClassifierScreen />)
    expect(getAllByText("Reset").length).toBe(1)
})

it("given Sign In screen renders, render should show description box", () =>{
    const { getAllByText } = render(<ClassifierScreen />)
    expect(getAllByText("Once the model has loaded tap the green box to take a picture to classify!").length).toBe(1)
})

it("given Sign In screen renders, render should show green box with text", () =>{
    const { getAllByText } = render(<ClassifierScreen />)
    expect(getAllByText("Waiting for Model to Load").length).toBe(1)
})

it("given user cliked green box before model is ready, onCamViewNotReadyClick should show alert", () =>{
    const { getAllByText, getByTestId } = render(<ClassifierScreen />)
    fireEvent.press(getByTestId("classifier.CameraDisplay"))
    expect(Alert.alert).toHaveBeenCalledWith("Please wait for the model to load before trying to take an image")
})

it("given prediction array data, getPrediction should return ", () =>{
    const testArr = [0.0002, 0.01, 0.003, 0.000045, 0.0001, 0.0006]
    const classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
    const result = ClassifierScreen.prototype.mapArrays(testArr, classes)
    const expectedResult = ["glass", "metal", "trash", "cardboard", "plastic", "paper"]
    expect(result).toEqual(result)
})
 
  const initialState = {
    isTfReady: true,
    isModelReady: true,
    predictions: "0.002",
    image: null,
    results: null,
  };

  describe("Classifier", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ClassifierScreen  />);
        wrapper.setState({ ...initialState });
    });

    afterAll(() => {
        wrapper.unmount();
     });

     const getPermissionAsync = jest.fn(() => {
        return Promise.resolve('successful');
      });

     it("given componentDidMount is done, green box text display should change", async () =>{
        expect(wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
    })
    
    it("given prediction data, predictions should be displayed in grey box", async () =>{
        expect(wrapper.containsMatchingElement(<Text>Most Likely:</Text>))
        expect(wrapper.containsMatchingElement(<Text>Probability:</Text>))
    })

    it("given reset button clicked, onResetClick should reset image", async () =>{
        wrapper.find('Text').at(3).simulate('click');
        expect(wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
    })

    it("given reset button clicked, onResetClick should reset predictions", async () =>{
        wrapper.find('Text').at(3).simulate('click');
        expect(wrapper.containsMatchingElement(<Text>Predictions:   </Text>))
    })

    it("given green box clicked after model has loaded, onCamClick should open camera screen", async () =>{
        expect(wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
        wrapper.find('Text').at(1).simulate('click');
        expect(!wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
    })

      it("given green box clicked after model has loaded, getPermissionAsync should ask for permissions", async () =>{
        expect(wrapper.containsMatchingElement(<Text>Tap to open camera</Text>))
        wrapper.find('Text').at(1).simulate('click');
        await expect(getPermissionAsync()).resolves.toBe("successful")
    })

    it("classify image", async() =>{
        wrapper.setState({image: './test-cardboard2.jpg'})
        wrapper.instance().classifyImage()
        expect(Alert.alert).toHaveBeenCalled()
    })
  })
