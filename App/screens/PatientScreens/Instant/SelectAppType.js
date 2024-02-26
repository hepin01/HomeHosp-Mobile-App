import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../../../components/Common';
import DocInfo from './DocInfo';

const SelectAppType = ({
  route: {
    params: {doctorDetails},
  },
}) => {
  return (
    <View style={styles.container}>
      <DocInfo 
      doctorDetails={doctorDetails} />
    </View>
  );
};

export default SelectAppType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
});
