/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import {commonStyles, getCalculated, COLORS} from '../../components/Common';
import images from '../../assets/images';
import {SmallButton} from '../../components/SmallButton';
import {connect} from 'react-redux';
import Base from '../Base/Base';
import {
  addFirebaseTokenToUser,
  checkDay1Day2ForProvider,
  getCurrentPlan,
  getProviderTodaysApp,
} from '../../networking/APIMethods';
import ImageLoader from '../../components/ImageLoader';
import TodaysAppointments from './TodaysAppointments';
import {webview} from '../../networking/Constats';
import {
  getUTCIso,
  getWebViewUrl,
  isProvider,
  userId,
} from '../../utiles/common';
import {Loader} from '../../components/Loader';
import moment from 'moment';
import {AlertModal} from '../../components/AlertModal';
import {Store} from '../../../App';
import {RESET_BOOK_APPOINTMENT} from '../../redux/BookAppointmentReducer';
import {signURL} from '../../networking/Constats';

class Home extends Base {
  constructor(props) {
    super(props);
    this.state = {
      showSubModel: false,
      fetching: true,
      navigateToDay2: false,
      count: 0,
      filter: {
        status: 'all',
        filter: 'upcoming',
        sessionType: 'all',
        from: null,
        to: null,
        patientName: '',
        limit: 30,
        offset: 0,
      },
    };
  }

  componentDidMount() {
    // this.showLoader();
    console.log('TOKEN HOME', this.props.deviceToken);
    addFirebaseTokenToUser(
      this.props.deviceToken,
      response => {
        console.log('addFirebaseTokenToUser', response);
      },
      err => {
        // this.dismissLoader();
        console.log(err);
      },
    );
    this.focusListener = this.props.navigation.addListener('focus', () => {
      getCurrentPlan(
        true,
        isValid => {
          this.dismissLoader();
          if (isValid) {
            this.fetchTodaysAppointmentCount();
            this.checkUserDetails();
          } else {
            this.setState({showSubModel: true, fetching: false});
          }
        },
        e => {
          this.dismissLoader();
          console.log(e);
        },
      );
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  fetchTodaysAppointmentCount() {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const payload = {
      query: {
        doctor: userId(),
        startDate: {
          $gte: moment().startOf('day').format(dateFormat),
          $lte: moment().endOf('day').format(dateFormat),
        },
      },
      select: {_id: 1},
    };
    getProviderTodaysApp(
      payload,
      response => {
        // setCount(response);
        this.setState({count: response});
      },
      error => {
        console.log(error);
        this.displayErrorMsg(error);
      },
    );
  }

  checkUserDetails = () => {
    this.showLoader('');
    checkDay1Day2ForProvider(
      {userId: userId()},
      response => {
        this.setState({fetching: false});
        this.dismissLoader();
        this.setState({navigateToDay2: response.navigateToDay2});
      },
      error => {
        this.dismissLoader();
        console.log(error);
      },
    );
  };

  addSummaryClicked() {
    this.props.navigation.navigate('EditPersonalInfo');
  }

  addDetailsClicked() {
    const uri = 'profile/online-billing-day-one/';
    const webviewUri = getWebViewUrl(uri);
    this.props.navigation.navigate(webview, {
      uri: webviewUri,
      title: 'Online Billing',
    });
  }

  renderAlert() {
    return (
      <View style={styles.alertContainer}>
        <Image style={styles.alertImg} source={images.declinedapp} />
        <Text style={{...commonStyles.Medium16, margin: 15}}>{'Oops!'}</Text>
        <Text style={commonStyles.Regular135}>
          Seems like your plan has expired. Please login to{' '}
          <Text
            style={commonStyles.blueButton}
            onPress={() => Linking.openURL(signURL)}>
            {signURL}
          </Text>{' '}
          and renew your plan to continue getting appointments booked from
          patients.
        </Text>
      </View>
    );
  }
  render() {
    const {user} = this.props;
    const {showSubModel} = this.state;
    return (
      <View style={[commonStyles.container]}>
        <AlertModal
          modalVisible={showSubModel}
          renderItem={this.renderAlert()}
          leftButtonAction={() => {
            this.setState({showSubModel: false});
            Store.dispatch({type: 'LOGOUT'});
            Store.dispatch({type: RESET_BOOK_APPOINTMENT});
          }}
        />
        {showSubModel == false ? (
          <>
            <View style={commonStyles.increasedNavBar}></View>
            <View style={[styles.welcomeView, commonStyles.shadow]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={[commonStyles.Regular135, {width: '90%', flex: 2}]}>
                  {'Welcome, Dr. ' + user.firstname + ' ' + user.lastname}
                </Text>
                <ImageLoader
                  resizeMode={'contain'}
                  resizeMethod={'resize'}
                  style={styles.userImage}
                  url={{uri: user.profileImgUrl}}
                  placeholder={images.userdefault}
                />
              </View>
            </View>
            <View
              style={{
                width: '100%',
                marginTop:
                  Platform.OS == 'ios' ? getCalculated(25) : getCalculated(30),
                alignItems: 'center',
              }}>
              {this.showDayOne()}
            </View>
          </>
        ) : null}
      </View>
    );
  }

  showDayOne() {
    const {user} = this.props;
    const {count, navigateToDay2, fetching} = this.state;
    return (
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.appointmentsStatusContainer}>
          <View style={styles.countContainer}>
            <Text
              style={[commonStyles.RegularBlack115, styles.appointmentCount]}>
              {user?.userType == 'provider'
                ? "Today's Appointments "
                : 'Total appointment booked today '}
            </Text>
            <Text style={[commonStyles.Bold20, styles.appointmentCount]}>
              {count || 0}
            </Text>
          </View>
        </View>
        {fetching ? null : navigateToDay2 ? (
          <TodaysAppointments
            navigation={this.props.navigation}
            count={count}
          />
        ) : (
          <View>
            <View style={{marginVertical: getCalculated(15)}}>
              <Text
                style={{
                  ...commonStyles.Regular135,
                  alignItems: 'flex-start',
                }}>
                {
                  "Let's get you ready to enable appointment booking against your profile"
                }
              </Text>
            </View>
            <View style={styles.dayOnewView}>
              {user.about.length == 0 ? (
                <>
                  <Text style={[commonStyles.Bold15, styles.stepText]}>
                    Step 1
                  </Text>
                  <View style={styles.stepOneView}>
                    <Text
                      style={[commonStyles.Regular135, styles.stepInsideText]}>
                      {
                        'Adding a short summary would help patient to know more about yourself and build confidence.'
                      }
                    </Text>
                    <SmallButton
                      style={[styles.stepInsideButton]}
                      buttonTitle={'Add a Summary'}
                      buttonAction={() => {
                        this.addSummaryClicked();
                      }}
                    />
                  </View>
                </>
              ) : null}

              {user?.userType == 'provider' ? (
                <>
                  <Text style={[commonStyles.Bold15, styles.stepText]}>
                    Step 2
                  </Text>
                  <View style={styles.stepOneView}>
                    <Text
                      style={[commonStyles.Regular135, styles.stepInsideText]}>
                      {
                        'Add payment details on which you would like to receive consultation fees from patients.'
                      }
                    </Text>
                    <SmallButton
                      style={styles.stepInsideButton}
                      buttonTitle={'Add Details'}
                      buttonAction={() => {
                        this.addDetailsClicked();
                      }}
                    />
                  </View>
                </>
              ) : null}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const STATE = state => ({
  user: state.user.user,
  deviceToken: state.user.deviceToken,
  data: state.user,
});
export default connect(STATE)(Home);

const styles = StyleSheet.create({
  welcomeView: {
    width: '90%',
    height: getCalculated(55),
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    borderRadius: 6,
    top: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  userImage: {
    width: getCalculated(41),
    height: getCalculated(41),
    borderRadius: 7,
    resizeMode: 'cover',
  },
  todaysApptView: {
    width: 'auto',
    height: getCalculated(40),
    backgroundColor: '#ebf4f8',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 15,
    alignSelf: 'center',
  },
  dayOnewView: {
    width: '95%',
    alignSelf: 'center',
  },
  stepText: {
    marginTop: 15,
    marginBottom: 10,
  },
  stepOneView: {
    backgroundColor: '#e4f4fb',
    width: '100%',
    height: getCalculated(Platform.OS == 'android' ? 150 : 138),
    alignSelf: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.BLUE,
    marginBottom: 15,
  },
  stepInsideText: {
    alignSelf: 'center',
    margin: 20,
    textAlign: 'center',
  },
  stepInsideButton: {
    width: 'auto',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  appointmentsStatusContainer: {
    marginHorizontal: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countContainer: {
    // height: getCalculated(82),
    backgroundColor: '#e4f4fb',
    paddingHorizontal: 8,
    paddingVertical: 16,
    // alignSelf: 'flex-start',
    borderRadius: 6,
    // marginTop: 5,
    // marginBottom: 10,
    // marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentCount: {
    textAlign: 'center',
    paddingHorizontal: getCalculated(6),
  },
  alertContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: getCalculated(15),
  },
  alertImg: {
    resizeMode: 'contain',
    // resizeMethod: '',
    height: getCalculated(60),
    width: getCalculated(60),
  },
});
