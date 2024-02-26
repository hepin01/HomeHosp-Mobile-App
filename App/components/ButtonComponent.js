import React from 'react';

import {StyleSheet, TouchableOpacity, Text, Platform} from 'react-native';
import {getCalculated, COLORS} from './Common';
import Base from '../screens/Base/Base';

export class ButtonComponent extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        style={[
          styles.buttonBgStyle(this.props.disabled),
          this.props.style,
          styles.shadow,
        ]}
        onPress={() => this.props.buttonAction()}>
        <Text style={[styles.buttonTextText, this.props.buttonStyle]}>
          {this.props.buttonTitle}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonBgStyle: disabled => ({
    width: 'auto',
    backgroundColor: disabled ? COLORS.LIGHTER_GREY : COLORS.BLUE,
    borderRadius: 6,
    justifyContent: 'center',
    height: getCalculated(39),
    marginHorizontal: getCalculated(15),
  }),
  buttonTextText: {
    fontFamily: 'Roboto-Medium',
    fontSize: getCalculated(18),
    color: COLORS.WHITE,
    textAlign: 'center',
    paddingLeft: getCalculated(28),
    paddingRight: getCalculated(28),
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2.65,

    elevation: 5,
  },
});
