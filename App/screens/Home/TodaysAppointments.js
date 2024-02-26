import {
  View,
  Text,
  Image,
  Easing,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';

import { COLORS, commonStyles, getCalculated } from '../../components/Common';
import { connect } from 'react-redux';
import images from '../../assets/images';
import { SmallButton } from '../../components/SmallButton';
import AppointmentFilter from '../../components/AppointmentFilter';
import { getDoctorsAppointments } from '../../networking/APIMethods';
import ImageLoader from '../../components/ImageLoader';
import moment from 'moment';
import { Loader } from '../../components/Loader';
import { RefreshControl } from 'react-native';
import { getWebViewUrl } from '../../utiles/common';
import AppointmentCard from '../../components/AppointmentCard';
const TodaysAppointments = ({ user, navigation }) => {
  const [filterIndexSelected, setfilterIndexSelected] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [patientArray, setpatientArray] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [count, setCount] = useState(0);
  const [filter, setFilter] = useState({
    status: 'all',
    filter: 'upcoming',
    sessionType: 'all',
    from: null,
    to: null,
    patientName: '',
    limit: 100,
    offset: 0,
  });
  let scrollToEndNotified = false;

  useEffect(() => {
    fetchDoctorsAppointments(filter);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      console.log(filter);
      const initialFilter = {
        ...filter,
        limit: 100,
        offset: 0,
      };
      fetchDoctorsAppointments(initialFilter);
    });
  }, [filter]);

  const arrFilters = [
    capitalizeFirstLetter(filter.filter),
    capitalizeFirstLetter(
      filter.sessionType == 'all'
        ? 'Audio/Video'
        : filter.sessionType == 'telephonic'
          ? 'audio'
          : filter.sessionType,
    ),
  ];

  const fetchDoctorsAppointments = filters => {
    setShowFilter(false);
    setFilter(filters);
    setFetching(true);
    getDoctorsAppointments(
      filters,
      response => {
        if (filters.offset) {
          setFetching(false);
          setRefreshing(false);
          setpatientArray([...patientArray, ...response]);
        } else {
          setFetching(false);
          setRefreshing(false);
          setpatientArray(response);
        }
      },
      error => {
        setFetching(false);
        setRefreshing(false);
        console.log(error);
      },
    );
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleOnEndReached = () => {
    setFilter({
      ...filter,
      offset: parseInt(filter.offset + 30),
    });
  };

  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchDoctorsAppointments(filter);
  };

  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.filterView}>
        {arrFilters.map((item, index) => (
          <View key={index.toString()} style={styles.filterButton(false)}>
            <Text
              style={[
                commonStyles.Medium11White,
                styles.sessionButtonText(false),
              ]}>
              {item}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          style={{ justifyContent: 'flex-end' }}>
          <Image style={styles.filterIcon} source={images.filterwithcirle} />
        </TouchableOpacity>
      </View>
      {/* <Loader modalVisible={fetching} /> */}
      {fetching ? (
        // <Loader modalVisible={true} />
        null
      ) : (
        <>
          <FlatList
            nestedScrollEnabled
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ paddingBottom: 200 }}
            data={patientArray}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.BLUE}
                refreshing={refreshing}
                onRefresh={() => handleOnRefresh()}
              />
            }
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            onScroll={({ nativeEvent }) => {
              if (!scrollToEndNotified && isCloseToBottom(nativeEvent)) {
                scrollToEndNotified = true;
                handleOnEndReached();
              }
            }}
            renderItem={({ item, index }) => {
              const {
                _id,
                status,
                sessionType,
                startDate,
                patient: { _id: _pid, firstname, lastname, profileImageS3Link },
              } = item;
              const genderLetter = item?.patient?.miniSurveyForm?.gender
                ? item?.miniSurveyForm?.gender == 'male'
                  ? 'M'
                  : 'F'
                : '';
              const webviewUri = getWebViewUrl(
                `appointment-details/myapp/${_id}/`,
              );
              return (
                <AppointmentCard
                  item={item}
                  status={status}
                  profileImageS3Link={profileImageS3Link}
                  sessionType={sessionType}
                  startDate={startDate}
                  firstname={firstname}
                  lastname={lastname}
                  genderLetter={genderLetter}
                  onPress={() => {
                    navigation.navigate('webview', {
                      uri: webviewUri,
                      title: 'Appointment Details',
                    });
                  }}
                />
              );
            }}
            ListEmptyComponent={
              <View
                style={{
                  height: Dimensions.get('window').height / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {fetching ? (
                  <Text style={commonStyles.Regular12}>Loading</Text>
                ) : (
                  <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Image source={images.nodatafound} style={styles.noDataImage} resizeMode="contain" />
                    <Text style={commonStyles.Regular12}>No Records Found</Text>
                  </View>
                )}
              </View>
            }
          />
          <AppointmentFilter
            isVisible={showFilter}
            selectedFilter={filter}
            closeFilter={() => setShowFilter(false)}
            onClearPressed={filters => fetchDoctorsAppointments(filters)}
            onDonePressed={filters => fetchDoctorsAppointments(filters)}
          />
        </>
      )}
    </View>
  );
};

const mapStateToProps = state => ({ user: state.user.user });
const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    paddingHorizontal: getCalculated(15),
  },
  appointmentsStatusContainer: {
    // marginTop: 20,
    marginHorizontal: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countContainer: {
    // height: getCalculated(82),
    backgroundColor: '#e4f4fb',
    paddingHorizontal: 8,
    paddingVertical: 16,
    alignSelf: 'flex-start',
    borderRadius: 6,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flex: 2,
    height: getCalculated(82),
    backgroundColor: '#e4f4fb',
    padding: 13,
    alignSelf: 'flex-start',
    borderRadius: 6,
    marginHorizontal: 10,
  },
  appointmentCount: {
    textAlign: 'center',
    paddingHorizontal: getCalculated(6),
  },
  appointmentStatus: {
    alignSelf: 'flex-start',
  },
  welcomeView: {
    width: '90%',
    height: getCalculated(55),
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    borderRadius: 6,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  userImage: {
    width: getCalculated(41),
    height: getCalculated(41),
    borderRadius: 7,
    resizeMode: 'cover',
  },
  filterButton: selected => ({
    height: '60%',
    marginHorizontal: 10,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: selected ? COLORS.BLUE : 'transparent',
    justifyContent: 'center',
  }),
  sessionButtonText: selected => ({
    color: selected ? COLORS.WHITE : COLORS.BLUE,
  }),
  filterIcon: {
    width: getCalculated(30),
    height: getCalculated(30),
    resizeMode: 'contain',
  },
  patientMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  userImage: { width: 57, height: 57, resizeMode: 'contain', borderRadius: 6 },
  patientDetailsView: { marginHorizontal: 10 },
  instantIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: -2,
    marginLeft: 10,
  },
  audioIcon: { width: 15, height: 15, resizeMode: 'contain' },
  audioIconBg: {
    padding: 10,
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.LIGHT_BLUE,
    borderRadius: 4,
  },
  shadow: {
    // shadowColor: COLORS.LIGHTER_GREY,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.4,
    // shadowRadius: 7.65,
    borderWidth: 0.9,
    borderColor: COLORS.LIGHT_GRAY,
    elevation: 5,
  },
  filterView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_BLUE,
    height: getCalculated(39),
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  rowView: {
    width: '100%',
  },
  modalBar: {
    width: getCalculated(112),
    height: getCalculated(5),
    backgroundColor: '#c4c4c4',
    marginTop: getCalculated(11),
    borderRadius: getCalculated(5),
    marginBottom: getCalculated(28),
  },
  manageScrollContainer: {
    padding: 15,
    height: '80%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: COLORS.WHITE,
  },
  rowTxtStyle: { textAlign: 'left', alignSelf: 'center' },
  btnTxtStyle: hasLenght => ({
    textAlign: 'left',
    marginLeft: 0,
    height: '60%',
    color: hasLenght ? COLORS.DARK_GRAY : COLORS.LIGHT_GRAY,
  }),
  ddBtnStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    alignSelf: 'center',
  },
  ddStyle: { width: '90%', borderRadius: 6, marginTop: -4 },
  dropdownView: {
    marginTop: 7,
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1.2,
    borderRadius: 4,
    alignSelf: 'center',
    height: getCalculated(40),
  },
  renderTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  imgSelectImg: {
    height: 19,
    width: 19,
  },
  btnContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnDone: {
    marginTop: 50,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  btnClear: {
    marginTop: 50,
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BLUE,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  noDataImage: {
    width: getCalculated(90),
    height: getCalculated(90),
    marginVertical: 20
  }
});

export default connect(mapStateToProps)(TodaysAppointments);
