import React from 'react';
import {
  Platform,
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import images from '../assets/images';
import {commonStyles, COLORS} from '../components/Common';
import PatientMenu from '../screens/PatientScreens/PatientMenu';
import PatientAppointment from '../screens/PatientScreens/PatientAppointment';
import PatientHome from '../screens/PatientScreens/Home/PatientHome';
import PatientMsg from '../screens/PatientScreens/PatientMsg';
import BookNew from '../screens/PatientScreens/BookNew';
import {connect} from 'react-redux';
import {Store} from '../../App';
import DelegateUsers from '../screens/PatientScreens/DelegateUsers';

const Tab = createBottomTabNavigator();

const PatientTabbar = () => {
  const user = Store.getState().user.user;
  console.log(user);
  return (
    <Tab.Navigator
      screenOptions={({route, focused}) => ({
        headerShown: false,
      })}
      initialRouteName={'Home'}>
      <Tab.Screen
        name="Book New"
        component={BookNew}
        options={navigation => ({
          title: '',
          tabBarIcon: ({color, focused}) => (
            <View>
              {
                <Image
                  style={styles.imageStyle}
                  source={focused ? images.booknewactive : images.booknew}
                />
              }
            </View>
          ),
          tabBarLabel: ({focused, color}) => (
            <View style={styles.tabView}>
              <Text style={[commonStyles.Medium125, styles.tabText(focused)]}>
                Book New
              </Text>
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="DelegateUsers"
        component={DelegateUsers}
        options={navigation => ({
          title: '',
          tabBarIcon: ({color, focused}) => (
            <View>
              {
                <Image
                  style={styles.imageStyle}
                  source={
                    focused ? images.delegatedactive : images.delegatedDeactive
                  }
                />
              }
            </View>
          ),
          tabBarLabel: ({focused, color}) => (
            <View style={styles.tabView}>
              <Text style={[commonStyles.Medium125, styles.tabText(focused)]}>
                Delegated
              </Text>
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="Home"
        component={PatientHome}
        options={navigation => ({
          title: '',
          tabBarIcon: ({color, focused}) => (
            <View>
              {
                <Image
                  style={styles.imageStyle}
                  source={focused ? images.home : images.homeactive}
                  color={color}
                />
              }
            </View>
          ),
          tabBarLabel: ({focused, color}) => (
            <View style={styles.tabView}>
              <Text style={[commonStyles.Medium125, styles.tabText(focused)]}>
                Home
              </Text>
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="Appointments"
        component={PatientAppointment}
        options={navigation => ({
          title: '',
          tabBarIcon: ({color, focused}) => (
            <View>
              {
                <Image
                  style={styles.imageStyle}
                  source={
                    focused ? images.appointmentsactive : images.appointments
                  }
                  color={color}
                />
              }
            </View>
          ),
          tabBarLabel: ({focused, color}) => (
            <View style={styles.tabView}>
              <Text style={[commonStyles.Medium125, styles.tabText(focused)]}>
                Appointments
              </Text>
            </View>
          ),
        })}
      />
      {/* <Tab.Screen name="Msg" component={PatientMsg} options={navigation => ({
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <View >
                        {
                            <Image style={styles.imageStyle} source={focused
                                ? images.msgactive
                                : images.msg} color={color} />
                        }
                    </View>
                ),
                tabBarLabel: ({ focused, color }) => (
                    <View style={styles.tabView}>
                        <Text style={[commonStyles.Medium125, styles.tabText(focused)]}>MSG</Text>
                    </View>
                )
            })} /> */}
    </Tab.Navigator>
  );
};

const STATE = state => {
  return {
    user: state.user.user,
  };
};
export default connect(STATE)(PatientTabbar);

const styles = StyleSheet.create({
  imageStyle: {
    width: Platform.OS == 'ios' ? 22 : 20,
    height: Platform.OS == 'ios' ? 22 : 20,
    resizeMode: 'contain',
  },
  tabView: {width: '100%', height: '30%', alignItems: 'center'},
  tabText: focused => ({
    color: focused ? COLORS.BLUE : '#98a0ab',
    fontSize: 12,
    marginTop: -6,
  }),
});
