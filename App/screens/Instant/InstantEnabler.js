import {StyleSheet, Switch, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles} from '../../components/Common';
import moment from 'moment';

const InstantEnabler = ({status, ontoggleSwitch}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  useEffect(() => {
    console.log('InstantEnabler',status)
    setIsEnabled(status);
  }, [status]);

  function toggleSwitch() {
    ontoggleSwitch(!status);
  }
  return (
    <View style={[commonStyles.shadow, commonStyles.shadowCard]}>
      <View style={styles.rowView}>
        <Text style={commonStyles.Regular12}>Instant Consultation Enabled</Text>
        <Switch
          style={{transform: [{scaleX: 0.85}, {scaleY: 0.8}]}}
          trackColor={{false: COLORS.LIGHT_GRAY, true: COLORS.GREEN}}
          thumbColor={isEnabled ? COLORS.WHITE : COLORS.SUPER_LIGHT_GRAY}
          ios_backgroundColor={COLORS.SUPER_LIGHT_GRAY}
          onValueChange={() => {
            toggleSwitch();
          }}
          value={isEnabled}
        />
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

export default InstantEnabler;

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
