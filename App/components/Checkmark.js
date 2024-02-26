import React from 'react';

import {StyleSheet, Pressable, Text, View, Image} from 'react-native';
import {commonStyles, getCalculated, COLORS} from './Common';
import Base from '../screens/Base/Base';
import images from '../assets/images';

export class Checkmark extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      isChecked,
      imageStyle,
      textStyle,
      title,
      checkmarkAction,
      showCheckbox = false,
      disabled = false,
    } = this.props;
    const selected = showCheckbox ? images.checked : images.radioselected;
    const unselected = showCheckbox ? images.unchecked : images.radio;
    return (
      <View>
        <Pressable
          disabled={disabled}
          style={[styles.buttonBgStyle, style]}
          onPress={() => checkmarkAction()}>
          <View style={styles.checkmarkBg(isChecked)}>
            <Image
              style={[styles.checkmark, imageStyle]}
              source={isChecked ? selected : unselected}
            />
          </View>
          <Text style={styles.text}>{title}</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonBgStyle: {
    // width: 'auto',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(13),
    color: '#242634',
    marginLeft: getCalculated(7),
  },
  checkmarkBg: isChecked => ({
    width: getCalculated(20),
    height: getCalculated(20),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 2,
  }),
  checkmark: {
    width: getCalculated(20),
    height: getCalculated(20),
    resizeMode: 'contain',
  },
});
