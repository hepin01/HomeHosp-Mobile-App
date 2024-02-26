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
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {LoginStack} from './LoginStack';

import {connect} from 'react-redux';
import {
  commonStyles,
  getCalculated,
  window,
  COLORS,
} from '../components/Common';
import images from '../assets/images';
import {PatientMainStack} from './PatientMainStack';
import {BlurView} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Store} from '../../App';
import ImageLoader from '../components/ImageLoader';
import {getWebViewUrl, getContentWebviewUrl, contactUs} from '../utiles/common';
import {webview, webViewBaseurl} from '../networking/Constats';
import {RESET_BOOK_APPOINTMENT} from '../redux/BookAppointmentReducer';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Drawer = createDrawerNavigator();

var patientOptionArray = [
  {
    id: 1,
    title: 'Medical History',
    icon: images.medihistory,
    screen: webview,
    uri: 'profile/medical-history/',
  },
  {
    id: 2,
    title: 'Delegate Users',
    icon: images.delegateuser,
    screen: 'DelegateUser',
  },
  {
    id: 3,
    title: 'Preferences',
    icon: images.preferences,
    screen: 'MyPreferences',
  },
  {
    id: 4,
    title: 'Payment & Insurance',
    icon: images.payments,
    screen: 'PaymentInsurance',
  },
  {
    id: 5,
    title: 'Delegated Access',
    icon: images.delaccess,
    screen: 'DelegateAccess',
  },
  {id: 6, title: 'Services', icon: images.services, screen: 'Services'},
  {
    id: 7,
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
  {
    id: 8,
    title: 'Help & Support',
    icon: images.support,
    screen: '',
    isViewOpen: false,
    subItems: [
      {
        subTitle: 'FAQs',
        screen: webview,
        uri: getContentWebviewUrl(webViewBaseurl+'faq/isMobile'),
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
        uri: getContentWebviewUrl(webViewBaseurl+'privacy-policy/isMobile'),
      },
      {
        subTitle: 'Terms of Services',
        screen: webview,
        uri: getContentWebviewUrl(webViewBaseurl+'terms-of-use-patient/isMobile'),
      },
    ],
  },
  {
    id: 9,
    title: 'Change Password',
    icon: images.password,
    screen: 'ChangePassword',
  },
  {id: 10, title: 'Logout', icon: images.logout, screen: ''},
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
          if (item.id == 10) {
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
                    Store.dispatch({type: RESET_BOOK_APPOINTMENT});
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
          {(item.id == 7 || item.id == 8) && (
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
              props.navigation.navigate('PatientViewProfile');
            }}>
            <View style={styles.topView}>
              <ImageLoader
                style={styles.imageView}
                url={{uri: user.profileImgUrl}}
                placeholder={images.userdefault}
              />
              <View style={styles.userView}>
                <Text style={[commonStyles.Bold17White, {width: '90%'}]}>
                  {user.firstname + ' ' + user.lastname}
                </Text>
                {user.identificationType && user.identificationNumber ? (
                  <Text style={commonStyles.Regular11White}>
                    {user.identificationType + ': ' + user.identificationNumber}
                  </Text>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
          {patientOptionArray.map((item, index) => (
            <Accordion
              item={item}
              index={index}
              props={props}
              key={index + 111}>
              {(item.id == 7 || item.id == 8) &&
                item.subItems.map((subItem, subIndex) => (
                  <View
                    key={subIndex}
                    style={[{backgroundColor: 'rgba(255, 255, 255, 0.2)'}]}>
                    <TouchableHighlight
                      key={subIndex + 1}
                      underlayColor="rgba(255, 255, 255, 0.2)"
                      onPress={() => {
                        if (subItem.screen?.length > 0) {
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

export const PatientDrawerNavigator = () => {
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
        name="PatientMainStack"
        component={PatientMainStack}
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
connect(STATE)(PatientDrawerNavigator);

const styles = StyleSheet.create({
  menuContainer: {
    height: window.height + 270,
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
    // width: getCalculated(41),
    // height: getCalculated(41),
    // borderRadius: 6,
    // justifyContent: 'center',
    width: getCalculated(41),
    height: getCalculated(41),
    borderRadius: getCalculated(6),
    alignSelf: 'center',
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
