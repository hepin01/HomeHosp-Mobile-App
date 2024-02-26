import moment from 'moment-timezone';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import images from '../../assets/images';
import DatePicker from '../../components/DatePicker';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import {SmallButton} from '../../components/SmallButton';
import ReactNativeModal from 'react-native-modal';
import {
  createAppForEconsultation,
  getAppointmentSlots,
} from '../../networking/APIMethods';
import {
  displayErrorMsg,
  getCurrentTimezone,
  getUTCIso,
  userId,
} from '../../utiles/common';
import {Loader} from '../../components/Loader';

const SessionSlots = ({navigation, route: {params}}) => {
  const [day, setDay] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [sessionOne, setSessionOne] = useState([]);
  const [sessionTwo, setSessionTwo] = useState([]);
  const [selecteDate, setSelected] = useState(null);
  const [arrDuration, setArrDuration] = useState([]);
  const [arrSessions, setArrSessions] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState([]);
  const [notAvailableModal, setNotAvailableModal] = useState(false);
  const [validSlotsSelected, setValidSlotsSelected] = useState(false);
  useEffect(() => {
    const durations = [];
    for (var index = 1; index < 6; index++) {
      durations.push({id: index, label: `${index * 15}`, selected: false});
    }
    setArrDuration(durations);
  }, []);

  useEffect(() => {
    if (arrDuration.some(item => item.selected)) {
      setSelected(null);
      setValidSlotsSelected(false);
      setSessionOne(
        sessionOne.map(item => {
          return {
            ...item,
            selected: false,
          };
        }),
      );
      setSessionTwo(
        sessionTwo.map(item => {
          return {
            ...item,
            selected: false,
          };
        }),
      );
    }
  }, [arrDuration]);

  useEffect(() => {
    if (moment.isMoment(selecteDate)) {
      fetchAppointmentSlots();
    }
  }, [selecteDate]);

  const fetchAppointmentSlots = () => {
    setFetching(true);
    const payload = {
      week: moment(getUTCIso(selecteDate)).week(),
      day: selecteDate.day(),
      doctorId: params?.doctorId,
      date: getUTCIso(selecteDate),
    };
    getAppointmentSlots(
      payload,
      response => {
        setFetching(false);
        if (response == undefined) {
          setNotAvailableModal(true);
          setSessionOne([]);
          setSessionTwo([]);
          setArrSessions([]);
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
              return {
                ...item,
                selected: false,
              };
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
              return {
                ...item,
                selected: false,
              };
            });
            setSessionTwo(session2);
          }
          setArrSessions(sesions);
        }
      },
      error => {
        setSessionOne([]);
        setSessionTwo([]);
        setArrSessions([]);
        setFetching(false);
        displayErrorMsg(error);
      },
    );
  };

  const handleDurationSelected = item => {
    const modDuration = arrDuration.map(element => {
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
      } else {
        return element;
      }
    });
    setArrDuration(modDuration);
  };

  const handleSessionPressed = item => {
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
  };

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
        'Please select ' + slotsToSelect + ' consecutive slots to procced',
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
        'Please select ' + slotsToSelect + ' consecutive slots to procced',
      );
    } else {
      setValidSlotsSelected(true);
    }
  };

  const handleSlotsSelection = (element, i) => {
    const selectedSession = arrSessions.find(item => item.selected);
    const objSelectedDuration = arrDuration.find(item => item.selected);
    if (!!selectedSession && !!objSelectedDuration) {
      const selectedDuration = parseInt(objSelectedDuration.label);
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
  };

  const handleBookMyAppointment = () => {
    setFetching(true);
    const selectedSession = arrSessions.find(item => item.selected);
    const objSelectedDuration = arrDuration.find(item => item.selected);
    const selectedDuration = parseInt(objSelectedDuration.label);
    let arrSlots = [];
    if (selectedSession.id == 1) {
      arrSlots = sessionOne.filter(item => item.selected);
    } else {
      arrSlots = sessionTwo.filter(item => item.selected);
    }
    arrSlots = arrSlots.map(item => item.slot);
    const payload = {
      appointment: {
        date: getUTCIso(selecteDate),
        duration: selectedDuration,
        slots: arrSlots,
        doctor: params?.doctorId,
        status: 0,
        appId: params?.appId,
      },
      timeZone: getCurrentTimezone(),
    };
    console.log(payload)
    createAppForEconsultation(
      payload,
      response => {
        setFetching(false);
        navigation.pop(2);
      },
      error => {
        setFetching(false);
        displayErrorMsg(error);
      },
    );
  };

  const renderDurations = () => {
    return (
      <View style={styles.containerDurations}>
        {arrDuration.map(item => (
          <Pressable
            key={item.id.toString()}
            style={styles.durationSubContainer}
            onPress={() => handleDurationSelected(item)}>
            <Text style={styles.textDuration}>{item.label} mins</Text>
            {item.selected ? (
              <Image
                resizeMethod="scale"
                resizeMode="contain"
                style={styles.imgSelectImg}
                source={images.selected}
              />
            ) : (
              <Image
                resizeMethod="scale"
                resizeMode="contain"
                style={styles.imgSelectImg}
                source={images.unselected}
              />
            )}
          </Pressable>
        ))}
      </View>
    );
  };

  const renderESlot = (item, index) => {
    const time = moment(item.slot).format('hh:mm a');
    // console.log(time, item.slot)
    return (
      <Pressable
        disabled={item.disabled}
        style={styles.renerSlots(item.selected, item.disabled)}
        onPress={() => handleSlotsSelection(item, index)}>
        <Text
          style={
            item.selected
              ? commonStyles.RegularWhite10
              : commonStyles.Regular10
          }>
          {time}
        </Text>
      </Pressable>
    );
  };
  const renderMSlot = (item, index) => {
    const time = moment(item.slot).format('hh:mm a');
    // console.log(time, item.slot)
    return (
      <Pressable
        disabled={item.disabled}
        style={styles.renerSlots(item.selected, item.disabled)}
        onPress={() => handleSlotsSelection(item, index)}>
        <Text
          style={
            item.selected
              ? commonStyles.RegularWhite10
              : commonStyles.Regular10
          }>
          {time}
        </Text>
      </Pressable>
    );
  };

  const renderTimeSlots = () => {
    const selectedSession = arrSessions.find(item => item.selected);

    return (
      <View>
        {selectedSession ? (
          <>
            <View style={styles.typeContainer}>
              {arrSessions.map((item, index) => (
                <Pressable
                  key={item.id.toString()}
                  onPress={() => handleSessionPressed(item, index)}
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
                        {renderESlot(item, index)}
                      </View>
                    );
                  })
                : null}
              {selectedSession.id == 2
                ? sessionTwo.map((item, index) => {
                    return (
                      <View key={index.toString()} style={styles.containerSlot}>
                        {renderMSlot(item, index)}
                      </View>
                    );
                  })
                : null}
            </View>
          </>
        ) : null}
      </View>
    );
  };
  const disable =
    selecteDate == null ||
    arrDuration.filter(item => item.selected == true).length === 0 ||
    !validSlotsSelected;
  return (
    <ScrollView style={{backgroundColor: COLORS.WHITE}} showsVerticalScrollIndicator={false}>
      <Loader modalVisible={fetching} />
      <View style={{margin: getCalculated(17)}}>
        <View style={styles.container}>
          <Text style={styles.txtHeader}>Select Consultation Timings</Text>
          {renderDurations()}
          <DatePicker
            minStartDate={moment().add(1, 'd').toDate()}
            onStartDateSelection={date => {
              setValidSlotsSelected(false);
              setSelected(date);
            }}
          />
        </View>
        {!notAvailableModal ? renderTimeSlots() : null}
        <View style={styles.btnContainer}>
          <SmallButton
            style={styles.btnDone(disable)}
            disabled={disable}
            buttonTitle={'Book My Appointment'}
            buttonAction={() => handleBookMyAppointment()}
          />
          <SmallButton
            buttonTitle={'Cancel'}
            style={styles.btnDone(false)}
            buttonAction={() => navigation.pop()}
          />
        </View>
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

export default SessionSlots;

const styles = StyleSheet.create({
  container: {
    borderRadius: 13.7,
    backgroundColor: COLORS.WHITE,
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
    ...commonStyles.Bold135,
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
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    justifyContent: 'space-around',
    marginBottom: getCalculated(5),
    backgroundColor: COLORS.LIGHT_BLUE,
  },
  typeButtonSelected: {
    backgroundColor: COLORS.BLUE,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 20,
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
  textRegular11: {
    ...commonStyles.Regular11White,
    fontSize: Platform.OS == 'android' ? getCalculated(10) : getCalculated(11),
  },
  textRegularGray: {
    ...commonStyles.RegularGrey11,
    fontSize: Platform.OS == 'android' ? getCalculated(10) : getCalculated(11),
  },
});
