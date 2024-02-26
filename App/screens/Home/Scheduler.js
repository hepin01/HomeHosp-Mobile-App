import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import FromToDatePicker from '../../components/FromToDatePicker';
import moment from 'moment';
import images from '../../assets/images';
import {
  findLatestProviderApp,
  getProviderAppBySchedule,
} from '../../networking/APIMethods';
import {Loader} from '../../components/Loader';
import {displayErrorMsg, getUTCIso, userId} from '../../utiles/common';

const Scheduler = ({navigation}) => {
  const [fromDate, setFromDate] = useState(moment());
  const [refreshing, setRefreshing] = useState(false);
  const [toDate, setToDate] = useState(moment());
  const [arrAvailableAppointments, setArrAvailableAppointments] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    getLatestAppointment();
    getSchedule(fromDate, toDate);
  }, []);

  function getSchedule(fromDate, toDate) {
    setFetching(true);
    const data = {
      from: getUTCIso(fromDate.startOf('day')),
      to: getUTCIso(toDate.endOf('day')),
      // userId: userId(),
    };
    getProviderAppBySchedule(
      data,
      response => {
        setArrAvailableAppointments(response);
        setFetching(false);
      },
      error => {
        setFetching(false);
        displayErrorMsg(error);
      },
    );
  }

  function getLatestAppointment() {
    const data = {userId: userId()};
    findLatestProviderApp(
      data,
      response => {
        setLastUpdate(response);
      },
      error => {
        setFetching(false);
        displayErrorMsg(error);
      },
    );
  }

  const renderItem = ({item, index}) => {
    const {_id, appointments, sessionNumber, count} = item;
    const appStartTime = appointments[0].startDate;
    const appEndTime = appointments[appointments.length - 1].startDate;
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('BookedAppointments', {
            appointments: appointments,
          })
        }
        key={_id.toString()}
        style={styles.renderItem}>
        <View style={styles.slotsContainer}>
          <View style={{flexDirection: 'row', width: '80%'}}>
            <Image
              resizeMethod={'resize'}
              resizeMode={'contain'}
              style={styles.imgAppointment}
              source={images.appointments}
            />
            <Text style={{...commonStyles.Regular10}}>
              {moment(_id).format('ddd, MMM DD, YYYY')}
            </Text>
          </View>
          <View style={[styles.details]}>
            <Image
              resizeMethod={'resize'}
              resizeMode={'contain'}
              style={styles.imgClock}
              source={images.clock}
            />
            <Text style={{...commonStyles.Regular10}}>
              {moment(appStartTime).format('hh:mm A') +
                ' - ' +
                moment(appEndTime).format('hh:mm A')}
            </Text>
          </View>
        </View>
        <View style={styles.appointmentCountContainer}>
          <Text style={commonStyles.Regular12}>
            {sessionNumber == 1 ? 'Appointment' : 'Appointments'}
          </Text>
          <Text style={commonStyles.Bold135}>{count}</Text>
        </View>
      </Pressable>
    );
  };

  const onRefreshhandler = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <Loader
        closeLoader={() => setFetching(false)}
        text={''}
        modalVisible={fetching}
      />
      <View style={styles.container}>
        <View style={styles.inputContaienr}>
          <Text style={commonStyles.Bold15}>My Appointments</Text>
        </View>
        <View style={styles.datePickerContaner}>
          <FromToDatePicker
            startDateLabel={fromDate.format('MMM DD YYYY')}
            endDateLabel={toDate.format('MMM DD YYYY')}
            onEndDateSelection={date => {
              if (date) {
                getSchedule(fromDate, date);
                setToDate(date);
              } else {
                getSchedule(moment(), toDate);
                setToDate(moment());
              }
            }}
            onStartDateSelection={date => {
              if (date) {
                setFromDate(date);
                getSchedule(date, toDate);
              } else {
                setFromDate(moment());
                getSchedule(moment(), toDate);
              }
            }}
          />
        </View>
        <View style={styles.inputContaienr}>
          <Text style={commonStyles.Bold15}>Available Slots</Text>
        </View>
        {!fetching ? (
          arrAvailableAppointments.length ? (
            <FlatList
              contentContainerStyle={{paddingBottom: 200}}
              showsVerticalScrollIndicator={false}
              onRefresh={() => onRefreshhandler()}
              refreshing={refreshing}
              data={arrAvailableAppointments}
              renderItem={renderItem}
              extraData={arrAvailableAppointments}
              keyExtractor={item => item._id.toString()}
            />
          ) : (
            <View style={styles.emptyListContainer}>
              <Image
                style={styles.imgEmptyList}
                source={images.noappointments}
              />
              <Text style={commonStyles.Regular12}>
                No available slots with in the selected date
              </Text>
            </View>
          )
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color={COLORS.BLUE} />
          </View>
        )}
      </View>

      {lastUpdate ? (
        <View style={styles.bottomBanner}>
          <Text style={commonStyles.Regular11White}>
            Last Appointment Booked:{' '}
            {moment(lastUpdate?.startDate).format('ddd, MMM DD, YYYY')}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default Scheduler;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: COLORS.WHITE,
  },
  inputContaienr: {
    marginTop: 14.5,
  },
  datePickerContaner: {
    marginTop: 8,
    marginBotton: 12,
  },
  emptyListContainer: {
    width: '100%',
    height: getCalculated(192),
    borderRadius: 10,
    marginTop: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.7,
    shadowRadius: 2.65,
    elevation: 5,
  },
  imgEmptyList: {
    width: getCalculated(125),
    height: getCalculated(114),
    marginBottom: getCalculated(33),
  },
  bottomBanner: {
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: COLORS.BLUE,
    paddingVertical: Platform.OS ? getCalculated(20) : getCalculated(10),
  },
  renderItem: {
    // height: 100,
    width: '99%',
    // flex: 1,
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getCalculated(10),
    borderRadius: 10,
    marginVertical: getCalculated(8),
    ...commonStyles.shadow,
  },
  appointmentCountContainer: {
    // flex: 1,
    padding: getCalculated(8),
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.LIGHT_BLUE,
  },
  slotsContainer: {
    // flex: 0.5,
    justifyContent: 'center',
  },
  imgAppointment: {
    width: getCalculated(14),
    height: getCalculated(14),
    marginHorizontal: getCalculated(10),
  },
  imgClock: {
    width: getCalculated(15),
    height: getCalculated(15),
    marginHorizontal: getCalculated(10),
  },
  details: {
    flexDirection: 'row',
    // width: Platform.OS == 'ios' ? '80%' : '65%',
    marginTop: getCalculated(15),
  },
});
