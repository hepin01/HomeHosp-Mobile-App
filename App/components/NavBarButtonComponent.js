import React, {Component} from 'react';

import {TouchableOpacity, Platform, Image, StyleSheet} from 'react-native';
import images from '../assets/images';
import Base from '../screens/Base/Base';

export default class NavBarButtonComponent extends Base {
  constructor(props) {
    super(props);
    this.state = {
      logo: this.props.showLogo == undefined,
    };
  }

  render() {
    return (
      <TouchableOpacity
        style={[this.props.style, {flexDirection: 'row'}]}
        onPress={this.props.onPress}>
        <Image style={styles.imageStyle} source={this.props.buttonImage} />
        {this.state.logo ? (
          <Image
            style={styles.headerlogoStyle}
            source={images.headerlogoWhite}
          />
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    resizeMode: 'contain',
    width: 24,
    height: 24,
    marginLeft: 20,
    alignSelf: 'center',
    marginBottom: Platform.OS == 'ios' ? 7 : 0,
  },
  headerlogoStyle: {
    height: 24,
    resizeMode: 'contain',
  },
});
