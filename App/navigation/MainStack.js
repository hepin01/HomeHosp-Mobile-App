import React, {useState, useEffect} from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import Tabbar from './Tabbar';
import images from '../assets/images';
import {commonStyles, COLORS} from '../components/Common';
import ViewProfile from '../screens/Profile/ViewProfile';
import EditSpecialities from '../screens/Profile/EditSpecialities';
import EditPersonalInfo from '../screens/Profile/EditPersonalInfo';
import EditContactDetails from '../screens/Profile/EditContactDetails';
import EditLanguages from '../screens/Profile/EditLanguages';
import ChangePassword from '../screens/Profile/ChangePassword';
import InviteUser from '../screens/Profile/InviteUser';
import ProviderNotification from '../screens/Notifications/ProviderNotification';

import NavBarButtonComponent from '../components/NavBarButtonComponent';
import TodaysAppointments from '../screens/Home/TodaysAppointments';
import Scheduler from '../screens/Home/Scheduler';
import BookedAppointments from '../screens/Home/BookedAppointments';
import EConsultation from '../screens/Home/EConsultation';
import WebView from '../screens/WebView/WebView';
import DoctorsList from '../screens/Home/DoctorsList';
import SessionSlots from '../screens/Home/SessionSlots';
import DoctorsListFilter from '../screens/Home/DoctorsListFilter';
import {webview} from '../networking/Constats';
import MySchedule from '../screens/Home/MySchedule';
import TwilioCall from '../screens/TwilioCall';
import Chat from '../screens/TwilioCall/Chat';
import Invite from '../screens/Instant/Invite';
import ConsultListing from '../screens/Instant/ConsultListing';
import SendRequest from '../screens/Instant/SentRequest';
import {getNotifications} from '../networking/APIMethods';
import WaitingRoom from '../screens/Instant/WaitingRoom';
import IntakeForm from '../screens/Instant/IntakeForm';
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

const Notification = navigation => {
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
    <TouchableOpacity
      style={{marginHorizontal: 19}}
      onPress={() => {
        navigation.navigate('ProviderNotification');
      }}>
      <Image
        style={{width: 20, height: 23, resizeMode: 'contain'}}
        source={images.notification}
      />
      {notificationCount !== 0 ? (
        <View style={styles.notificationLabel}>
          <Text style={[commonStyles.Regular9, {alignSelf: 'center'}]}>
            {notificationCount}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
const MainStack = () => {
  return (
    <MainNav.Navigator
      screenOptions={screenOptionStyle}
      // initialRouteName={'MySchedule'}
    >
      <MainNav.Screen
        name="Tabbar"
        component={Tabbar}
        options={({navigation}) => ({
          headerTitle: props => <LogoTitle {...navigation} />,
        })}
      />
      <MainNav.Screen
        name="ViewProfile"
        component={ViewProfile}
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
          headerRight: props => <Notification {...navigation} />,
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
          headerRight: props => <Notification {...navigation} />,
        })}
      />

      <MainNav.Screen
        name="EditSpecialities"
        component={EditSpecialities}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Edit Specialities</Text>
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
          headerRight: props => <Notification {...navigation} />,
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
          headerRight: props => <Notification {...navigation} />,
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
          headerRight: props => <Notification {...navigation} />,
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
          headerRight: props => <Notification {...navigation} />,
        })}
      />

      <MainNav.Screen
        name="InviteUser"
        component={InviteUser}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>
              Invite Provider/Patient
            </Text>
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
          headerRight: props => <Notification {...navigation} />,
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
        name="TodaysAppointments"
        component={TodaysAppointments}
        options={({navigation}) => ({
          headerTitle: props => <Text style={commonStyles.Bold17White}></Text>,
          tabBarVisible: false,
          headerLeft: props => (
            <NavBarButtonComponent
              buttonImage={images.back}
              onPress={() => {
                navigation.pop();
              }}
            />
          ),
          headerRight: props => <Notification {...navigation} />,
        })}
      />
      <MainNav.Screen
        name="Scheduler"
        component={Scheduler}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Scheduler</Text>
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
          headerRight: props => <Notification {...navigation} />,
        })}
      />
      <MainNav.Screen
        name="BookedAppointments"
        component={BookedAppointments}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Scheduler</Text>
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
          headerRight: props => <Notification {...navigation} />,
        })}
      />
      <MainNav.Screen
        name="E-Consultation"
        component={EConsultation}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>E - Consultation</Text>
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
        component={WebView}
        options={({navigation, route: {params}}) => ({
          headerTitle: props => {
            return <Text style={commonStyles.Bold17White}>{params.title}</Text>;
          },
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
        name="doctorList"
        component={DoctorsList}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>E - Consultation</Text>
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
        name="SessionSlots"
        component={SessionSlots}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>E - Consultation</Text>
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
        name="DoctorsListFilter"
        component={DoctorsListFilter}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>
              E - Consultation Filters
            </Text>
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
        name="MySchedule"
        component={MySchedule}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>My Schedule</Text>
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
        name="TwilioCall"
        component={TwilioCall}
        options={({navigation}) => ({
          headerTitle: props => <Text style={commonStyles.Bold17White}></Text>,
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
        name="ConsultListing"
        component={ConsultListing}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Instant Consultation</Text>
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
        name="InstantInvite"
        component={Invite}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Invite Patient</Text>
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
        name="SendRequest"
        component={SendRequest}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Instant Consultation</Text>
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
        name="WaitingRoom"
        component={WaitingRoom}
        options={({navigation}) => ({
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Waiting Room</Text>
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
            <Text style={commonStyles.Bold17White}>Waiting Room</Text>
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

export {MainStack};

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
    height: 25,
    resizeMode: 'contain',
    marginRight: 4,
    alignSelf: 'center',
  },
  logoStyle: {
    height: 25,
    resizeMode: 'contain',
    marginRight: 15,
    alignSelf: 'center',
  },
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
