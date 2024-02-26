import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import images from '../assets/images';
import {COLORS, commonStyles, getCalculated} from './Common';

const DatePicker = ({
  onStartDateSelection,
  titleIOSStartDate = 'Select Start Date',
  dateFormat = 'ddd, MMM DD, YYYY',
  startDateLabel = 'Select Date',
  minStartDate,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);

  useEffect(() => {
    if (moment.isMoment(startDate)) {
      onStartDateSelection(moment(startDate));
    } else {
      onStartDateSelection(null);
    }
  }, [startDate]);

  useEffect(() => {
    setMinDate(minStartDate);
  }, []);

  const _handleStartDatePicked = date => {
    setStartDate(moment(date));
    setStartDatePickerVisible(false);
  };

  const textStartDate = moment.isMoment(startDate)
    ? startDate.format(dateFormat)
    : startDateLabel;

  return (
    <View>
      <View style={styles.datesView}>
        <View style={styles.labelContainer}>
          <Text style={commonStyles.RegularLight12}>{'Select Day and Time'}</Text>
        </View>
        <Pressable
          style={styles.dateView}
          onPress={() => setStartDatePickerVisible(true)}>
          <Image style={styles.calanderIcon} source={images.calenadar} />
          <Text style={[commonStyles.Regular12Blue, styles.dateText]}>
            {textStartDate}
          </Text>
          <Pressable
            style={styles.resetButton}
            onPress={() => setStartDate(null)}>
            <Image style={styles.resetImage} source={images.resetdate} />
          </Pressable>
        </Pressable>
      </View>
      <DateTimePicker
        isVisible={startDatePickerVisible}
        onConfirm={date => _handleStartDatePicked(date)}
        onCancel={() => setStartDatePickerVisible(false)}
        mode="date"
        date={minDate ? minDate : undefined}
        minimumDate={minDate ? minDate : undefined}
        confirmTextStyle={{
          color: COLORS.BLUE,
        }}
        cancelTextStyle={{color: COLORS.BLUE}}
        titleIOS={titleIOSStartDate}
        Medium16={{
          color: COLORS.BLUE,
        }}
      />
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  datesView: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  dateMainView: {width: getCalculated(116)},
  dateView: {
    flexDirection: 'row',
    width: 'auto',
    height: getCalculated(39),
    backgroundColor: COLORS.LIGHT_BLUE,
    borderColor: COLORS.BLUE,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 10,
  },
  dateText: {marginLeft: 10},
  calanderIcon: {width: 15, height: 15, resizeMode: 'contain'},
  labelContainer: {
    marginBottom: 5,
    marginTop:10
  },
  resetButton: {
    marginLeft: getCalculated(8),
    position:'absolute',
    right:10
  },
  resetImage: {
    height: getCalculated(13),
    width: getCalculated(13),
  },
});
