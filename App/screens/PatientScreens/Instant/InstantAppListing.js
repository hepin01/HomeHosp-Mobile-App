import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, commonStyles, getCalculated } from '../../../components/Common';
import InstantToday from './InstantToday';
import TypeSelector from '../../Instant/TypeSelector';
import {
  getInstantConsultationAppointmentsForPatient,
  getUserProfile,
} from '../../../networking/APIMethods';
import { displayErrorMsg, getUTCIso, isProvider } from '../../../utiles/common';
import moment from 'moment';
import { Loader } from '../../../components/Loader';
import RequestSentCell from './RequestSentCell';
import RequestRecCell from './RequestRecCell';
import images from '../../../assets/images';

const { height } = Dimensions.get('screen');
const defaultTypes = [
  {
    id: 1,
    label: 'Requests Received',
    selected: true,
  },
  {
    id: 2,
    label: 'Request Sent',
    selected: false,
  },
];
const InstantAppListing = ({ navigation }) => {
  const [arrTypes, setArrTypes] = useState([...defaultTypes]);
  const [fetching, setFetch] = useState(true);
  const [selected, setSelected] = useState({});
  const [arrRequestRec, setArrRequestRec] = useState([]);
  const [arrRequestSent, setArrRequestSent] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    fetchUserInfo();
    var focus = navigation.addListener('focus', () => {
      fetchList();
      setArrTypes(defaultTypes);
    });
    return () => {
      if (focus) {
        focus();
      }
    };
  }, []);

  useEffect(() => {
    if (arrTypes.some(item => item.selected)) fetchList();
  }, [arrTypes]);

  function fetchUserInfo() {
    getUserProfile(
      // payload,
      response => {
        setUserDetails(response.user);
      },
      error => {
        displayErrorMsg(error);
      },
    );
  }

  function fetchList() {
    setFetch(true);
    const selected = arrTypes.find(item => item.selected);
    setSelected(selected);
    const payload = {
      isPatientRequested: selected.id == 2,
      startDate: getUTCIso(moment()),
    };

    getInstantConsultationAppointmentsForPatient(
      payload,
      response => {
        setFetch(false);
        if (selected.id == 1) {
          setArrRequestRec(response?.data);
        } else if (selected.id == 2) {
          setArrRequestSent(response?.data);
        }
      },
      error => {
        setFetch(false);
        console.log(error);
        displayErrorMsg(error);
      },
    );
  }

  function handleTypePressed(item, index) {
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
  }

  function renderEmptyList() {
    return (
      <View style={styles.noRecordFound}>
        <Image source={images.patientnodatafound} style={styles.noDataImage} resizeMode="contain" />
        <Text style={commonStyles.Medium135}>No Records Found</Text>
      </View>
    );
  }

  function onToggle(status) {
    if (status) {
      displayErrorMsg();
    } else {
      fetchList();
    }
  }

  function connectTwillioCall(item) {
    navigation.navigate('TwilioCall', {
      popCount: 1,
      appointmentData: {
        ...item,
        from: isProvider() ? 'provider' : 'patient',
        appointmentId: item?._id,
      },
      isInstantConsultation: true,
      item: item,
    });
  }

  function completePayment(item) {
    navigation.navigate('PaymentScreen', {
      item: item,
      isFromInstantConsultion: true,
    });
  }

  return (
    <View style={styles.container}>
      <Loader modalVisible={fetching} />
      <InstantToday />
      <View style={{ marginHorizontal: getCalculated(20) }}>
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
      </View>
      {selected.id == 1 ? (
        fetching == false ? (
          arrRequestRec.length ? (
            <FlatList
              data={arrRequestRec}
              style={{ width: '100%', height: '100%' }}
              contentContainerStyle={{ paddingBottom: 200 }}
              renderItem={({ item, index }) => (
                <RequestRecCell
                  item={item}
                  userDetails={userDetails}
                  onToggle={status => onToggle(status)}
                  setLoading={bool => setFetch(bool)}
                  connectCall={() => {

                    connectTwillioCall(item);
                  }}
                  makePayment={() => completePayment(item)}
                />
              )}
            />
          ) : (
            renderEmptyList()
          )
        ) : null
      ) : null}
      {selected.id == 2 ? (
        !fetching ? (
          arrRequestSent.length ? (
            <FlatList
              data={arrRequestSent}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingBottom: 200 }}
              renderItem={({ item, index }) => (
                <RequestSentCell
                  item={item}
                  userDetails={userDetails}
                  onRequestResent={() => fetchList()}
                  setLoading={bool => setFetch(bool)}
                  connectCall={() => {

                    connectTwillioCall(item);
                  }}
                  makePayment={() => completePayment(item)}
                />
              )}
            />
          ) : (
            renderEmptyList()
          )
        ) : null
      ) : null}
    </View>
  );
};

export default InstantAppListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // padding: getCalculated(5),
    backgroundColor: COLORS.WHITE,
  },
  noRecordFound: {
    alignItems: 'center',
    marginTop: height / 4,
    justifyContent: 'center',
  },
  typeButtonSelected: {
    backgroundColor: COLORS.BLUE,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 20,
  },
  typeContainer: {
    backgroundColor: COLORS.LIGHT_BLUE,
    height: getCalculated(39),
    width: '100%',
    marginTop: getCalculated(14),
    marginBottom: getCalculated(5),
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  noDataImage: {
    width: getCalculated(90),
    height: getCalculated(90),
    marginVertical: 20
  }
});
