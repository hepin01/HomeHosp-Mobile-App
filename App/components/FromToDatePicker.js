import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Alert, Dimensions, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import images from '../assets/images';
import {COLORS, commonStyles, getCalculated} from './Common';

const FromToDatePicker = ({
  onStartDateSelection,
  onEndDateSelection,
  titleIOSStartDate = 'Select Start Date',
  titleIOSEndDate = 'Selet Start Date',
  dateFormat = 'MMM DD, YYYY',
  startDateLabel = 'Select Date',
  endDateLabel = 'Select Date',
}) => {
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);

  useEffect(() => {
    if (moment.isMoment(startDate)) {
      onStartDateSelection(moment(startDate));
    } /* else {
      onStartDateSelection(null);
    } */
  }, [startDate]);

  useEffect(() => {
    if (moment.isMoment(endDate)) {
      onEndDateSelection(moment(endDate));
    } /* else {
      onEndDateSelection(null);
    } */
  }, [endDate]);

  const _handleStartDatePicked = date => {
    const startDate = moment(date);

    if (endDate) {
      if (startDate.isSameOrBefore(endDate)) {
        setStartDate(moment(date));
        setStartDatePickerVisible(false);
      } else {
        setStartDatePickerVisible(false);
        Alert.alert('Error', 'From date cannot be the date after to date');
      }
    } else {
      setStartDate(moment(date));
      setStartDatePickerVisible(false);
    }
  };

  const _handleEndDatePicked = date => {
    const endDate = moment(date);
    if (startDate) {
      if (endDate.isSameOrAfter(startDate)) {
        setEndDate(endDate);
        setEndDatePickerVisible(false);
      } else {
        setEndDatePickerVisible(false);
        Alert.alert('Error', 'To date cannot be the date before from date');
      }
    } else {
      setEndDate(endDate);
      setEndDatePickerVisible(false);
    }
  };

  const textStartDate = moment.isMoment(startDate)
    ? startDate.format(dateFormat)
    : startDateLabel;
  const textEndDate = moment.isMoment(endDate)
    ? endDate.format(dateFormat)
    : endDateLabel;

  return (
    <View>
      <View style={styles.datesView}>
        <View style={styles.dateMainView}>
          <View style={styles.labelContainer}>
            <Text style={commonStyles.RegularLight12}>{'From Date'}</Text>
          </View>
          <Pressable
            style={styles.dateView}
            onPress={() => setStartDatePickerVisible(true)}>
            <Image style={styles.calanderIcon} source={images.calenadar} />
            <Text style={[commonStyles.Regular12Blue]}>
              {textStartDate}
            </Text>
            <Pressable
              onPress={() => {
                setStartDate(null);
                onStartDateSelection(null);
              }}>
              <Image style={styles.resetImage} source={images.resetdate} />
            </Pressable>
          </Pressable>
        </View>
        <View style={styles.dateMainView}>
          <View style={styles.labelContainer}>
            <Text style={commonStyles.RegularLight12}>{'To Date'}</Text>
          </View>
          <Pressable
            style={styles.dateView}
            onPress={() => setEndDatePickerVisible(true)}>
            <Image style={styles.calanderIcon} source={images.calenadar} />
            <Text style={[commonStyles.Regular12Blue]}>
              {textEndDate}
            </Text>
            <Pressable
              onPress={() => {
                setEndDate(null);
                onEndDateSelection(null);
              }}>
              <Image style={styles.resetImage} source={images.resetdate} />
            </Pressable>
          </Pressable>
        </View>
      </View>
      <DateTimePicker
        isVisible={startDatePickerVisible}
        onConfirm={date => _handleStartDatePicked(date)}
        onCancel={() => setStartDatePickerVisible(false)}
        mode="date"
        // maximumDate={minStart}
        // minimumDate={maxStartDate}
        confirmTextStyle={{
          color: COLORS.BLUE,
        }}
        cancelTextStyle={{color: COLORS.BLUE}}
        titleIOS={titleIOSStartDate}
        Medium16={{
          color: COLORS.BLUE,
        }}
      />
      <DateTimePicker
        isVisible={endDatePickerVisible}
        onConfirm={date => _handleEndDatePicked(date)}
        onCancel={() => setEndDatePickerVisible(false)}
        mode="date"
        // maximumDate={minEndDate}
        // minimumDate={startDate.toDate()}
        confirmTextStyle={{
          color: COLORS.BLUE,
        }}
        cancelTextStyle={{color: COLORS.BLUE}}
        titleIOS={titleIOSEndDate}
        Medium16={{
          color: COLORS.BLUE,
        }}
      />
    </View>
  );
};

export default FromToDatePicker;

const styles = StyleSheet.create({
  datesView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateMainView: {
    // width: '40%',
  },
  dateView: {
    flexDirection: 'row',
    width: Dimensions.get('window').width/2.4,
    height: getCalculated(30),
    backgroundColor: COLORS.LIGHT_BLUE,
    borderColor: COLORS.BLUE,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: getCalculated(8),
    paddingVertical: getCalculated(7),
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 10,
  },
  dateText: {marginLeft: 10},
  calanderIcon: {width: 15, height: 15, resizeMode: 'contain'},
  labelContainer: {
    marginBottom: 11,
  },
  resetImage: {
    height: getCalculated(13),
    width: getCalculated(13),
  },
  resetButton: {
    marginLeft: getCalculated(8),
  },
});
