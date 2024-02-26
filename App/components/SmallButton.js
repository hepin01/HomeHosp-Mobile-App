import React from 'react';

import {StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {commonStyles, COLORS} from './Common';
import Base from '../screens/Base/Base';

export class SmallButton extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    const {whiteBg} = this.props;
    return (
      <TouchableOpacity
        {...this.props}
        onPress={() => this.props.buttonAction()}
        disabled={this.props.disabled}
        style={[styles.smallButton(whiteBg), this.props.style, styles.shadow]}>
        {this.props.showImage && (
          <Image
            style={[
              {alignSelf: 'center', resizeMode: 'contain'},
              this.props.imageStyle,
            ]}
            source={this.props.source}
          />
        )}
        <Text
          style={[
            commonStyles.Medium135,
            {color: whiteBg ? COLORS.BLUE : COLORS.WHITE, alignSelf: 'center'},
            this.props.buttonTextStyle,
          ]}>
          {this.props.buttonTitle}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  smallButton: whiteBg => ({
    backgroundColor: whiteBg ? COLORS.WHITE : COLORS.BLUE,
    borderColor: whiteBg ? COLORS.BLUE : 'transparent',
    borderWidth: whiteBg ?  1 : 0,
    padding: 10,
    marginVertical: 7,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }),
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.65,

    elevation: 5,
  },
});
