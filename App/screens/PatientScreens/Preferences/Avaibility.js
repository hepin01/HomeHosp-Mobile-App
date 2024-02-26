import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  createAppointment,
  getAppointmentSlots,
} from '../../../networking/APIMethods';
import {
  displayErrorMsg,
  getCurrentTimezone,
  getUTCIso,
} from '../../../utiles/common';
import moment from 'moment';
import ReactNativeModal from 'react-native-modal';
import images from '../../../assets/images';
import {COLORS, commonStyles, getCalculated} from '../../../components/Common';
import {SmallButton} from '../../../components/SmallButton';
import DatePicker from '../../../components/DatePicker';
import {Loader} from '../../../components/Loader';
import {QuesRadio} from '../PatientBookAppointment/component/QuesRadio';
import {Store} from '../../../../App';
import {
  UPDATE_APPOINTMENT_DATE,
  UPDATE_CONSULTATOIN_DURATION,
  UPDATE_OBJ_APPOINTMENT,
  UPDATE_OBJ_APPOINTMENT_PAYLOAD,
  UPDATE_TIME_SLOTS,
} from '../../../redux/BookAppointmentReducer';
import {connect} from 'react-redux';

const Avaibility = ({
  navigation,
  route,
  route: {
    params: {doctorDetails, fromBookAppoitnment = false},
  },
  arrUsers,
  isOnline,
  arrCards,
  intakeFormId,
  inviteFamily,
  modeTypeAudio,
  providerFilter,
  saveCardForFuture,
  appointmentTypeNew,
}) => {
  const [fetching, setFetching] = useState(false);
  const [sessionOne, setSessionOne] = useState([]);
  const [sessionTwo, setSessionTwo] = useState([]);
  const [arrSessions, setArrSessions] = useState([]);
  const [isAudioOnly, setisAudioOnly] = useState(true);
  const [selecteDate, setSelected] = useState(null);
  const [notAvailableModal, setNotAvailableModal] = useState(false);
  const [validSlotsSelected, setValidSlotsSelected] = useState(false);
  const {
    _id,
    firstname,
    lastname,
    providerInformation: {city, state, gender, dob},
  } = doctorDetails;
  const genderLetter = gender ? (gender == 'male' ? 'M' : 'F') : '';
  const isFromBookAppointment = fromBookAppoitnment;

  useEffect(() => {
    if (isFromBookAppointment == false) {
      setSelected(moment());
    }
    setisAudioOnly(modeTypeAudio);
  }, []);

  useEffect(() => {
    if (moment.isMoment(selecteDate)) {
      fetchAppointmentSlots();
    }
  }, [selecteDate]);

  useEffect(() => {
    if (route.params.selectedDate) {
      setSelected(route.params.selectedDate);
    }
  }, [route]);

  const toggleSessionOneSlots = (slotsToSelect, i) => {
    let count = 0;
    const lastIndexToSelect = parseInt(i + slotsToSelect);
    const tempSessionOne = sessionOne.map((item, index) => {
      if (index == i) {
        count++;
        return {
          ...item,
          selected: true,
        };
      }
      if (index > i && lastIndexToSelect > index) {
        count++;
        return {
          ...item,
          selected: true,
        };
      }
      return {
        ...item,
        selected: false,
      };
    });
    setSessionOne(tempSessionOne);
    if (count !== slotsToSelect) {
      displayErrorMsg(
        'Please select ' + slotsToSelect + ' consecutive slots to proceed',
      );
      setValidSlotsSelected(false);
    } else {
      setValidSlotsSelected(true);
    }
  };

  const toggleSessionTwoSlots = (slotsToSelect, i) => {
    let count = 0;
    const lastIndexToSelect = parseInt(i + slotsToSelect);
    const tempSessionTwo = sessionTwo.map((item, index) => {
      if (index == i) {
        count++;
        return {
          ...item,
          selected: true,
        };
      }
      if (index > i && lastIndexToSelect > index) {
        count++;
        return {
          ...item,
          selected: true,
        };
      }
      return {
        ...item,
        selected: false,
      };
    });
    setSessionTwo(tempSessionTwo);
    if (count !== slotsToSelect) {
      setValidSlotsSelected(false);
      displayErrorMsg(
        'Please select ' + slotsToSelect + ' consecutive slots to proceed',
      );
    } else {
      setValidSlotsSelected(true);
    }
  };

  const handleSlotsSelection = (element, i) => {
    const selectedSession = arrSessions.find(item => item.selected);
    // const selectedSession = route.params.selectedDate;
    const objSelectedDuration = route.params.selectedSlot.label.split(' ');
    if (!!selectedSession && !!objSelectedDuration) {
      const selectedDuration = parseInt(objSelectedDuration[0]);
      const slotsToSelect = selectedDuration / 15;

      if (selectedSession.id == 1) {
        // session 1
        const selectedSlots = sessionOne.filter(item => item.selected);
        if (selectedSlots.length) {
          const tempSessionOne = sessionOne.map((item, index) => {
            return {
              ...item,
              selected: false,
            };
          });
          setSessionOne(tempSessionOne);
          toggleSessionOneSlots(slotsToSelect, i);
        } else {
          const lastIndexToSelect = parseInt(i + slotsToSelect);
          const tempSessionOne = sessionOne.map((item, index) => {
            if (index == i) {
              return {
                ...item,
                selected: true,
              };
            }
            if (index > i && lastIndexToSelect > index) {
              return {
                ...item,
                selected: true,
              };
            }
            return item;
          });
          setSessionOne(tempSessionOne);
          toggleSessionOneSlots(slotsToSelect, i);
        }
      } else {
        // session 2
        const selectedSlots = sessionTwo.filter(item => item.selected);
        if (selectedSlots.length) {
          const tempSessionTwo = sessionTwo.map((item, index) => {
            return {
              ...item,
              selected: false,
            };
          });
          setSessionTwo(tempSessionTwo);
          toggleSessionTwoSlots(slotsToSelect, i);
        } else {
          const lastIndexToSelect = parseInt(i + slotsToSelect);
          const tempSessionTwo = sessionTwo.map((item, index) => {
            if (index == i) {
              return {
                ...item,
                selected: true,
              };
            }
            if (index > i && lastIndexToSelect > index) {
              return {
                ...item,
                selected: true,
              };
            }
            return item;
          });
          setSessionTwo(tempSessionTwo);
          toggleSessionTwoSlots(slotsToSelect, i);
        }
      }
    } else {
      if (selectedSession == undefined) {
        displayErrorMsg('Please select session.');
      }
      if (objSelectedDuration == undefined) {
        displayErrorMsg('Please select consultation timing.');
      }
    }
    // handleConfirmAndProceed();
  };

  const renderSlot = (item, index) => {
    const time = moment(item.slot).format('hh:mm a');
    return (
      <Pressable
        disabled={item.disabled}
        style={styles.renerSlots(item.selected, item.disabled)}
        onPress={() =>
          isFromBookAppointment ? handleSlotsSelection(item, index) : null
        }>
        <Text
          style={item.selected ? styles.textRegular11 : styles.textRegularGray}>
          {time}
        </Text>
      </Pressable>
    );
  };

  function renderTimeSlots() {
    const selectedSession = arrSessions.find(item => item.selected);
    return (
      <View>
        {selectedSession ? (
          <>
            <View style={styles.typeContainer}>
              {arrSessions.map((item, index) => {
                return (
                  <Pressable
                    key={item.id.toString()}
                    onPress={() => handleSessionPressed(item, index)}
                    style={
                      item.selected
                        ? styles.typeButtonSelected
                        : styles.typeButtonNotSelected
                    }>
                    <Text
                      style={
                        item.selected
                          ? commonStyles.Regular11White
                          : commonStyles.Regular12Blue
                      }>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {selectedSession.id == 1
                ? sessionOne.map((item, index) => {
                    return (
                      <View key={index.toString()} style={styles.containerSlot}>
                        {renderSlot(item, index)}
                      </View>
                    );
                  })
                : null}
              {selectedSession.id == 2
                ? sessionTwo.map((item, index) => {
                    return (
                      <View key={index.toString()} style={styles.containerSlot}>
                        {renderSlot(item, index)}
                      </View>
                    );
                  })
                : null}
              <View style={styles.containerSlot}></View>
            </View>
          </>
        ) : null}
      </View>
    );
  }

  function fetchAppointmentSlots() {
    setFetching(true);
    const payload = {
      week: moment(getUTCIso(selecteDate)).week(),
      day: selecteDate.day(),
      doctorId: doctorDetails?._id,
      date: getUTCIso(selecteDate),
    };

    getAppointmentSlots(
      payload,
      response => {
        setFetching(false);
        // const todaysDate = moment().subtract(1, 'day');
        // console.log(getUTCIso(todaysDate));
        if (response == undefined) {
          setNotAvailableModal(true);
          setSessionOne([]);
          setSessionTwo([]);
          setFetching(false);
        } else {
          const sesions = [];
          if (response?.mSlots?.length) {
            sesions.push({
              id: 1,
              label: 'Session 1',
              selected: response?.mSlots?.length !== 0,
            });
            const session1 = response?.mSlots?.map(item => {
              const today = new Date(selecteDate);
              let newDate = new Date(item.slot).setMonth(today.getMonth());
              newDate = new Date(newDate).setDate(today.getDate());
              newDate = new Date(newDate).setFullYear(today.getFullYear());
              item.modSlot = new Date(newDate);
              let date1 = new Date();
              let date2 = new Date(item.modSlot);
              if (item.disabled == false) {
                return {
                  ...item,
                  selected: false,
                  disabled: date1 > date2,
                };
              } else {
                return {
                  ...item,
                  selected: false,
                };
              }
            });
            setSessionOne(session1);
          }
          if (response?.eSlots?.length) {
            sesions.push({
              id: 2,
              label: 'Session 2',
              selected: response?.mSlots?.length == 0,
            });
            const session2 = response?.eSlots?.map(item => {
              const today = new Date(selecteDate);
              let newDate = new Date(item.slot).setMonth(today.getMonth());
              newDate = new Date(newDate).setDate(today.getDate());
              newDate = new Date(newDate).setFullYear(today.getFullYear());
              item.modSlot = new Date(newDate);
              let date1 = new Date();
              let date2 = new Date(item.modSlot);
              if (item.disabled == false) {
                return {
                  ...item,
                  selected: false,
                  disabled: date1 > date2,
                };
              } else {
                return {
                  ...item,
                  selected: false,
                };
              }
            });
            setSessionTwo(session2);
          }
          setArrSessions(sesions);
        }
      },
      error => {
        setSessionOne([]);
        setSessionTwo([]);
        setFetching(false);
        displayErrorMsg(error);
      },
    );
  }

  function handleSessionPressed(item) {
    const temp = [...arrSessions];
    const modTemp = temp.map(element => {
      if (element.id == item.id) {
        return {
          ...item,
          selected: !item.selected,
        };
      } else if (element.selected) {
        return {
          ...element,
          selected: false,
        };
      }
      return element;
    });
    setArrSessions(modTemp);
  }

  function updateSelectDuration(dur) {
    Store.dispatch({
      type: UPDATE_CONSULTATOIN_DURATION,
      payload: dur,
    });
  }

  function updateArrSlots(arr) {
    Store.dispatch({
      type: UPDATE_TIME_SLOTS,
      payload: arr,
    });
  }

  function updateAppointmentDate(date) {
    Store.dispatch({
      type: UPDATE_APPOINTMENT_DATE,
      payload: date,
    });
  }

  function updateAppointment(obj) {
    Store.dispatch({
      type: UPDATE_OBJ_APPOINTMENT,
      payload: obj,
    });
  }

  function updateAppointmentPayload(obj) {
    Store.dispatch({
      type: UPDATE_OBJ_APPOINTMENT_PAYLOAD,
      payload: obj,
    });
  }

  function handleConfirmAndProceed() {
    setFetching(true);
    let arrUserId = [];
    const selectedSession = arrSessions.find(item => item.selected);
    const objSelectedDuration = route.params.selectedSlot.label.split(' ');
    let arrSlots = [];
    if (selectedSession.id == 1) {
      arrSlots = sessionOne.filter(item => (item.selected));
      console.log(arrSlots)
    } else {
      arrSlots = sessionTwo.filter(item => (item.selected));
      console.log(arrSlots)
    }

    arrSlots = arrSlots.map(item => item.modSlot);
    console.log(arrSlots)

    updateSelectDuration(objSelectedDuration);
    updateArrSlots(arrSlots);

    let startOfTime = moment(route.params.selectedDate).startOf("day").toString()
    console.log(startOfTime)

    updateAppointmentDate(startOfTime);
    const inviteMember = inviteFamily ? 'yes' : 'no';
    const appointmentType = appointmentTypeNew ? 'new' : 'followUp';
    const sessionType = modeTypeAudio ? 'telephonic' : 'video';
    let arrDelegateUsers = [];
    if (inviteFamily) {
      arrDelegateUsers = arrUsers.filter(item => item.selected);
      if (arrDelegateUsers.length) {
        arrUserId = arrDelegateUsers.map(item => {
          return item._id;
        });
      }
    }
    let cardId = '';
    if (isOnline) {
      const selectedCard = arrCards.find(item => item.selected);
      cardId = selectedCard?.id;
    }
    const payload = {
      appointment: {
        date: startOfTime,
        apointmentOption: isAudioOnly ? 'telephonic' : 'video',
        slots: arrSlots,
        appointmentType: appointmentType,
        sessionType: sessionType,
        duration: objSelectedDuration[0],
        price: parseInt(
          objSelectedDuration[objSelectedDuration.length - 1].slice(1),
        ),
        inviteMember: inviteMember,
        isDelegateUserAdded: arrDelegateUsers.length ? true : '',
        delegatedUsers: arrUserId,
        status: 0,
        step1: true,
        intakeId: intakeFormId,
        step2: true,
        step3: true,
        cardId: cardId,
        isInsurance: isOnline ? 'no' : 'yes',
        saveCardForFuture: saveCardForFuture,
        listDrFilter: providerFilter,
        step4: true,
        doctor: _id,
      },
      timeZone: getCurrentTimezone(),
    };
    updateAppointmentPayload(payload);
    console.log(payload)
    createAppointment(
      payload,
      response => {
        setFetching(false);
        updateAppointment(response);
        navigation.navigate('AppointmentConfirmation', {
          doctorDetails: doctorDetails,
        });
      },
      error => {
        setFetching(false);
        displayErrorMsg(error);
      },
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: COLORS.WHITE}}
      contentContainerStyle={{paddingBottom: 200}}>
      {/* <Loader modalVisible={fetching} /> */}
      <View style={{padding: getCalculated(17)}}>
        <View style={styles.container}>
          <View style={{}}>
            <Text style={styles.txtHeader}>
              Dr. {firstname + ' ' + lastname + ' '}
              <Text style={commonStyles.Regular115Blue}>
                {genderLetter +
                  (dob ? ' (' + moment().diff(dob, 'years') + ')' : '')}
              </Text>
            </Text>
          </View>
          <View style={styles.miniRowView}>
            <Image style={styles.locationIcon} source={images.map} />
            <Text style={commonStyles.RegularGrey11}>
              {city}, {state}
            </Text>
          </View>

          {!isFromBookAppointment && (
            <DatePicker
              startDateLabel={moment().format('ddd, MMM DD, YYYY')}
              minStartDate={moment().add(1, 'd').toDate()}
              onStartDateSelection={date => {
                setSelected(date);
              }}
            />
          )}

          {isFromBookAppointment && (
            <View>
              <Text style={styles.textHeader}>Appointment Type:</Text>
              <QuesRadio
                isChecked={isAudioOnly}
                yesTitle={'Audio Only'}
                noTitle={'Video'}
                question={''}
                yesSelected={isChecked => {
                  setisAudioOnly(isChecked);
                }}
              />

              <Text style={[commonStyles.Regular135, {marginTop: 10}]}>
                Select Consultation Time
              </Text>
              <Text
                style={[styles.textHeader, {marginTop: 5, marginBottom: 10}]}>
                ({selecteDate?.format('dddd, MMMM DD, YYYY')})
              </Text>
            </View>
          )}
        </View>
        {!notAvailableModal ? renderTimeSlots() : null}

        {!isFromBookAppointment && (
          <View style={styles.btnContainer}>
            <SmallButton
              buttonTitle={'Cancel'}
              style={styles.btnDone(!true)}
              buttonAction={() => navigation.pop()}
            />
          </View>
        )}

        {isFromBookAppointment && (
          <View style={styles.btnContainer}>
            <SmallButton
              disabled={!validSlotsSelected}
              buttonTitle={'Confirm & Proceed'}
              style={styles.btnDone(!validSlotsSelected)}
              buttonAction={() => handleConfirmAndProceed()}
            />
            <SmallButton
              buttonTitle={'Cancel'}
              style={styles.btnDone(true)}
              buttonAction={() => navigation.pop()}
            />
          </View>
        )}

        <ReactNativeModal isVisible={notAvailableModal}>
          <View style={styles.containerModal}>
            <Image
              style={styles.imgNotAvailable}
              source={images.notavailablewithcircle}
            />
            <View style={styles.txtNotAvailable}>
              <Text style={commonStyles.Bold15}>Not Available</Text>
            </View>
            <View style={{marginBottom: getCalculated(16)}}>
              <Text style={commonStyles.Regular135}>
                Doctor not available for the selected day
              </Text>
            </View>
            <SmallButton
              buttonTitle={'Okay'}
              buttonAction={() => setNotAvailableModal(false)}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};
const mapStateToProps = ({bookedAppointment}) => {
  return {
    arrUsers: bookedAppointment.arrUsers,
    arrCards: bookedAppointment.arrCards,
    isOnline: bookedAppointment.isOnline,
    inviteFamily: bookedAppointment.inviteFamily,
    intakeFormId: bookedAppointment.intakeFormId,
    modeTypeAudio: bookedAppointment.modeTypeAudio,
    providerFilter: bookedAppointment.providerFilter,
    saveCardForFuture: bookedAppointment.saveCardForFuture,
    appointmentTypeNew: bookedAppointment.appointmentTypeNew,
  };
};

export default connect(mapStateToProps)(Avaibility);

const styles = StyleSheet.create({
  container: {
    borderRadius: 13.7,
    backgroundColor: '#ffffff',
    ...commonStyles.shadow,
    padding: getCalculated(15),
  },
  containerModal: {
    borderRadius: 13.7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: getCalculated(15),
  },
  txtHeader: {
    ...commonStyles.Medium18,
    alignSelf: 'flex-start',
  },
  containerDurations: {
    marginTop: getCalculated(14),
    // marginBottom: getCalculated(19),
  },
  textDuration: {
    ...commonStyles.Regular135,
    marginBottom: getCalculated(15),
  },
  imgSelectImg: {
    height: getCalculated(19),
    width: getCalculated(19),
  },
  durationSubContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  btnDone: disabled => ({
    marginTop: 50,
    alignSelf: 'center',
    paddingVertical: getCalculated(12),
    paddingHorizontal: getCalculated(13),
    backgroundColor: disabled ? COLORS.LIGHT_GRAY : COLORS.BLUE,
  }),
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: -20,
  },
  imgNotAvailable: {
    width: getCalculated(60),
    height: getCalculated(60),
  },
  txtNotAvailable: {
    marginTop: getCalculated(26),
    marginBottom: getCalculated(16),
  },
  typeContainer: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: getCalculated(39),
    marginTop: getCalculated(14),
    justifyContent: 'flex-start',
    marginBottom: getCalculated(5),
    backgroundColor: COLORS.LIGHT_BLUE,
  },
  typeButtonSelected: {
    backgroundColor: COLORS.BLUE,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  typeButtonNotSelected: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  containerSlot: {
    borderRadius: 6,
    marginVertical: getCalculated(5),
    width: '29.9%',
  },
  renerSlots: (selected, disabled) => ({
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getCalculated(11),
    paddingHorizontal: getCalculated(15),
    backgroundColor: selected
      ? COLORS.BLUE
      : disabled
      ? COLORS.LIGHTER_GREY
      : COLORS.WHITE,
    borderRadius: 7.7,
    ...commonStyles.shadow,
    width: '100%',
  }),
  miniRowView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // width: '50%',
  },
  locationIcon: {
    width: getCalculated(12),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 5,
  },
  textHeader: {
    ...commonStyles.Bold15,
    width: '100%',
    marginBottom: -20,
    marginTop: 10,
  },
  textRegular11: {
    ...commonStyles.Regular11White,
    fontSize: Platform.OS == 'android' ? getCalculated(10) : getCalculated(11),
  },
  textRegularGray: {
    ...commonStyles.RegularGrey11,
    fontSize: Platform.OS == 'android' ? getCalculated(10) : getCalculated(11),
  },
});
