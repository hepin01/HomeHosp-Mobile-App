import moment from 'moment';
import React from 'react';
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import images from '../../assets/images';
import {commonStyles, COLORS, getCalculated} from '../../components/Common';
import {SmallButton} from '../../components/SmallButton';
import {
  addInstantConsultationSchedule,
  getAppointmentSlots,
  getUserProfile,
  toggleInstantConsultation,
} from '../../networking/APIMethods';
import {getUTCIso, userId} from '../../utiles/common';
import Base from '../Base/Base';
import ConsultListing from './ConsultListing';

class Instant extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      sessionOneSelected: true,
      timeArray: [],
      sessionOne: [],
      sessionTwo: [],
      sessions: [],
      instantConsSchedule: null,
      renderListing: false,
    };
    this.opacValue = new Animated.Value(0);
    this.imageOpacValue = new Animated.Value(1);
    this.focus = null;
  }
  componentDidMount() {
    this.focus = this.props.navigation.addListener('focus', () => {
      this.fetchUserInfo(() => {
        this.fetchAppointmentSlots();
      });
    });
    this.blur = this.props.navigation.addListener('blur', () => {
      this.setState({
        timeArray: [],
        sessionOne: [],
        sessionTwo: [],
        sessions: [],
      });
    });
  }

  componentWillUnmount() {
    if (this.focus) {
      this.focus();
    }
    if (this.blur) {
      this.blur();
    }
  }

  fetchUserInfo(completion) {
    // this.showLoader('');
    getUserProfile(
      response => {
        const {
          user: {instantConsSchedule, isInstantConsultation},
        } = response;
        this.setState(
          {
            isEnabled: isInstantConsultation,
            instantConsSchedule: instantConsSchedule,
          },
          () => {
            if (isInstantConsultation) {
              if (
                instantConsSchedule?.eSlots?.length ||
                instantConsSchedule?.mSlots?.length
              ) {
                this.setState(
                  {renderListing: true},
                  () => completion && completion(),
                );
                this.navigateToListing();
              } else {
                this.setState(
                  {renderListing: false},
                  () => completion && completion(),
                );
                this.animateShowView();
              }
            } else {
              this.animateHideView();
            }
          },
        );
        // this.dismissLoader();
      },
      error => {
        this.displayErrorMsg(error);
        // this.dismissLoader();
      },
    );
  }

  fetchAppointmentSlots() {
    // this.showLoader('');
    const payload = {
      week: moment(getUTCIso(moment())).week(),
      day: moment().day(),
      doctorId: userId(),
      date: getUTCIso(moment()),
    };
    getAppointmentSlots(
      payload,
      response => {
        if (response == undefined) {
          // this.dismissLoader();
          this.setState({timeArray: []});
        } else {
          try {
            const sesions = [];
            if (response?.mSlots?.length) {
              sesions.push({
                id: 1,
                label: 'Session 1',
                selected: response?.mSlots?.length !== 0,
              });
              const session1 = response?.mSlots?.map(item => {
                const today = new Date(moment());
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
              this.setState(prevState => ({
                timeArray: [
                  ...prevState.timeArray,
                  {session: '1', slot: session1},
                ],
              }));
            }
            if (response?.eSlots?.length) {
              sesions.push({
                id: 2,
                label: 'Session 2',
                selected: response?.mSlots?.length == 0,
              });
              const session2 = response?.eSlots?.map(item => {
                const today = new Date(moment());
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
              // this.setState({sessionTwo: session2});
              this.setState(prevState => ({
                timeArray: [
                  ...prevState.timeArray,
                  {session: '2', slot: session2},
                ],
              }));
            }
            this.setState({sessions: sesions}, () => {
              this.dismissLoader();
              this.parseTimeSlots();
            });
          } catch (error) {
            this.dismissLoader();
            console.log(error);
          }
        }
      },
      error => {
        // this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  toggleSwitch() {
    const {isEnabled} = this.state;
    this.setState(
      prevState => ({isEnabled: !prevState.isEnabled}),
      () => {
        this.postToggleInstantConsultation(this.state.isEnabled);
        if (!isEnabled) {
          this.animateShowView();
        } else {
          this.animateHideView();
        }
        // if (this.state.timeArray.length == 0) {
        this.fetchUserInfo(() => {
          this.fetchAppointmentSlots();
        });

        // }
      },
    );
  }

  navigateToListing() {
    // this.props.navigation.navigate('ConsultListing', {
    //   isEnabled: this.state.isEnabled,
    // });
    this.setState(
      {
        renderListing: true,
      },
      () => this.animateShowView(),
    );
  }

  postToggleInstantConsultation(isEnabled) {
    // this.showLoader();
    const payload = {
      isInstantConsultation: isEnabled,
    };
    toggleInstantConsultation(
      payload,
      response => {
        // this.dismissLoader();
      },
      error => {
        // this.dismissLoader();
        this.displayErrorMsg(error);
      },
    );
  }

  animateShowView() {
    Animated.parallel([
      Animated.timing(this.opacValue, {
        toValue: 1,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 500,
      }),
      Animated.timing(this.imageOpacValue, {
        toValue: 0,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 500,
      }),
    ]).start(() => {
      setTimeout(() => {
        this.showInstantView();
      }, 300);
    });
  }

  animateHideView() {
    Animated.parallel([
      Animated.timing(this.opacValue, {
        toValue: 0,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 500,
      }),
      Animated.timing(this.imageOpacValue, {
        toValue: 1,
        easing: Easing.ease,
        useNativeDriver: true,
        duration: 500,
      }),
    ]).start(() => {
      setTimeout(() => {
        this.showInstantView();
      }, 300);
    });
  }

  sessionButtonClicked() {
    const {sessionOneSelected} = this.state;
    this.setState({sessionOneSelected: !sessionOneSelected});
  }

  parseTimeSlots() {
    const {timeArray, instantConsSchedule} = this.state;
    try {
      if (timeArray.length == 2) {
        let modMSlots = [...timeArray[0].slot];
        let modESlots = [...timeArray[1].slot];
        let arrMSlotTime = [...timeArray[0].slot];
        let arrESlotTime = [...timeArray[1].slot];
        let reservedMSlot = instantConsSchedule?.mSlots
          ? [...instantConsSchedule?.mSlots]
          : [];
        let reservedESlot = instantConsSchedule?.eSlots
          ? [...instantConsSchedule?.eSlots]
          : [];
        reservedMSlot?.forEach((element, index) => {
          const slotStartDate = this.convertToCurrentTime(element.startDate);
          const slotEndDate = this.convertToCurrentTime(element.endDate);
          arrMSlotTime?.forEach((slotElement, index) => {
            if (
              moment(slotElement.modSlot).isBetween(
                slotStartDate,
                slotEndDate,
                null,
                '[]',
              )
            ) {
              const modSlot = {
                ...slotElement,
                selected: true,
              };
              modMSlots.splice(index, 1, modSlot);
            }
          });
        });
        reservedESlot?.forEach((element, index) => {
          const slotStartDate = this.convertToCurrentTime(element.startDate);
          const slotEndDate = this.convertToCurrentTime(element.endDate);
          arrESlotTime?.forEach((slotElement, index) => {
            // here square brackets means 'include this end' and parentheses means 'exclude this end'
            const comparePattern =
              moment(slotEndDate).diff(moment(slotStartDate), 'm') == 15
                ? '[)'
                : '[]';
            if (
              moment(slotElement.modSlot).isBetween(
                slotStartDate,
                slotEndDate,
                null,
                comparePattern,
              )
            ) {
              const modSlot = {
                ...slotElement,
                selected: true,
              };
              modESlots.splice(index, 1, modSlot);
            }
          });
        });

        let modTimeArray = [...timeArray];
        modTimeArray[0].slot = modMSlots;
        modTimeArray[1].slot = modESlots;
        this.setState({timeArray: modTimeArray});
      }
    } catch (error) {
      console.log('parseTimeSlots', error);
    }
  }

  convertToCurrentTime(date) {
    let today = new Date();
    let newDate = new Date(date).setMonth(today.getMonth());
    newDate = new Date(newDate).setDate(today.getDate());
    newDate = new Date(newDate).setFullYear(today.getFullYear());
    return new Date(newDate);
  }

  generateSelectedSlots(arr) {
    let selectedESlots = [];
    let tempStartTime = null;
    let tempEndTime = null;
    let isValid = true;
    try {
      arr.forEach((element, index) => {
        // const index = arr.indexOf(element);
        const currentSlot = element.slot;
        if (element.selected) {
          if (tempStartTime == null) {
            tempStartTime = element.slot;
          }
          if (index >= 0 && index < arr.length - 1) {
            const nextItem = arr[index + 1];
            if (nextItem.selected) {
              tempEndTime = nextItem.slot;
            } else if (nextItem.selected == false && tempEndTime == null) {
              selectedESlots.push({
                startDate: tempStartTime,
                endDate: nextItem.slot,
              });
              tempStartTime = null;
            } else if (nextItem.selected == false) {
              selectedESlots.push({
                startDate: tempStartTime,
                endDate: tempEndTime,
              });
              tempStartTime = null;
              tempEndTime = null;
            }
          } else if (tempStartTime && tempEndTime) {
            selectedESlots.push({
              startDate: tempStartTime,
              endDate: tempEndTime,
            });
            tempEndTime = null;
            tempStartTime = null;
          } else {
            isValid = false;
            this.dismissLoader();
            this.displayErrorMsg(
              'You cannot select ' +
                moment(currentSlot).format('hh:mm a') +
                ' alone.',
            );
          }
        }
      });
      if (isValid) return selectedESlots;
      else return [];
    } catch (error) {
      console.log('generateSelectedSlots', error);
    }
  }

  SavePublishAction() {
    // this.showLoader();
    const {timeArray} = this.state;
    if (timeArray.length == 2) {
      const selectMSlots = this.generateSelectedSlots(timeArray[0]?.slot);
      const selectedESlots = this.generateSelectedSlots(timeArray[1]?.slot);

      if (selectMSlots.length || selectedESlots.length) {
        let payload = {
          instantConsSchedule: {
            mSlots: selectMSlots,
            eSlots: selectedESlots,
          },
        };

        addInstantConsultationSchedule(
          payload,
          response => {
            // this.dismissLoader();
            this.navigateToListing();
          },
          error => {
            console.log(error);
            // this.dismissLoader();
            this.displayErrorMsg(error);
          },
        );
      } else {
        this.dismissLoader();
        Alert.alert('Oops!', 'Please select time slots.');
      }
    } else {
      this.dismissLoader();
    }
  }

  cancelButton() {
    const {timeArray} = this.state;
    if (timeArray.length == 2) {
      const selectMSlots = this.generateSelectedSlots(timeArray[0]?.slot);
      const selectedESlots = this.generateSelectedSlots(timeArray[1]?.slot);

      if (selectMSlots?.length || selectedESlots?.length) {
        return (
          <SmallButton
            style={{marginTop: 20}}
            buttonTitle={'Cancel'}
            buttonAction={() =>
              this.setState({renderListing: true}, () => this.animateShowView())
            }
          />
        );
      } else {
        return null;
      }
    }
  }

  render() {
    const {isEnabled} = this.state;
    return (
      <View style={commonStyles.container}>
        {this.progressLoader()}
        {!isEnabled && (
          <Animated.View
            style={[
              commonStyles.shadow,
              commonStyles.shadowCard,
              {opacity: this.imageOpacValue},
            ]}>
            <Image
              style={styles.illustration}
              source={images.instantConsultation}></Image>
            <View>
              <View style={styles.rowView}>
                <Text style={commonStyles.Regular12}>
                  Enable Instant Consultation
                </Text>
                <Switch
                  style={{transform: [{scaleX: 0.85}, {scaleY: 0.8}]}}
                  trackColor={{false: COLORS.LIGHT_GRAY, true: COLORS.GREEN}}
                  thumbColor={
                    isEnabled ? COLORS.WHITE : COLORS.SUPER_LIGHT_GRAY
                  }
                  ios_backgroundColor={COLORS.SUPER_LIGHT_GRAY}
                  onValueChange={() => {
                    this.toggleSwitch();
                  }}
                  value={isEnabled}
                />
              </View>
            </View>
          </Animated.View>
        )}
        {isEnabled && this.showInstantView()}
        <TouchableOpacity
          style={[styles.floatingBtn, styles.shadow]}
          onPress={() => this.props.navigation.navigate('WaitingRoom')}>
          <Image
            style={{
              width: getCalculated(22),
              height: getCalculated(22),
              resizeMode: 'contain',
              ...commonStyles.shadow,
            }}
            source={images.floatingbutton}
          />
        </TouchableOpacity>
      </View>
    );
  }

  handleEditHours() {
    this.setState({renderListing: false}, () => this.animateShowView());
  }

  showInstantView() {
    const {isEnabled, sessionOneSelected, timeArray, renderListing} =
      this.state;
    return (
      <ScrollView
        style={{width: '100%', paddingBottom: 200}}
        contentContainerStyle={{paddingBottom: 200, width: '100%'}}>
        <Animated.View
          style={{
            opacity: this.opacValue,
            width: '100%',
            alignItems: 'center',
          }}>
          <View
            style={[
              commonStyles.shadow,
              commonStyles.shadowCard,
              styles.instantView,
            ]}>
            <View style={styles.rowView}>
              <Text style={commonStyles.Regular12}>
                Instant Consultation Enabled
              </Text>
              <Switch
                style={{transform: [{scaleX: 0.85}, {scaleY: 0.8}]}}
                trackColor={{false: COLORS.LIGHT_GRAY, true: COLORS.GREEN}}
                thumbColor={isEnabled ? COLORS.WHITE : COLORS.SUPER_LIGHT_GRAY}
                ios_backgroundColor={COLORS.SUPER_LIGHT_GRAY}
                onValueChange={() => {
                  this.toggleSwitch();
                }}
                value={isEnabled}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: getCalculated(18),
              }}>
              <View style={styles.todayView}>
                <Text style={commonStyles.Regular12}>{"Today's Date\n"}</Text>
                <Text style={styles.todaysDate}>
                  {moment().format('ddd, MMM DD, YYYY')}
                </Text>
              </View>
              {renderListing ? (
                <Text
                  onPress={() => this.handleEditHours()}
                  style={commonStyles.Regular12Blue}>
                  Edit Hours
                </Text>
              ) : null}
            </View>
          </View>
          <View
            style={
              {
                // flex: 1,
                // width: '100%',
                // backgroundColor: 'red',
                // alignItems: 'center',
                // justifyContent: 'center',
              }
            }>
            {renderListing ? (
              <ConsultListing
                navigation={this.props.navigation}
                isEnabled={isEnabled}
              />
            ) : (
              <>
                {this.state.sessions.length ? (
                  <View style={{width: '100%', flex: 1}}>
                    <Text style={[commonStyles.Bold15, styles.stepText]}>
                      Set Hours
                    </Text>
                    <View style={styles.sessionView}>
                      <TouchableOpacity
                        onPress={() => {
                          this.sessionButtonClicked();
                        }}
                        style={styles.sessionButton(sessionOneSelected)}>
                        <Text
                          style={[
                            commonStyles.Medium11White,
                            styles.sessionButtonText(sessionOneSelected),
                          ]}>
                          Session 1
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.sessionButtonClicked();
                        }}
                        style={styles.sessionButton(!sessionOneSelected)}>
                        <Text
                          style={[
                            commonStyles.Medium11White,
                            styles.sessionButtonText(!sessionOneSelected),
                          ]}>
                          Session 2
                        </Text>
                      </TouchableOpacity>
                      <View style={{width: 10}} />
                    </View>

                    {this.showDateAndSlotsView(
                      sessionOneSelected ? timeArray[0] : timeArray[1],
                    )}

                    <SmallButton
                      style={{marginTop: 40}}
                      buttonTitle={'Save and Publish'}
                      buttonAction={() => {
                        this.SavePublishAction();
                      }}
                    />
                    {this.cancelButton()}
                  </View>
                ) : (
                  <Text style={commonStyles.Medium135}>
                    No time slots available.
                  </Text>
                )}
              </>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    );
  }

  handleTimeSlotPressed(index) {
    const {timeArray, sessionOneSelected} = this.state;
    const some_array = timeArray.slice();
    let timeSlotDict = sessionOneSelected ? timeArray[0] : timeArray[1];
    let slotArr = timeSlotDict?.slot.slice();
    for (let i = 0; i < slotArr?.length; i++) {
      slotArr[i].selected =
        index == i ? !slotArr[i]?.selected : slotArr[i]?.selected;
      this.setState({timeArray: some_array});
    }
  }

  showDateAndSlotsView(slotArray) {
    let timings = slotArray?.slot?.map((element, index) => {
      const {slot, selected, disabled} = element;
      return (
        <View key={slot} style={styles.clinicTiming(selected, disabled)}>
          <TouchableOpacity
            style={{}}
            disabled={disabled}
            onPress={() => this.handleTimeSlotPressed(index)}>
            <Text style={styles.txtTime(selected, disabled)}>
              {moment(slot).format('hh:mm a')}
            </Text>
            {selected && (
              <Image style={styles.tick} source={images.tick}></Image>
            )}
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '93%'}}>
        {timings}
      </View>
    );
  }
}

export default Instant;

const styles = StyleSheet.create({
  illustration: {
    alignSelf: 'center',
    width: getCalculated(150),
    resizeMode: 'contain',
    marginTop: -20,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayView: {
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  instantView: {
    // width: '77%'
  },
  stepText: {
    marginVertical: 10,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  sessionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_BLUE,
    height: getCalculated(39),
    // width: '100%',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sessionButton: selected => ({
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
  clinicTiming: (selected, disabled) => ({
    width: '30%',
    height: getCalculated(31),
    borderRadius: 6,
    justifyContent: 'center',
    margin: 5,
    backgroundColor: selected
      ? COLORS.BLUE
      : disabled
      ? COLORS.LIGHTER_GREY
      : COLORS.WHITE,
    alignSelf: 'center',
    marginTop: 10,
    ...commonStyles.shadow,
  }),
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 7.65,

    elevation: 4,
  },
  tick: {
    position: 'absolute',
    top: -6,
    right: 5,
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  txtTime: (selected, disabled) => ({
    ...commonStyles.Medium125,
    alignSelf: 'center',
    color: selected ? COLORS.WHITE : disabled ? COLORS.WHITE : COLORS.DARK_GRAY,
  }),
  todaysDate: {
    ...commonStyles.Bold135,
    // marginLeft: getCalculated(11),
  },
  floatingBtn: {
    width: getCalculated(50),
    height: getCalculated(50),
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});
