import {StyleSheet, Switch, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles} from '../../../components/Common';
import moment from 'moment';

const InstantToday = () => {
  return (
    <View style={[commonStyles.shadow, commonStyles.shadowCard]}>
      <View style={styles.rowView}>
        <Text style={commonStyles.Regular12}>Instant Consultation</Text>
      </View>
      <View style={styles.todayView}>
        <Text style={commonStyles.Regular12}>Today's Date </Text>
        <Text style={commonStyles.Bold135}>
          {moment().format('ddd, MMM DD, YYYY')}
        </Text>
      </View>
    </View>
  );
};

export default InstantToday;

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
