import {
  AppState,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import SearchBar from '../../components/SearchBar';
import {SmallButton} from '../../components/SmallButton';
import FromToDatePicker from '../../components/FromToDatePicker';
import moment from 'moment';
import images from '../../assets/images';
import {FlatList} from 'react-native-gesture-handler';
import {
  getERequests,
  getFollowupAppointments,
  toggleErequest,
} from '../../networking/APIMethods';
import {Store} from '../../../App';
import Base from '../Base/Base';
import ImageLoader from '../../components/ImageLoader';
import {isMoment} from '../../utiles/validator';
import {Loader} from '../../components/Loader';
import AppointmentCancel from '../../components/AppointmentCancel';
import {
  displayErrorMsg,
  getCurrentTimezone,
  getUTCIso,
  getWebViewUrl,
  userId,
} from '../../utiles/common';
import {webview, webViewBaseurl} from '../../networking/Constats';

const EConsultation = ({navigation, navigation: {navigate}}) => {
  const types = [
    {
      id: 1,
      label: 'E - Requests',
      selected: true,
      //   records: eRequests,
    },
    {
      id: 2,
      label: 'Book Appointment',
      selected: false,
      // records: bookAppointments,
    },
  ];
  const dateFormat = 'hh:mm A, dddd, MMM DD, YYYY';
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [arrTypes, setArrTypes] = useState(types);
  const [arrERequests, setArrERequests] = useState([]);
  const [arrBookAppointment, setArrBookAppointment] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedType, setSelectedType] = useState({
    id: 1,
    label: 'E - Requests',
    selected: true,
  });

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      setArrTypes(types);
      return () => {
        if (Platform.OS == 'android') {
          if (subscription) {
            subscription.remove();
          }
        }
      };
    });
    return () => focus();
  }, []);

  useEffect(() => {
    getLists();
  }, [toDate, fromDate, arrTypes]);

  useEffect(() => {
    if (searchQuery.length == 0) {
      getLists();
    }
  }, [searchQuery]);

  const getLists = () => {
    const type = arrTypes.find(item => item.selected);
    setSelectedType(type);
    if (type.id == 1) {
      fetchERequests();
    } else {
      getBookAppointmentList();
    }
  };

  const fetchERequests = () => {
    // setFetching(true);
    const data = {
      status: 4,
      from: isMoment(fromDate) ? fromDate.utc().toISOString() : null,
      to: isMoment(toDate) ? toDate.utc().toISOString() : null,
      searchQuery: searchQuery,
      doctor: userId(),
    };

    getERequests(
      data,
      response => {
        setFetching(false);
        setRefreshing(false);
        setArrERequests(response);
      },
      error => {
        setFetching(false);
        setRefreshing(false);
        displayErrorMsg(error);
      },
    );
  };

  const getBookAppointmentList = () => {
    // setFetching(true);
    const data = {
      status: 4,
      from: isMoment(fromDate)
        ? // ? fromDate.utc().format('YYYY-MM-DDTHH:mm:ss:SS')
          getUTCIso(fromDate)
        : null,
      to: isMoment(toDate)
        ? // ? toDate.utc().format('YYYY-MM-DDTHH:mm:ss:SS')
          getUTCIso(toDate)
        : null,
      searchQuery: searchQuery,
      doctor: userId(),
    };
    getFollowupAppointments(
      data,
      response => {
        setFetching(false);
        setRefreshing(false);
        setArrBookAppointment(response);
      },
      error => {
        setFetching(false);
        setRefreshing(false);
        displayErrorMsg(error);
      },
    );
  };

  const handleTypePressed = (item, index) => {
    const tempArr = arrTypes.map(item => {
      return {
        ...item,
        selected: false,
      };
    });
    const tempItem = {
      ...item,
      selected: true,
    };
    tempArr.splice(index, 1, tempItem);
    setArrTypes(tempArr);
  };

  const renderBottonButtons = item => {
    const {estatus} = item ?? {};
    let requsetStatusLabel = '';
    let textStyle = commonStyles.Regular11Red;
    if (estatus == 0) {
      return null;
    }
    if (estatus == 1) {
      return (
        <View style={styles.bottomSubContainer}>
          <Pressable onPress={() => toggleReuest('', item)}>
            <Image style={styles.imgBottomButton} source={images.approveicon} />
          </Pressable>
          <Pressable
            style={{marginLeft: getCalculated(10)}}
            onPress={() => {
              setShowReason(true);
              setSelectedItem(item);
            }}>
            <Image style={styles.imgBottomButton} source={images.declinedapp} />
          </Pressable>
        </View>
      );
    }
    if (estatus == 2) {
      textStyle = commonStyles.Regular11Orange;
      requsetStatusLabel = 'Cancelled';
      return (
        <View style={styles.bottomSubContainer}>
          <Text style={textStyle}>{requsetStatusLabel}</Text>
        </View>
      );
    }
    if (estatus == 3) {
      textStyle = commonStyles.Regular11Green;
      requsetStatusLabel = 'Accepted';
      return (
        <View style={styles.bottomSubContainer}>
          <Text style={textStyle}>{requsetStatusLabel}</Text>
        </View>
      );
    }
  };

  const renderBottomRequestStatus = item => {
    let textStyle = commonStyles.Regular11Red;
    const {estatus: status} = item;
    let requsetStatusLabel = '';
    if (status) {
      if (status == 0) {
        return null;
      }
      if (status == 1) {
        textStyle = commonStyles.Regular11Orange;
        requsetStatusLabel = 'Request Raised';
      }
      if (status == 2) {
        textStyle = commonStyles.Regular11Red;
        requsetStatusLabel = 'Request Rejected';
      }
      if (status == 3) {
        textStyle = commonStyles.Regular11Green;
        requsetStatusLabel = 'Request Accepted';
      }
      if (status == 4) {
        textStyle = commonStyles.Regular11Green;
        requsetStatusLabel = 'Appointment Completed';
      }
      return <Text style={textStyle}>{requsetStatusLabel}</Text>;
    }
    return (
      <SmallButton
        style={styles.btnBook}
        buttonTitle={'Book E-Consultation'}
        buttonAction={() => navigate('doctorList', {appId: item._id})}
        buttonTextStyle={{color: COLORS.WHITE}}
      />
    );
  };

  const openWebView = item => {
    const {
      _id,
      patient: {_id: _pid},
    } = item;
    const url = getWebViewUrl(`appointment-details/erequest/${_id}/`);
    navigate(webview, {uri: url, title: 'Appointment Details'});
  };

  const handleOnRefresh = (isErequest = false) => {
    setRefreshing(true);
    if (isErequest) {
      fetchERequests();
    } else {
      getBookAppointmentList();
    }
  };

  const renderERequests = ({item, index}) => {
    const {
      startDate,
      doctor: {firstname, lastname},
      patient: {firstname: pFirstName, lastname: pLastname, profileImageS3Link},
    } = item;
    return (
      <Pressable
        style={styles.eRequestContainer}
        onPress={() => openWebView(item)}>
        <View style={styles.eReqSubContainer}>
          <View style={{flex: 1}}>
            <ImageLoader
              // resizeMode={'contain'}
              // resizeMethod={'resize'}
              style={styles.imgProfile}
              url={{uri: profileImageS3Link}}
              placeholder={images.userdefault}
            />
          </View>
          <View
            style={{
              flex: 3,
              marginLeft: getCalculated(10),
            }}>
            <Text style={commonStyles.Medium18}>
              {firstname + ' ' + lastname}
            </Text>
            <View style={styles.textSpace}>
              <Text style={commonStyles.RegularLight11}>
                {moment(startDate).format(dateFormat)}
              </Text>
            </View>
            <View style={styles.textSpace}>
              <Text style={commonStyles.RegularBlack115}>Patient Name:</Text>
            </View>
            <View style={{marginTop: getCalculated(2)}}>
              <Text style={[commonStyles.Bold135, {alignSelf: 'flex-start'}]}>
                {pFirstName + ' ' + pLastname}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.eReqBottom}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 11,
            }}>
            <View style={{flex: 1}}></View>
            {renderBottonButtons(item)}
          </View>
          <View>
            <Image style={styles.imgNextButton} source={images.nextarrowblue} />
          </View>
        </View>
      </Pressable>
    );
  };

  const renderBookAppointment = ({item, index}) => {
    const {
      drStartDate,
      doctor: {firstname, lastname, profileImageS3Link, _id},
      patient: {firstname: pFirstName, lastname: pLastname, _id: _pid},
    } = item;

    return (
      <Pressable
        style={styles.eRequestContainer}
        onPress={() => {
          const url = getWebViewUrl(
            'appointment-details/bookAppointment/' + item._id + '/',
          );
          navigate(webview, {
            uri: url,
            title: 'Appointment Details',
          });
        }}>
        <View style={styles.eReqSubContainer}>
          <View style={{flex: 1}}>
            <ImageLoader
              resizeMode={'contain'}
              resizeMethod={'resize'}
              style={styles.imgProfile}
              url={{uri: profileImageS3Link}}
              placeholder={images.userdefault}
            />
          </View>
          <View
            style={{
              flex: 3,
              marginLeft: getCalculated(Platform.OS == 'ios' ? 15 : 20),
            }}>
            <Text style={commonStyles.Medium18}>
              {pFirstName + ' ' + pLastname}
            </Text>
            <View style={styles.textSpace}>
              <Text style={commonStyles.RegularLight11}>
                {drStartDate ? moment(drStartDate).format(dateFormat) : 'NA'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.eReqBottom}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginTop: 11,
            }}>
            <View style={{flex: 1}}></View>
            {renderBottomRequestStatus(item)}
            <View style={{flex: 1}} />
          </View>
          <Image style={styles.imgNextButton} source={images.nextarrowblue} />
        </View>
      </Pressable>
    );
  };

  const toggleReuest = (reason = '', item = null) => {
    const selectedElement = item || selectedItem;
    setFetching(true);
    setShowReason(false);
    const {
      _id,
      eConsultationAppId,
      // doctor: {firstname, lastname},
    } = selectedElement;
    const estatus = reason.length == 0 ? 3 : 2;
    let data = {
      appId: _id,
      estatus: estatus,
      timeZone: getCurrentTimezone(),
      eConsultationAppId: eConsultationAppId,
    };
    if (reason.length) {
      // decline
      const {firstname, lastname} = Store.getState().user.user;
      data = {
        ...data,
        cancelled: {
          user: `${firstname} ${lastname}`,
          reason: reason,
        },
      };
    }
    toggleErequest(
      data,
      response => {
        getLists();
        setFetching(false);
      },
      error => {
        setFetching(false);
        displayErrorMsg(error);
      },
    );
  };

  return (
    <View style={styles.container}>
      <AppointmentCancel
        onSave={reason => toggleReuest(reason)}
        onCancel={() => setShowReason(false)}
        showResons={showReason}
      />
      <Loader
        closeLoader={() => setFetching(false)}
        text={''}
        modalVisible={fetching}
      />
      <View style={styles.noteContianer}>
        <Text style={commonStyles.Regular135}>
          <Text style={commonStyles.Bold135}>Note: </Text>
          Payment of the E-consulation must be carried out Offline*
        </Text>
      </View>
      <View style={styles.searchBar}>
        <SearchBar
          onChangeText={text => {
            setSearchQuery(text);
          }}
          onClearPressed={() => {
            setSearchQuery('');
          }}
          placeholder={"Search by Patient's Name"}
          onSubmitEditing={() => getLists()}
        />
      </View>
      <FromToDatePicker
        onEndDateSelection={date => setToDate(date)}
        onStartDateSelection={date => setFromDate(date)}
      />
      <View style={styles.typeContainer}>
        {arrTypes.map((item, index) => (
          <Pressable
            key={item.id.toString()}
            onPress={() => handleTypePressed(item, index)}
            style={item.selected ? styles.typeButtonSelected : null}>
            <Text
              style={
                item.selected
                  ? commonStyles.Regular11White
                  : commonStyles.Regular12Blue
              }>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={{paddingBottom: 250}}>
        {selectedType.id == 1 ? (
          <FlatList
            data={arrERequests}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 200}}
            extraData={arrERequests}
            ListHeaderComponent={() => (
              <Text style={commonStyles.RegularDark11}>
                {arrERequests.length + ' Records Found'}
              </Text>
            )}
            keyExtractor={item => item._id}
            renderItem={renderERequests}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.BLUE}
                refreshing={refreshing}
                onRefresh={() => handleOnRefresh(true)}
              />
            }
          />
        ) : null}
        {selectedType.id == 2 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 200}}
            data={arrBookAppointment}
            extraData={arrBookAppointment}
            ListHeaderComponent={() => (
              <Text style={commonStyles.RegularDark11}>
                {arrBookAppointment.length + ' Records Found'}
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderBookAppointment}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.BLUE}
                refreshing={refreshing}
                onRefresh={() => handleOnRefresh(true)}
              />
            }
          />
        ) : null}
      </View>
    </View>
  );
};

export default EConsultation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: getCalculated(17),
  },
  noteContianer: {
    flexDirection: 'row',
    marginBottom: getCalculated(15),
  },
  searchBar: {
    marginBottom: getCalculated(13),
  },
  typeContainer: {
    backgroundColor: COLORS.LIGHT_BLUE,
    height: getCalculated(39),
    marginTop: getCalculated(14),
    marginBottom: getCalculated(5),
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: COLORS.BLUE,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 20,
  },
  typeButton: {},
  eReqSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    // padding: 30,
  },
  eRequestContainer: {
    width: '99%',
    borderRadius: 10.3,
    alignSelf: 'center',
    ...commonStyles.shadow,
    backgroundColor: COLORS.WHITE,
    marginVertical: getCalculated(10),
    paddingTop: getCalculated(10),
    paddingBottom: getCalculated(14),
    paddingHorizontal: getCalculated(15),
  },
  imgProfile: {
    width: getCalculated(57),
    height: getCalculated(57),
    borderRadius: getCalculated(7),
    // marginRight: getCalculated(30),
  },
  textSpace: {
    marginTop: getCalculated(5),
  },
  eReqBottom: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomSubContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgBottomButton: {
    width: getCalculated(20),
    height: getCalculated(20),
    // marginHorizontal: getCalculated(15)
  },
  imgNextButton: {
    width: getCalculated(6),
    height: getCalculated(11),
    // marginHorizontal: getCalculated(15)
  },
  btnBook: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
