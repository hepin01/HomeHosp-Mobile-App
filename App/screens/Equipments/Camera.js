import {
  Alert,
  Linking,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {launchCamera} from 'react-native-image-picker';
import {openCamera} from 'react-native-image-crop-picker';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import TestButton from './TestButton';
const Camera = ({navigation: {pop}, navigation}) => {
  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      if (Platform.OS === 'android') {
        _requestCameraPermission().then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            openCamera();
          } else {
            Alert.alert('Oops!!', 'Camera permission denied.', [
              {
                text: 'Open settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Cancel',
                onPress: () => pop(),
              },
            ]);
          }
        });
      } else {
        openCamera();
      }
    });
    return () => focus();
  }, []);

  const openCamera = async () => {
    launchCamera({
      mediaType: 'photo',
      cameraType: 'front',
    }).then(response => handleResponse(response));
  };
  const handleResponse = ({didCancel, errorCode, errorMessage, assets}) => {
    if (errorCode || errorMessage) {
      Alert.alert('Oops!!', 'Something went wrong.', [
        {
          text: 'Ok',
          //   onPress: () => pop(),
        },
      ]);
    } else if (didCancel) {
      Alert.alert(
        'Confirm',
        'Are you sure you want to cancel the camera test?',
        [
          {
            text: 'Yes',
            onPress: () => pop(),
            style: 'destructive',
          },
          {
            text: 'No',
            onPress: () => openCamera(),
          },
        ],
      );
    } else {
      Alert.alert('Success', 'Image captured successfully.', [
        {
          text: 'Ok',
          onPress: () => pop(),
        },
      ]);
    }
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To test the camera we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  };
  return (
    <View style={styles.container}>
      <TestButton
        icon={'video-camera'}
        onPress={() => openCamera()}
        equipmentName={'camera'}
      />
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: 'center',
  },
});
