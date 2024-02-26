import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Platform,
  PixelRatio,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

export const window = Dimensions.get('window');

export const getCalculated = value => {
  if (window.height >= 800.0 && window.height <= 895.0) {
    // For devices Iphone 10 range. For android hd.
    return 667.0 * (value / 568.0);
  } else if (window.height >= 896.0) {
    // For XR and XS max.
    return 736.0 * (value / 568.0);
  } else {
    // For other.
    return window.height * (value / 568.0);
  }
};

const scale = window.width / 320;

export const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const COLORS = {
  BLUE: '#1fa4dd',
  DARK_GRAY: '#304156',
  LIGHT_GRAY: '#a8afb8',
  BACK_GRAY: '#f4f4f4',
  SUPER_LIGHT_GRAY: '#e9e9eb',
  RED: '#f44336',
  LIGHTER_GREY: '#98a0ab',
  WHITE: '#ffffff',
  GREEN: '#08cf53',
  LIGHT_BLUE: '#ebf4f8',
  PURPLE: '#6f42c1',
  Orange: '#ff9800',
  DELETEBG: '#304156',
  REDBG: "#fff0f0",
  YELLOWBG: "#fff4e5",
  GRAYBG: "#e6e6e6",
  BLURBG: "#ebf4f8",
  GREENBG: "#d9ffe7",
  BORDERBG: "#cacaca",
  PURPLEBG: "#e2d8f3"
};

export const stripe = {
  publishableKey: "pk_test_51IlmHUH1h4hHmJfz7qcCR3Z6yDw8e9nsRwfq2gFjzT0P8UxxHUXINqDeUpMxObVvBGs6R4tUh6lvryoNvm5c9w1K00Gk5UKVYh",
  secretKey: "sk_test_51IlmHUH1h4hHmJfz07BDHlFvIqLfKIJIfRkEN8IL83FBZtPvAlssCfxXaEGcOdVPa3c0Wq7YQ3S5VTxjeQm9yjiL001sp5X439",
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  Bold17White: {
    fontSize: getCalculated(17),
    textAlignVertical: 'center',
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
  },
  Regular11White: {
    textAlignVertical: 'center',
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(11),
  },
  Bold15: {
    fontSize: getCalculated(15),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
  },
  Bold155: {
    fontSize: getCalculated(15.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
  },
  Bold20: {
    fontSize: getCalculated(20),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Bold',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  Bold18: {
    fontSize: getCalculated(18),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
  },
  Bold17: {
    fontSize: getCalculated(16.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
  },
  Bold125: {
    fontSize: getCalculated(12.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Bold',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  Bold135: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Bold',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  BoldLight11: {
    fontSize: getCalculated(11),
    textAlignVertical: 'center',
    color: COLORS.LIGHTER_GREY,
    fontFamily: 'Roboto-Bold',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  RegularLight115: {
    fontSize: getCalculated(11.5),
    textAlignVertical: 'center',
    color: COLORS.LIGHTER_GREY,
    fontFamily: 'Roboto-Regular',
  },
  Light18: {
    fontSize: getCalculated(18),
    textAlignVertical: 'center',
    color: COLORS.LIGHTER_GREY,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  NavBold20: {
    fontSize: getCalculated(18),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  Medium16: {
    fontSize: getCalculated(16),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  Medium18: {
    fontSize: getCalculated(18),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  Medium15: {
    fontSize: getCalculated(15),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  Medium11: {
    fontSize: getCalculated(11),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  Regular125: {
    fontSize: getCalculated(12.5),
    textAlignVertical: 'center',
    // alignSelf: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
  },
  Regular12: {
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(12),
  },
  RegularBlack115: {
    textAlignVertical: 'center',
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(12),
  },
  RegularLight12: {
    textAlignVertical: 'center',
    color: COLORS.LIGHT_GRAY,
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(12),
  },
  Regular9: {
    textAlignVertical: 'center',
    color: '#000000',
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(9),
  },
  RegularDark11: {
    alignSelf: 'flex-start',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(11.5),
  },
  RegularLight11: {
    alignSelf: 'flex-start',
    color: COLORS.LIGHTER_GREY,
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(11),
  },
  Regular13: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.BLUE,
    fontFamily: 'Roboto-Regular',
  },
  RegularWhite13: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Regular',
  },
  RegularWhite10: {
    fontSize: getCalculated(10),
    textAlignVertical: 'center',
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Regular',
  },
  Regular10Blue: {
    fontSize: getCalculated(10),
    textAlignVertical: 'center',
    color: COLORS.BLUE,
    fontFamily: 'Roboto-Regular',
  },
  Regular10: {
    fontSize: getCalculated(10),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
  },
  Regular12Blue: {
    fontSize: getCalculated(12),
    textAlignVertical: 'center',
    color: COLORS.BLUE,
    fontFamily: 'Roboto-Regular',
  },
  Regular11Green: {
    fontSize: getCalculated(11),
    textAlignVertical: 'center',
    color: COLORS.GREEN,
    fontFamily: 'Roboto-Regular',
  },
  Regular11Orange: {
    fontSize: getCalculated(11),
    textAlignVertical: 'center',
    color: COLORS.Orange,
    fontFamily: 'Roboto-Regular',
  },
  Regular11Red: {
    fontSize: getCalculated(11),
    textAlignVertical: 'center',
    color: COLORS.RED,
    fontFamily: 'Roboto-Regular',
  },
  Regular135: {
    fontSize: getCalculated(13.5),
    // textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
  },
  Regular135Blue: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.BLUE,
    fontFamily: 'Roboto-Regular',
  },
  RegularGrey135: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: '#666666',
    fontFamily: 'Roboto-Regular',
  },
  RegularGrey11: {
    fontSize: getCalculated(11.5),
    textAlignVertical: 'center',
    color: '#666666',
    fontFamily: 'Roboto-Regular',
  },
  Regular115Blue: {
    fontSize: getCalculated(11.5),
    textAlignVertical: 'center',
    color: COLORS.BLUE,
    fontFamily: 'Roboto-Regular',
  },
  Regular16: {
    fontSize: getCalculated(16),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
  },
  Regular18: {
    fontSize: getCalculated(18),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
  },
  Regular155: {
    fontSize: getCalculated(15.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
  },
  Regular155Blue: {
    fontSize: getCalculated(15.5),
    textAlignVertical: 'center',
    color: COLORS.BLUE,
    fontFamily: 'Roboto-Regular',
  },
  Medium135: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  MediumBlue135: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.BLUE,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  Medium125: {
    fontSize: getCalculated(12),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  Medium11White: {
    fontSize: getCalculated(11),
    textAlignVertical: 'center',
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Medium',
    fontWeight: Platform.OS == 'android' ? 'bold' : '500',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.65,

    elevation: 5,
  },
  shadowCard: {
    width: '90%',
    backgroundColor: 'white',
    marginVertical: 15,
    padding: 15,
    borderRadius: 6,
  },
  shadowLine: {
    width: '100%',
    height: 0.5,
    backgroundColor: COLORS.SUPER_LIGHT_GRAY,
    marginTop: getCalculated(5),
  },
  lineShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.65,

    elevation: 0,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBgView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalMainView: {
    width: '100%',
    height: '35%',
    backgroundColor: 'white',
    borderRadius: getCalculated(20),
  },
  forgotPasswordImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginTop: 60,
  },
  fpView: {
    width: '100%',
    height: '100%',
    marginTop: 30,
  },
  detailsText: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    marginTop: 20,
    textAlign: 'center',
  },
  blueButton: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.BLUE,
    fontFamily: 'Roboto-Regular',
    alignSelf: 'flex-end',
  },
  increasedNavBar: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.BLUE,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  dropArrowStyle: {
    width: 15,
    height: 10,
    resizeMode: 'contain',
  },
  line: {
    backgroundColor: COLORS.SUPER_LIGHT_GRAY,
    marginVertical: 10,
    height: 1,
    width: '98%',
  },
});
