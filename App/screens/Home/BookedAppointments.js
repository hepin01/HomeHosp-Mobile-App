import {
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import moment from 'moment';
import images from '../../assets/images';
import {webview} from '../../networking/Constats';
import {getWebViewUrl} from '../../utiles/common';

const BookedAppointments = ({navigation, route: {params}}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [arrAppointments, setArrAppointments] = useState([]);

  React.useEffect(() => {
    if (params) setArrAppointments(params.appointments);
  }, [params]);

  const onRefreshhandler = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderItem = ({item, index}) => {
    const {_id, startDate, endDate, slots, duration} = item;
    const url = getWebViewUrl(`appointment-details/myapp/${_id}/`);
    return (
      <Pressable
        key={_id.toString()}
        style={styles.renderItem}
        onPress={() => {
          navigation.navigate(webview, {
            uri: url,
            title: 'Appointment Details',
          });
        }}>
        <View style={styles.details}>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMethod={'resize'}
              resizeMode={'contain'}
              style={styles.imgClock}
              source={images.clock}
            />
            <Text style={commonStyles.Regular12}>{duration + ' Mins'}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: getCalculated(5)}}>
            <Image
              resizeMethod={'resize'}
              resizeMode={'contain'}
              style={styles.imgClock}
              source={images.clock}
            />
            <Text style={{...commonStyles.Regular12, textAlign: 'center'}}>
              {moment(startDate).format('hh:mm A') +
                ' - ' +
                moment(endDate).format('hh:mm A')}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.appointmentCountContainer}>
            <Text style={commonStyles.Regular12}>Slots</Text>
            <Text style={commonStyles.Bold135}>{slots.length}</Text>
          </View>

          <Image
            style={styles.imgArrow}
            resizeMode={'contain'}
            resizeMethod={'resize'}
            source={images.nextarrowblue}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContaienr}>
        <Text style={commonStyles.Bold15}>Booked Appointments</Text>
        <FlatList
          data={arrAppointments}
          refreshing={refreshing}
          renderItem={renderItem}
          extraData={arrAppointments}
          contentContainerStyle={{paddingBottom: 200}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default BookedAppointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingnHorizontal: 18,
    backgroundColor: COLORS.WHITE,
  },
  inputContaienr: {
    marginTop: 14.5,
    marginHorizontal: 15,
  },
  renderItem: {
    flex: 1,
    width: '99%',
    flexShrink: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    justifyContent: 'space-between',
    marginVertical: getCalculated(8),
    paddingVertical: getCalculated(5),
    paddingHorizontal: getCalculated(13),
    ...commonStyles.shadow,
  },
  details: {
    // alignItems: 'center',
    marginRight: 5,
    // maxWidth: '35%',
    // flexDirection: 'row',
    // alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  imgClock: {
    width: getCalculated(15),
    height: getCalculated(15),
    marginHorizontal: getCalculated(5),
  },
  appointmentCountContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: getCalculated(8),
    backgroundColor: COLORS.LIGHT_BLUE,
  },
  imgArrow: {
    width: getCalculated(14),
    height: getCalculated(14),
    marginLeft: getCalculated(11),
  },
});
