import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {COLORS, commonStyles} from '../../components/Common';
import TestButton from './TestButton';
import Sound from 'react-native-sound';
import NavBarButtonComponent from '../../components/NavBarButtonComponent';
import images from '../../assets/images';

export default function Speaker({navigation}) {
  const [showButton, setShowButton] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [testAudio, setTestAudio] = useState(null);
  const objSound = new Sound('test_speaker.mp3', Sound.MAIN_BUNDLE, () => {
    setShowButton(true);
  });

  useEffect(() => {
    Sound.setCategory('Playback', true);
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!isAudioPlaying) {
          //  Audio is not playing so pop the screen
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Oops!!',
          'Are you sure you want to cancel the speaker test?',
          [
            {text: 'No', style: 'cancel', onPress: () => {}},
            {
              text: 'Yes',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => {
                stopAudio();
                navigation.dispatch(e.data.action);
              },
            },
          ],
        );
      }),
    [navigation, testAudio],
  );

  useEffect(() => {
    if (testAudio) {
      testAudio.play(success => {
        if (success) {
          Alert.alert('Success', 'Audio played successfully.');
          setIsAudioPlaying(false);
        } else {
          Alert.alert('Oops!!', 'Something went wrong.');
          setIsAudioPlaying(false);
        }
      });
    }
  }, [testAudio]);

  function toggleAudio() {
    if (!isAudioPlaying) {
      setTestAudio(objSound);
      setIsAudioPlaying(true);
    } else {
      stopAudio();
    }
  }

  const stopAudio = useCallback(() => {
    testAudio?.stop().release();
    setIsAudioPlaying(false);
  }, [testAudio]);

  return (
    <View style={styles.container}>
      {showButton ? (
        <View>
          <TestButton
            onPress={() => toggleAudio()}
            equipmentName={'speaker'}
            text={isAudioPlaying ? 'Stop playing audio' : 'Start playing audio'}
          />
        </View>
      ) : (
        <ActivityIndicator size={'large'} color={COLORS.BLUE} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: 'center',
  },
});
