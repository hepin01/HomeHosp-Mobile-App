import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import {useSelector} from 'react-redux';
import images from '../../assets/images';
import {getCurrentSchedule} from '../../networking/APIMethods';
import {Loader} from '../../components/Loader';
import moment from 'moment';
import {ButtonComponent} from '../../components/ButtonComponent';
import {SmallButton} from '../../components/SmallButton';
import {displayErrorMsg, getWebViewUrl, isMedicalProvider, isProvider} from '../../utiles/common';
import {webview} from '../../networking/Constats';
import {RefreshControl} from 'react-native';
import {capitalize} from 'lodash';

const MySchedule = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [fetch, setFetch] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [scheduleType, setScheduleType] = useState('');
  const [arrScheduleType, setArrScheduleType] = useState([
    {
      id: 1,
      selected: false,
      label: 'Fixed Schedule',
    },
    {
      id: 2,
      selected: false,
      label: 'Variable Schedule',
    },
  ]);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  React.useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      getSchedule();
    });
    return () => focus();
  }, []);

  function createScheduleData(response) {
    try {
      setScheduleType(response?.scheduleType);
      const schedule = response?.scheduleWeeks[0]?.schedules || [];
      const weekDays = moment.weekdays().map((item, index) => {
        return {
          id: index,
          day: item,
          schedule: null,
        };
      });
      let temp = [...weekDays];
      weekDays.forEach((weekDay, index) => {
        schedule.forEach(scheduleDay => {
          if (scheduleDay.day.code == weekDay.id) {
            const obj = {
              ...weekDay,
              schedule: scheduleDay,
            };
            temp.splice(index, 1, obj);
          }
        });
      });
      setCurrentSchedule(temp);
    } catch (error) {
      console.log(error)
    }
   
  }

  function getSchedule() {
    // /if (fetch == false) {
    setFetch(true);
    // }
    const payload = {week: moment().week()};
    getCurrentSchedule(
      payload,
      response => {
        setFetch(false);
        setRefreshing(false);
        // setCurrentSchedule(response);
        createScheduleData(response);
      },
      error => {
        console.log(error)
        setFetch(false);
        setRefreshing(false);
        displayErrorMsg(error);
      },
    );
  }

  function renderFromTo(isOff, fromTime, toTime) {
    return (
      <View>
        {!isOff ? (
          <View>
            <Text style={commonStyles.Medium125}>
              From {moment(fromTime).format('hh:mma')} - To{' '}
              {moment(toTime).format('hh:mma')}
            </Text>
          </View>
        ) : (
          <Text style={commonStyles.Medium125}>NA</Text>
        )}
      </View>
    );
  }

  function renderItem({item, index}) {
    const {schedule} = item;
    const isOldIndex = index % 2 == 0;
    if (schedule) {
      const {
        day: {longText},
        eFrom,
        eTo,
        eOff,
        mFrom,
        mTo,
        mOff,
      } = schedule;
      const renderMSlots = mFrom && mTo;
      const renderESlots = eFrom && eTo;
      return (
        <View style={styles.weekContainer}>
          <View key={index.toString()} style={styles.dayContainer(isOldIndex)}>
            <Text style={styles.day}>{longText}</Text>
            {renderMSlots ? renderFromTo(mOff, mFrom, mTo) : null}
            {renderESlots ? renderFromTo(eOff, eFrom, eTo) : null}
          </View>
        </View>
      );
    }
    return (
      <View style={styles.weekContainer}>
        <View key={index.toString()} style={styles.dayContainer(isOldIndex)}>
          <Text style={styles.day}>{item.day}</Text>
          <Text>-</Text>
        </View>
      </View>
    );
  }

  function handleSetSchedule() {
    const webviewUri = getWebViewUrl('schedule/');
    navigation.navigate(webview, {
      uri: webviewUri,
      title: 'My Schedule',
    });
  }

  function handleOnRefresh() {
    setRefreshing(true);
    getSchedule();
  }

  return (
    <View style={styles.container}>
      <Loader modalVisible={fetch} />

      <FlatList
        data={currentSchedule}
        style={[commonStyles.shadow]}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listcontainer}>
            <Text style={[commonStyles.Regular18]}>
              {'Welcome, '}
              <Text style={commonStyles.Bold18}>
                {user.firstname + ' ' + user.lastname}
              </Text>
            </Text>
            <View style={styles.scheduleSelector}>
              <Image
                resizeMethod="resize"
                resizeMode="contain"
                style={styles.imgClock}
                source={images.clock2}
              />
              <Text style={commonStyles.Regular12}>
                Working Schedule for this week
              </Text>
            </View>
            <Text
              style={[commonStyles.Bold18, {marginBottom: getCalculated(15)}]}>
              {`Weekly ${capitalize(scheduleType)} Schedule`}
            </Text>
          </View>
        }
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.BLUE}
            refreshing={refreshing}
            onRefresh={() => handleOnRefresh()}
          />
        }
      />
      {!isMedicalProvider() ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <SmallButton
            style={{padding: 15}}
            buttonTitle={'Set Schedule'}
            buttonAction={() => handleSetSchedule()}
          />
        </View>
      ) : null}
    </View>
  );
};

export default MySchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingVertical: getCalculated(19),
    paddingHorizontal: getCalculated(16),
  },
  listcontainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scheduleSelector: {
    width: '100%',
    borderRadius: 10.3,
    flexDirection: 'row',
    marginVertical: getCalculated(15),
    backgroundColor: COLORS.LIGHT_BLUE,
    paddingVertical: getCalculated(10),
    paddingHorizontal: getCalculated(5),
  },
  typeLabel: selected => ({
    ...commonStyles.RegularDark11,
    paddingVertical: getCalculated(10),
    paddingHorizontal: getCalculated(13),
    color: selected ? COLORS.WHITE : COLORS.BLUE,
  }),
  labelContainer: selected => ({
    borderRadius: selected ? 28.3 : 0,
    backgroundColor: selected ? COLORS.BLUE : COLORS.LIGHT_BLUE,
  }),
  imgClock: {
    width: getCalculated(15),
    height: getCalculated(15),
    marginHorizontal: getCalculated(10),
  },
  weekContainer: {
    backgroundColor: '#ffffff',
    ...commonStyles.shadow,
    width: '99%',
    alignSelf: 'center',
  },
  dayContainer: isOldIndex => ({
    paddingVertical: getCalculated(9),
    paddingHorizontal: getCalculated(15),
    backgroundColor: isOldIndex ? COLORS.BLUE.WHITE : COLORS.BACK_GRAY,
  }),
  day: {
    ...commonStyles.Bold125,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});
