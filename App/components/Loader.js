import React from 'react';

import {
  StyleSheet,
  Text,
  Modal,
  View,
  Image,
  PanResponder,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {COLORS, getCalculated} from './Common';
import images from '../assets/images';

import {
  ColorDotsLoader,
  Breathing,
  Bubbles,
  Circles,
  CirclesRotationScale,
  ColorDots,
  Dots,
  DoubleCircle,
  EatBean,
  Lines,
  LineDots,
  Music,
  NineCubes,
  OpacityDots,
  Pulse,
  Ripple,
  RotationCircle,
  RotationHole,
  CirclesLoader,
  PulseLoader,
  CirclesRotationScaleLoader,
} from 'react-native-indicator';
import BubblesLoader from 'react-native-indicator/lib/loader/BubblesLoader';
import RippleLoader from 'react-native-indicator/lib/loader/RippleLoader';
import NineCubesLoader from 'react-native-indicator/lib/loader/NineCubesLoader';
import RotationCircleLoader from 'react-native-indicator/lib/loader/CirclesRotationScaleLoader';

export class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        style={{}}
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => {
          this.props.closeLoader();
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalBgView}>
            <ColorDotsLoader
              color1={COLORS.BLUE}
              color2={'#e0f4fb'}
              color3={'#e7161d'}
              size={20}
              betweenSpace={10}
            />
            {/* <PulseLoader color={COLORS.BLUE} />
                        <BubblesLoader color={COLORS.BLUE} />
                        <RippleLoader color={COLORS.BLUE} />
                        <CirclesRotationScaleLoader color={COLORS.BLUE}/>
                        <NineCubesLoader color={COLORS.BLUE} /> */}
            {this.props.text ? (
              <Text text={this.props.text} textStyle={styles.text} />
            ) : null}
          </View>
        </View>
      </Modal>
    );
  }
}

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  modalBgView: {
    width: '100%',
    height: '90%',
    borderRadius: 10,
    // backgroundColor: "rgba(1, 1, 1, 0.6)",
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.WHITE,
    fontFamily: 'RobotoSlab-Regular',
    fontSize: getCalculated(13.5),
    fontWeight: '500',
    marginTop: getCalculated(12),
    textAlign: 'center',
    alignSelf: 'center',
  },
});
