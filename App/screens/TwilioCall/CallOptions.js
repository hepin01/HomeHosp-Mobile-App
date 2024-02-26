import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import images from '../../assets/images';
import {COLORS, getCalculated} from '../../components/Common';

const {width} = Dimensions.get('screen');
const buttonDim = width / 8;
const CallOptions = ({
  isVideoEnabled,
  isAudioEnabled,
  _onEndButtonPress,
  _onMuteButtonPress,
  _onChatButtonPress,
  _onVideoButtonPress,
}) => {
  return (
    <View style={styles.optionsContainer}>
      <Pressable style={styles.optionButton} onPress={_onMuteButtonPress}>
        {isAudioEnabled ? (
          <Image style={styles.iconMic} source={images.mic} />
        ) : (
          <Image style={styles.iconMic} source={images.micoff} />
        )}
      </Pressable>

      <Pressable style={styles.optionButton} onPress={_onChatButtonPress}>
        <Image style={styles.iconMic} source={images.chat} />
      </Pressable>

      <Pressable style={styles.optionButton} onPress={_onVideoButtonPress}>
        {isVideoEnabled ? (
          <Image style={styles.iconMic} source={images.videoon} />
        ) : (
          <Image style={styles.iconMic} source={images.videooff} />
        )}
      </Pressable>
      <Pressable
        style={styles.endButton}
        onPress={_onEndButtonPress}>
             <Image style={styles.iconMic} source={images.decline} />
        </Pressable>
    </View>
  );
};

export default CallOptions;

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getCalculated(20)
  },
  optionButton: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BLUE,
    width: getCalculated(buttonDim),
    height: getCalculated(buttonDim),
  },
  endButton: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.RED,
    width: getCalculated(buttonDim),
    height: getCalculated(buttonDim),
  },
  iconMic: {
    height: getCalculated(30),
    width: getCalculated(25),
    resizeMode: 'contain',
  },
});
