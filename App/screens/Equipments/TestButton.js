import {Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';

const TestButton = ({
  onPress,
  equipmentName = '',
  icon = 'video-camera',
  text = '',
}) => {
  return (
    <Pressable onPress={() => onPress()} style={styles.button}>
      <Text style={commonStyles.Medium11White}>
        {text.length ? text : `Click here test ${equipmentName}`}
      </Text>
    </Pressable>
  );
};

export default TestButton;

const styles = StyleSheet.create({
  button: {
    maxWidth: '90%',
    backgroundColor: COLORS.BLUE,
    padding: getCalculated(15),
    borderRadius: 10,
    alignItems: 'center',
  },
});
