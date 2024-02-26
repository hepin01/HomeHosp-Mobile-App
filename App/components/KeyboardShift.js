
import React, { Component } from 'react';

import { PropTypes } from 'prop-types';

import { Platform, Animated, Dimensions, Keyboard, StyleSheet, TextInput, UIManager } from 'react-native';

const { State: TextInputState } = TextInput;

let keyboardDidShowSubEvent = "keyboardDidShow";
let keyboardDidHideSubEvent = "keyboardDidHide";

let keyboardShowDisplayDuration = 250;
let keyboardHideDisplayDuration = 250;

let keyboardDisplayTopSpacing = 0;

export default class KeyboardShift extends Component {

  constructor(props) {

    super(props);

    if (Platform.OS === 'ios' && props.animDuringKeyboardDisplayIOS !== undefined && props.animDuringKeyboardDisplayIOS !== undefined && props.animDuringKeyboardDisplayIOS) {
      keyboardDidShowSubEvent = "keyboardWillShow";
      keyboardDidHideSubEvent = "keyboardWillHide";
    }

    if (props.keyboardShowDisplayDuration !== undefined) {
      keyboardShowDisplayDuration = props.keyboardShowDisplayDuration;
    }

    if (props.keyboardHideDisplayDuration !== undefined) {
      keyboardHideDisplayDuration = props.keyboardHideDisplayDuration;
    }

    if (props.keyboardDisplayTopSpacing !== undefined) {
      keyboardDisplayTopSpacing = props.keyboardDisplayTopSpacing;
    }

    this.state = {
      shift: new Animated.Value(0),
    };

  }

  componentDidMount() {
    this.keyboardDidShowSub = Keyboard.addListener(keyboardDidShowSubEvent, this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener(keyboardDidHideSubEvent, this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  render() {

    const { children: renderProp } = this.props;
    const { shift } = this.state;

    return (

      <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
        {renderProp()}
      </Animated.View>

    );

  }

  handleKeyboardDidShow = (event) => {

    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();

    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {

      const fieldHeight = height;
      const fieldTop = pageY;

      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }

      Animated.timing(
        this.state.shift,
        {
          toValue: gap - keyboardDisplayTopSpacing,
          duration: keyboardShowDisplayDuration,
          useNativeDriver: true,
        }
      ).start();

    });
  };

  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: keyboardHideDisplayDuration,
        useNativeDriver: true,
      }
    ).start();
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  }
});

KeyboardShift.propTypes = {
  children: PropTypes.func.isRequired,
};
