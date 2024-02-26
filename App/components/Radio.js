import React from 'react';

import {StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import {getCalculated} from './Common';
import Base from '../screens/Base/Base';
import images from '../assets/images';
import {getIsChecked} from '../utiles/common';

export class Radio extends Base {
  constructor(props) {
    super(props);
  }

  renderRadioButton() {
    const {
      isChecked,
      imageStyle,
      disabled = false,
      isNegative = false,
    } = this.props;
    const selectedIcon = disabled
      ? images.deselectradiobutton
      : images.radiobuttonactive;
    const emptyIcon = disabled
      ? images.radiodeacitvebutton
      : images.radiodeactive;
    let icon = images.radiodeactive;
    let checked = isChecked;
    if (isChecked !== null) {
      if (isNegative) {
        checked = !isChecked;
      }
    }
    icon = getIsChecked(checked) ? selectedIcon : emptyIcon;
    return <Image style={[styles.checkmark, imageStyle]} source={icon} />;
  }

  render() {
    const {style, title, checkmarkAction, disabled} = this.props;
    return (
      <View>
        <TouchableOpacity
          disabled={disabled}
          style={[styles.buttonBgStyle, style]}
          onPress={() => checkmarkAction()}>
          {this.renderRadioButton()}
          <Text style={[styles.text(disabled)]}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonBgStyle: {
    width: 'auto',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: disabled => ({
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(13),
    color: disabled ? '#98a0ab' : '#242634',
    marginLeft: getCalculated(10),
  }),
  checkmark: {
    width: getCalculated(17),
    height: getCalculated(17),
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
