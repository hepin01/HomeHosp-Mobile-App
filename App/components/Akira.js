import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Keyboard
} from 'react-native';

import BaseInput from './BaseInput';
import { COLORS } from './Common'

const SUCCESS_COLOR = COLORS.BLUE;
const ORIGINAL_COLOR = '#98a0ab';


export default class Akira extends BaseInput {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    /*
     * this is applied as active border and label color
     */
    borderColor: PropTypes.string,
    labelHeight: PropTypes.number,
    inputPadding: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    borderColor: '#98a0ab',
    labelHeight: 24,
    inputPadding: 16,
    height: 48,
    animationDuration: 200,
  };


  // keyboardWillHide = () => {
  //   Animated.timing(this.interpolatedColorL, {
  //     duration: 400,
  //     toValue: 1,
  //   }).start();
  // };

  render() {
    const {
      label,
      style: containerStyle,
      height: inputHeight,
      labelHeight,
      inputPadding,
      Regular125,
      labelStyle,
      borderColor,
      normalColor
    } = this.props;
    const {
      width,
      focusedAnim,
      value,
      isFocused
    } = this.state;

    let borderBottomColor = focusedAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [ORIGINAL_COLOR, SUCCESS_COLOR]
    });
    
    let borderBottomColorIn = focusedAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [ORIGINAL_COLOR, ORIGINAL_COLOR]
    });

    return (
      <View style={containerStyle} onLayout={this._onLayout}>
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={{
              width,
              height: labelHeight,
              justifyContent:'center',
              transform: [
                {
                  translateY: focusedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [labelHeight + inputPadding, 0],
                  }),
                },
                {
                  translateX: focusedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -7],
                  }),
                },
              ],
            }}
          >
            <Text style={labelStyle}>
              {label}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            width,
            height: inputHeight,
            borderColor: normalColor ? borderBottomColorIn : borderBottomColor,
            borderRadius: 5,
            borderWidth:1.3
          }}
          >
        <TextInput
          ref={this.input}
          {...this.props}
          style={[
            styles.textInput,
            Regular125,
            {
              width: width-3,
              height: inputHeight-3,
              paddingHorizontal: inputPadding
            },
          ]}
          allowFontScaling={false}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={'transparent'}
        />
        </Animated.View>
        {/* left border */}
        {/* <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: inputHeight,
            width: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1],
            }),
            backgroundColor: borderBottomColor,
            borderRadius: 5
          }}
        /> */}
        {/* top border */}
        {/* <Animated.View
          style={{
            position: 'absolute',
            top: labelHeight,
            width,
            height: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1],
            }),
            backgroundColor: borderTopColor,
            borderRadius:5
          }}
        /> */}
        {/* right border */}
        {/* <Animated.View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            height: inputHeight,
            width: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1],
            }),
            backgroundColor: borderRightColor,
            borderRadius: 5
          }}
        /> */}
        {/* bottom border */}
        {/* <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            height: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1],
            }),
            width,
            backgroundColor: borderLeftColor,
            borderRadius: 5
          }}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    padding: 0,
    color: COLORS.LIGHT_GRAY,
    fontSize: 18,
    textAlign: 'center',
    borderRadius: 10
  },
});
