import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import Tabbar from './PatientTabbar';
import images from '../assets/images';
import {commonStyles, COLORS} from '../components/Common';
import PatientViewProfile from '../screens/PatientScreens/PatientViewProfile';
import EditPersonalInfo from '../screens/Profile/EditPersonalInfo';
import EditContactDetails from '../screens/Profile/EditContactDetails';
import EditLanguages from '../screens/Profile/EditLanguages';
import ChangePassword from '../screens/Profile/ChangePassword';
import PatientNotification from '../screens/Notifications/PatientNotification';

import NavBarButtonComponent from '../components/NavBarButtonComponent';
import {webview} from '../networking/Constats';
import WebviewDetails from '../screens/WebView/WebView';
import DoctorsListFilter from '../screens/Home/DoctorsListFilter';
import AddNewDelegateUser from '../screens/PatientScreens/AddNewDelegateUser';
import DelegateAccess from '../screens/PatientScreens/DelegateAccess';
import DelegateUsers from '../screens/PatientScreens/DelegateUsers';
import Services from '../screens/PatientScreens/Services/Services';
import PaymentInsurance from '../screens/PatientScreens/Payment&Insurance/PaymentInsurance';
import InsuranceDetails from '../screens/PatientScreens/Payment&Insurance/InsuranceDetails';
import MyPreferences from '../screens/PatientScreens/Preferences/MyPreferences';
import SessionSlots from '../screens/Home/SessionSlots';
import Avaibility from '../screens/PatientScreens/Preferences/Avaibility';
import PatientBookAppointment from '../screens/PatientScreens/PatientBookAppointment';
import DoctorInfo from '../screens/PatientScreens/PatientBookAppointment/DoctorInfo';
import AppointmentConfirmation from '../screens/PatientScreens/PatientBookAppointment/AppointmentConfirmation';
import AppointmentSuccess from '../screens/PatientScreens/PatientBookAppointment/AppointmentSuccess';
import ConsentForm from '../screens/PatientScreens/PatientBookAppointment/ConsentForm';
import HomeFilter from '../screens/PatientScreens/Home/HomeFilter';
import {Store} from '../../App';
import {RESET_BOOK_APPOINTMENT} from '../redux/BookAppointmentReducer';
import TwilioCall from '../screens/TwilioCall';
import Chat from '../screens/TwilioCall/Chat';
import DoctorList from '../screens/PatientScreens/Instant/DoctorList';
import SelectAppType from '../screens/PatientScreens/Instant/SelectAppType';
import InstantAppListing from '../screens/PatientScreens/Instant/InstantAppListing';
import InstantBookAppointment from '../screens/PatientScreens/Instant/BookAppointment';
import IntakeForm from '../screens/PatientScreens/Instant/IntakeForm';
import {getNotifications} from '../networking/APIMethods';
import ProviderNotification from '../screens/Notifications/ProviderNotification';
import PaymentScreen from '../screens/PatientScreens/Instant/PaymentScreen';
import {resetAppointment} from '../redux/BookAppointmentActions';
import Camera from '../screens/Equipments/Camera';
import Microphone from '../screens/Equipments/Microphone';
import Speaker from '../screens/Equipments/Speaker';

const MainNav = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: COLORS.BLUE,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
  },
  headerTintColor: COLORS.WHITE,
  headerBackTitle: 'Back',
  headerTitleAlign: 'center',
};

function LogoTitle(navigation) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (fetching == false) {
      setFetching(true);
      getNotifications(
        response => {
          setFetching(false);
          count = response.filter(ele => ele.read == false).length;
          setNotificationCount(count);
        },
        error => {
          setFetching(false);
          console.log(error);
        },
      );
    }
  }, [navigation]);

  return (
    <View style={styles.navBar}>
      <View style={styles.logoMainView}>
        <TouchableOpacity
          style={styles.touchBtnStyle}
          onPress={() => navigation.openDrawer()}>
          <Image style={styles.hamburgerIcon} source={images.leftmenu} />
          <Image style={styles.logoStyle} source={images.headerlogoWhite} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProviderNotification');
        }}>
        <Image style={styles.notificationIcon} source={images.notification} />
        {notificationCount ? (
          <View style={styles.notificationLabel}>
            <Text style={[commonStyles.Regular9, {alignSelf: 'center'}]}>
              {notificationCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

const PatientMainStack = () => {
  return (
    <MainNav.Navigator
      screenOptions={screenOptionStyle}
      // initialRouteName='ConsentForm'
    >
      <MainNav.Screen
        name="Tabbar"
        component={Tabbar}
        options={({navigation}) => ({
          headerTitle: props => <LogoTitle {...navigation} />,
        })}
      />
      <MainNav.Screen
        name="ProviderNotification"
        component={ProviderNotification}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Notifications</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="PatientViewProfile"
        component={PatientViewProfile}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>My Profile</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
          headerRight: props => (
            <TouchableOpacity
              style={{marginHorizontal: 19}}
              onPress={() => {
                navigation.navigate('PatientNotification');
              }}>
              <Image
                style={{width: 20, height: 23, resizeMode: 'contain'}}
                source={images.notification}
              />
              <View style={styles.notificationLabel}>
                <Text style={[commonStyles.Regular9, {alignSelf: 'center'}]}>
                  {5}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      />

      <MainNav.Screen
        name="EditPersonalInfo"
        component={EditPersonalInfo}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Edit Personal Details</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
          headerRight: props => (
            <TouchableOpacity
              style={{marginHorizontal: 19}}
              onPress={() => {
                navigation.navigate('PatientNotification');
              }}>
              <Image
                style={{width: 20, height: 23, resizeMode: 'contain'}}
                source={images.notification}
              />
              <View style={styles.notificationLabel}>
                <Text style={[commonStyles.Regular9, {alignSelf: 'center'}]}>
                  {5}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      />
      <MainNav.Screen
        name="EditLanguages"
        component={EditLanguages}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Edit Languages</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
          headerRight: props => (
            <TouchableOpacity
              style={{marginHorizontal: 19}}
              onPress={() => {
                navigation.navigate('PatientNotification');
              }}>
              <Image
                style={{width: 20, height: 23, resizeMode: 'contain'}}
                source={images.notification}
              />
              <View style={styles.notificationLabel}>
                <Text style={[commonStyles.Regular9, {alignSelf: 'center'}]}>
                  {5}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      />
      <MainNav.Screen
        name="EditContactDetails"
        component={EditContactDetails}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Edit Contact Details</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
          headerRight: props => (
            <TouchableOpacity
              style={{marginHorizontal: 19}}
              onPress={() => {
                navigation.navigate('PatientNotification');
              }}>
              <Image
                style={{width: 20, height: 23, resizeMode: 'contain'}}
                source={images.notification}
              />
              <View style={styles.notificationLabel}>
                <Text style={[commonStyles.Regular9, {alignSelf: 'center'}]}>
                  {5}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      />

      <MainNav.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Change Password</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
          headerRight: props => (
            <TouchableOpacity
              style={{marginHorizontal: 19}}
              onPress={() => {
                navigation.navigate('PatientNotification');
              }}>
              <Image
                style={{width: 20, height: 23, resizeMode: 'contain'}}
                source={images.notification}
              />
              <View style={styles.notificationLabel}>
                <Text style={[commonStyles.Regular9, {alignSelf: 'center'}]}>
                  {5}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      />

      <MainNav.Screen
        name="PatientNotification"
        component={PatientNotification}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Notifications</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />

      <MainNav.Screen
        name={webview}
        component={WebviewDetails}
        options={({navigation, route: {params}}) => ({
          headerTitle: props => {
            return <Text style={commonStyles.Bold17White}>{params.title}</Text>;
          },
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="DoctorsListFilter"
        component={DoctorsListFilter}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Filters</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="AddDelegateUser"
        component={AddNewDelegateUser}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Add New Delegate User</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="DelegateAccess"
        component={DelegateAccess}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Delegated Access</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="DelegateUser"
        component={DelegateUsers}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Delegate Users</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="Services"
        component={Services}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Services Details</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="InsuranceDetails"
        component={InsuranceDetails}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Insurance Details</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="PaymentInsurance"
        component={PaymentInsurance}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Payment & Insurance</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="MyPreferences"
        component={MyPreferences}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>My Preferences</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              showLogo={false}
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="SessionSlots"
        component={Avaibility}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Appointment Time Slots</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              showLogo={false}
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="PatientBookAppointment"
        component={PatientBookAppointment}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Book Appointment</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="DoctorInfo"
        component={DoctorInfo}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Doctor Information</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="AppointmentConfirmation"
        component={AppointmentConfirmation}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Confirmation</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="AppointmentSuccess"
        component={AppointmentSuccess}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Appointment Success</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              showLogo={false}
              buttonImage={images.back}
              onPress={() => {
                navigation.popToTop();
                Store.dispatch({type: RESET_BOOK_APPOINTMENT});
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="ConsentForm"
        component={ConsentForm}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Confirmation</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="HomeFilter"
        component={HomeFilter}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Filters</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              showLogo={true}
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="TwilioCall"
        component={TwilioCall}
        options={({navigation}) => ({
          headerTitle: props => <Text style={commonStyles.Bold17White}> </Text>,
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              showLogo={false}
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="InstantDocList"
        component={DoctorList}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Instant Consultation</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="SelectAppType"
        component={SelectAppType}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Instant Consultation</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="InstantAppListing"
        component={InstantAppListing}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Instant Consultation</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
          headerRight: props => (
            <TouchableOpacity
              style={{marginHorizontal: 19}}
              onPress={() => {
                navigation.navigate('InstantDocList');
              }}>
              <Image
                style={{width: 20, height: 23, resizeMode: 'contain'}}
                source={images.toppluschat}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainNav.Screen
        name="BookAppointment"
        component={InstantBookAppointment}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Book Appointment</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="IntakeForm"
        component={IntakeForm}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Book Appointment</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
                resetAppointment();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Payment</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="Camera"
        component={Camera}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Test Camera</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="Microphone"
        component={Microphone}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Test Microphone</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Screen
        name="Speaker"
        component={Speaker}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Test Speaker</Text>
          ),
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
        })}
      />
      <MainNav.Group screenOptions={{presentation: 'modal'}}>
        <MainNav.Screen
          name="TwilioChat"
          component={Chat}
          options={({navigation}) => ({
            headerTitle: props => (
              <Text style={commonStyles.Bold17White}></Text>
            ),
            tabBarVisible: false,
            headerLeft: props => (
              <NavBarButtonComponent
                showLogo={false}
                buttonImage={images.back}
                onPress={() => {
                  navigation.pop();
                }}
              />
            ),
          })}
        />
      </MainNav.Group>
    </MainNav.Navigator>
  );
};

export {PatientMainStack};

const styles = StyleSheet.create({
  navBar: {
    width: '98%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  logoMainView: {flexDirection: 'row', alignItems: 'center'},
  touchBtnStyle: {flexDirection: 'row', alignItems: 'center'},
  hamburgerIcon: {
    width: 20,
    resizeMode: 'contain',
    marginRight: 4,
    alignSelf: 'center',
  },
  logoStyle: {width: 25, resizeMode: 'contain', marginRight: 15},
  notificationIcon: {width: 20, height: 23, resizeMode: 'contain'},
  notificationLabel: {
    width: 17,
    height: 17,
    backgroundColor: '#a2d7ef',
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 8.5,
    borderColor: COLORS.WHITE,
    justifyContent: 'center',
  },
});
