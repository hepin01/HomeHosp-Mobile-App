import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SmallButton} from '../../../components/SmallButton';
import {getCalculated} from '../../../components/Common';

const TryAgain = ({onPressTryAgain}) => {
  return (
    <SmallButton
      buttonTitle={'Try Again'}
      buttonAction={() => onPressTryAgain()}
      style={styles.btn}
    />
  );
};

export default TryAgain;

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'flex-start'
  },
});
