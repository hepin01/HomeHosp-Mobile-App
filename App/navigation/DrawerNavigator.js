import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {LoginStack} from './LoginStack';
import {MainStack} from './MainStack';
import {PatientDrawerNavigator} from './PatientDrawerNavigator';

import {connect} from 'react-redux';
import {
  commonStyles,
  getCalculated,
  window,
  COLORS,
} from '../components/Common';
import images from '../assets/images';
import {BlurView} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Store} from '../../App';
import {webview, webViewBaseurl} from '../networking/Constats';
import {
  getWebViewUrl,
  isProvider,
  getContentWebviewUrl,
  contactUs,
} from '../utiles/common';
import ImageLoader from '../components/ImageLoader';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  UPDATE_DEVICE_TOKEN,
  UPDATE_NOTIFICATION_POPUP,
} from '../redux/UserReducer';
import {navigationRef} from './NavigationAction';
import * as RootNavigation from './NavigationAction';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Drawer = createDrawerNavigator();
const commonOptions = [
  {
    id: 11,
    title: 'Change Password',
    icon: images.password,
    screen: 'ChangePassword',
  },
  {id: 12, title: 'Logout', icon: images.logout, screen: ''},
];
// var optionArray = [];

const commonProviderOptions = [
  {
    id: 10,
    title: 'Help & Support',
    icon: images.support,
    screen: '',
    isViewOpen: false,
    subItems: [
      {
        subTitle: 'FAQs',
        screen: webview,
        uri: getContentWebviewUrl(webViewBaseurl + 'faq/isMobile'),
      },
      {
        subTitle: 'Contact Us',
        screen: 'contact',
        // uri: 'profile/insurance-billing/',
      },
      // {
      //   subTitle: 'About Us',
      //   // screen: webview,
      //   // uri: 'profile/insurance-billing/',
      // },
      {
        subTitle: 'Privacy Policy',
        screen: webview,
        uri: getContentWebviewUrl(webViewBaseurl + 'provider-policy/isMobile'),
      },
      {
        subTitle: 'Terms of Services',
        screen: webview,
        uri: getContentWebviewUrl(webViewBaseurl + 'terms-of-use-provider/isMobile'),
      },
    ],
  },
];

var medicalProviderOptions = [
  {
    id: 1,
    title: 'My Schedule',
    icon: images.myschedule,
    screen: 'MySchedule',
    // uri: 'schedule/',
  },
  {
    id: 2,
    title: 'Scheduler Management',
    icon: images.schedulemanager,
    screen: 'Scheduler',
  },
  {
    id: 7,
    title: 'E - Consultation',
    icon: images.consultation,
    screen: 'E-Consultation',
  },
  ...commonProviderOptions,
  ...commonOptions,
];

var providerOptions = [
  {
    id: 1,
    title: 'My Schedule',
    icon: images.myschedule,
    screen: 'MySchedule',
    // uri: 'schedule/',
  },
  {
    id: 2,
    title: 'Scheduler Management',
    icon: images.schedulemanager,
    screen: 'Scheduler',
  },
  {
    id: 3,
    title: 'Insurance Billing',
    icon: images.insurancebilling,
    screen: webview,
    uri: 'profile/insurance-billing/',
  },
  {
    id: 4,
    title: 'Online Billing',
    icon: images.onlinebill,
    screen: webview,
    uri: 'profile/online-billing-day-one/',
  },
  {
    id: 5,
    title: 'Payment Information',
    icon: images.onlinebill,
    screen: webview,
    uri: 'profile/payment-info/',
  },
  {
    id: 6,
    title: 'Onboard User',
    icon: images.onboarduser,
    screen: 'InviteUser',
  },
  {
    id: 7,
    title: 'E - Consultation',
    icon: images.consultation,
    screen: 'E-Consultation',
  },
  {
    id: 8,
    title: 'Subscription Details',
    icon: images.subscriptiondetails,
    screen: webview,
    uri: 'profile/subscription-details/',
  },
  {
    id: 9,
    title: 'Check Equipment',
    icon: images.checkequipment,
    screen: '',
    isViewOpen: false,
    subItems: [
      {subTitle: 'Test Speaker', screen: 'Speaker'},
      {subTitle: 'Test Microphone', screen: 'Microphone'},
      {subTitle: 'Test Camera', screen: 'Camera'},
    ],
  },
  ...commonProviderOptions,
  ...commonOptions,
];

const Accordion = ({item, index, children, props}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(value => !value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <View key={index}>
      <TouchableHighlight
        key={index + 1}
        underlayColor="rgba(255, 255, 255, 0.2)"
        onPress={() => {
          toggleOpen();
          if (item.id == 12) {
            Alert.alert(
              'Logout',
              'Do you want to logout of the application?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  onPress: () => {
                    // logout(user.userId, user.accessToken, (response) => {
                    Store.dispatch({type: 'LOGOUT'});
                    props.navigation.closeDrawer();
                    // },
                    //     (error) => {
                    //     },
                    // )
                  },
                },
              ],
              {cancelable: false},
            );
          } else {
            if (item.screen?.length > 0) {
              if (item.hasOwnProperty('uri')) {
                const webviewUri = getWebViewUrl(item.uri);
                props.navigation.navigate(item.screen, {
                  uri: webviewUri,
                  title: item.title,
                });
              } else props.navigation.navigate(item.screen);
            }
          }
        }}
        style={styles.heading}
        activeOpacity={0.6}>
        <View key={index + 11} style={styles.innerView}>
          <Image
            key={index + 111}
            style={styles.sideImage}
            source={item.icon}
          />
          <Text key={index + 112} style={styles.header}>
            {item.title}
          </Text>
          {(item.id == 9 || item.id == 10) && (
            <Image
              key={index + 113}
              style={styles.arrowImage}
              source={isOpen ? images.arrowdown : images.arrow}
            />
          )}
        </View>
      </TouchableHighlight>
      <View
        key={index + 2}
        style={[styles.list, !isOpen ? styles.hidden : undefined]}>
        {children}
      </View>
    </View>
  );
};

function CustomDrawerContent(props) {
  const insets = useSafeAreaInsets;
  const user = Store.getState().user.user;
  const [optionArray, setOptionArray] = useState([]);

  React.useEffect(() => {
    if (user.userType == 'provider') {
      setOptionArray(providerOptions);
    } else {
      setOptionArray(medicalProviderOptions);
    }
  }, []);

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        paddingTop: Platform.OS == 'ios' ? insets.top : 0,
      }}
      style={{}}
      bounces="true"
      {...props}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.topProfileView}
            onPress={() => {
              props.navigation.navigate('ViewProfile');
            }}>
            <View style={styles.topView}>
              <View>
                <ImageLoader
                  style={styles.imageView}
                  url={{uri: user.profileImgUrl}}
                  placeholder={images.userdefault}
                />
              </View>
              <View style={styles.userView}>
                <Text style={[commonStyles.Bold17White, {marginRight: 18}]}>
                  {'Dr. ' + user.firstname + ' ' + user.lastname}
                </Text>
                <Text style={commonStyles.Regular11White}>
                  {user.identificationType + ': ' + user.identificationNumber}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {optionArray.map((item, index) => (
            <Accordion
              item={item}
              index={index}
              props={props}
              key={index + 111}>
              {(item.id == 9 || item.id == 10) &&
                item.subItems.map((subItem, subIndex) => (
                  <View
                    key={subIndex}
                    style={[{backgroundColor: 'rgba(255, 255, 255, 0.2)'}]}>
                    <TouchableHighlight
                      key={subIndex + 1}
                      underlayColor="rgba(255, 255, 255, 0.2)"
                      onPress={() => {
                        console.log(subItem);
                        if (subItem.screen?.length > 0) {
                          if (subItem.hasOwnProperty('uri')) {
                            const webviewUri = subItem.uri;
                            props.navigation.navigate(subItem.screen, {
                              uri: webviewUri,
                              title: subItem.subTitle,
                            });
                          } else if (subItem.screen == 'contact') {
                            Linking.openURL(`tel:` + contactUs());
                          } else {
                            props.navigation.navigate(subItem.screen);
                          }
                        }
                      }}
                      activeOpacity={0.6}>
                      <View key={subIndex + 2} style={styles.innerView}>
                        <Text key={subIndex + 3} style={styles.subHeader}>
                          {subItem.subTitle}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                ))}
            </Accordion>
          ))}
        </View>
        <View style={{height: window.height, width: '20%'}}>
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={7}
            reducedTransparencyFallbackColor="white"
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: '100%',
          backgroundColor: 'transparent',
        },
        drawerType: 'front',
        sceneContainerStyle: {
          backgroundColor: '#98a0ab',
          width: '100%',
        },
        overlayColor: 'transparent',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      useLegacyImplementation={false}
      independent={true}>
      <Drawer.Screen
        name="MainStack"
        component={MainStack}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

const STATE = state => {
  return {
    user: state.user.user,
  };
};
connect(STATE)(DrawerNavigator);

class Root extends React.Component {
  async componentDidMount() {
    if (Platform.OS == 'ios') {
      PushNotificationIOS.requestPermissions([
        'alert',
        'badge',
        'sound',
        'critical',
      ]);
    } else if (Platform.OS == 'android') {
      if (Platform.Version >= 33) {
        await this._requestNotificationPermission();
      }
    }
    this.configNotifications();
  }

  configNotifications() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
        Store.dispatch({type: UPDATE_DEVICE_TOKEN, payload: token.token});
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        const notificationData = notification?.data || {};
        const webviewUrl = getWebViewUrl(
          `appointment-details/${notificationData?._id}/`,
        );
        if (notification?.foreground == false) {
          if (notificationData?.type.toLowerCase() == 'instantconsultation') {
            if (isProvider()) {
              RootNavigation?.navigate('Instant');
            } else {
              RootNavigation?.navigate('Book New', {
                screen: 'InstantAppListing',
              });
            }
          }
        } else {
          // RootNavigation?.navigate(webview, {
          //   uri: webviewUrl,
          //   title: 'Appointment Details',
          // });
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  _requestNotificationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      'android.permission.POST_NOTIFICATIONS',
      {
        title: 'Need permission for notification',
        message:
          'To get updates via. push notifications we need your permission for notifications.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      this.configNotifications();
    } else {
      const dnsa = Store.getState().user.notDoNotShowAgain;
      if (!dnsa) {
        Alert.alert(
          'Oops!!',
          'Permission not granted for Notifications. Please go to settings and allow the permission to start receiving notifications.',
          [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Do not show again',
              onPress: () =>
                Store.dispatch({
                  type: UPDATE_NOTIFICATION_POPUP,
                  payload: true,
                }),
            },
            {
              text: 'Cancel',
              style: 'destructive',
            },
          ],
        );
      }
    }
  };

  render() {
    const {isLoggedIn: isLoggedIn, user: user} = this.props;
    return isLoggedIn ? (
      <NavigationContainer ref={navigationRef}>
        {user.userType == 'patient' ? (
          <PatientDrawerNavigator />
        ) : (
          <DrawerNavigator />
        )}
      </NavigationContainer>
    ) : (
      <NavigationContainer ref={navigationRef}>
        <LoginStack />
      </NavigationContainer>
    );
  }
}

const state = state => ({
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
});
export default connect(state)(Root);

const styles = StyleSheet.create({
  menuContainer: {
    height: window.height + 380,
    justifyContent: 'flex-start',
    width: '80%',
    backgroundColor: COLORS.BLUE,
  },
  header: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Regular',
    marginLeft: getCalculated(12),
  },
  subHeader: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Regular',
    marginLeft: getCalculated(50),
  },
  menu: {
    fontSize: getCalculated(12),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    marginLeft: getCalculated(12),
    marginTop: getCalculated(25),
    marginBottom: getCalculated(10),
  },
  imageView: {
    width: getCalculated(41),
    height: getCalculated(41),
    borderRadius: 6,
    justifyContent: 'center',
  },
  topView: {
    flexDirection: 'row',
    marginHorizontal: getCalculated(20),
    marginTop: Platform.OS == 'ios' ? getCalculated(50) : getCalculated(20),
    marginBottom: getCalculated(10),
  },

  topProfileView: {backgroundColor: 'rgba(255, 255, 255, 0.2)'},
  userView: {
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    marginLeft: 10,
  },

  arrowImage: {
    width: getCalculated(16),
    height: getCalculated(14),
    marginLeft: getCalculated(20),
    resizeMode: 'contain',
    position: 'absolute',
    right: 20,
  },

  // optionView: (item) => ({ width: '100%', marginTop: 5, height: getCalculated(50) }),

  innerView: {
    flexDirection: 'row',
    height: getCalculated(45),
    alignItems: 'center',
  },

  sideImage: {
    width: getCalculated(16),
    height: getCalculated(16),
    marginLeft: getCalculated(20),
    resizeMode: 'contain',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  hidden: {
    height: 0,
  },
  list: {
    overflow: 'hidden',
  },
});
