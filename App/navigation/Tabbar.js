import React from 'react';
import {Platform, Image, View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import images from '../assets/images';
import {commonStyles, COLORS} from '../components/Common';
import Menu from '../screens/Menu/Menu';
import Instant from '../screens/Instant/Instant';
import Home from '../screens/Home/Home';
import Appointments from '../screens/Appointments/Appointments';
import Msg from '../screens/MSG/Msg';
import BookNew from '../screens/PatientScreens/BookNew';
import {connect} from 'react-redux';
import {Store} from '../../App';

const Tab = createBottomTabNavigator();

const Tabbar = () => {
  const user = Store.getState().user.user;
  console.log(user);
  return (
    <Tab.Navigator
      screenOptions={({route, focused}) => ({
        headerShown: false,
      })}
      initialRouteName={'Home'}>
      {/* <Tab.Screen name="Menu" component={Menu} options={navigation => ({
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <View style={{}}>
                        {
                            <Image style={{
                                width: Platform.OS == 'ios' ? 22 : 20, height: Platform.OS == 'ios' ? 22 : 20, resizeMode: 'contain'
                            }} source={focused
                                ? images.menuactive
                                : images.menu} color={color} />
                        }
                    </View>
                ),
                tabBarLabel: ({ focused, color }) => (
                    <View style={{ width: '100%', height: '30%', alignItems: 'center' }}>
                        <Text style={[commonStyles.Medium125, { color: focused ? COLORS.BLUE : '#98a0ab', fontSize: 12, marginTop: -6 }]}>Menu</Text>
                    </View>
                )
            })} /> */}

      <Tab.Screen
        name="Instant"
        component={Instant}
        options={navigation => ({
          title: '',
          headerTitle: props => (
            <Text style={commonStyles.Bold17White}>Instant Consultation</Text>
          ),
          tabBarIcon: ({color, focused}) => (
            <View style={{}}>
              {
                <Image
                  style={{
                    width: Platform.OS == 'ios' ? 22 : 20,
                    height: Platform.OS == 'ios' ? 22 : 20,
                    resizeMode: 'contain',
                  }}
                  source={focused ? images.instantactive : images.instant}
                  color={color}
                />
              }
            </View>
          ),
          tabBarLabel: ({focused, color}) => (
            <View style={{width: '100%', height: '30%', alignItems: 'center'}}>
              <Text
                style={[
                  commonStyles.Medium125,
                  {
                    color: focused ? COLORS.BLUE : '#98a0ab',
                    fontSize: 12,
                    marginTop: -6,
                  },
                ]}>
                Instant
              </Text>
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={navigation => ({
          title: '',
          tabBarIcon: ({color, focused}) => (
            <View style={{}}>
              {
                <Image
                  style={{
                    width: Platform.OS == 'ios' ? 22 : 20,
                    height: Platform.OS == 'ios' ? 22 : 20,
                    resizeMode: 'contain',
                  }}
                  source={focused ? images.home : images.homeactive}
                  color={color}
                />
              }
            </View>
          ),
          tabBarLabel: ({focused, color}) => (
            <View style={{width: '100%', height: '30%', alignItems: 'center'}}>
              <Text
                style={[
                  commonStyles.Medium125,
                  {
                    color: focused ? COLORS.BLUE : '#98a0ab',
                    fontSize: 12,
                    marginTop: -6,
                  },
                ]}>
                Home
              </Text>
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="Appointments"
        component={Appointments}
        options={navigation => ({
          title: '',
          tabBarIcon: ({color, focused}) => (
            <View style={{}}>
              {
                <Image
                  style={{
                    width: Platform.OS == 'ios' ? 22 : 20,
                    height: Platform.OS == 'ios' ? 22 : 20,
                    resizeMode: 'contain',
                  }}
                  source={
                    focused ? images.appointmentsactive : images.appointments
                  }
                  color={color}
                />
              }
            </View>
          ),
          tabBarLabel: ({focused, color}) => (
            <View style={{width: '100%', height: '30%', alignItems: 'center'}}>
              <Text
                style={[
                  commonStyles.Medium125,
                  {
                    color: focused ? COLORS.BLUE : '#98a0ab',
                    fontSize: 12,
                    marginTop: -6,
                  },
                ]}>
                Appointments
              </Text>
            </View>
          ),
        })}
      />
      {/* <Tab.Screen name="Msg" component={Msg} options={navigation => ({
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <View style={{}}>
                        {
                            <Image style={{
                                width: Platform.OS == 'ios' ? 22 : 20, height: Platform.OS == 'ios' ? 22 : 20, resizeMode: 'contain'
                            }} source={focused
                                ? images.msgactive
                                : images.msg} color={color} />
                        }
                    </View>
                ),
                tabBarLabel: ({ focused, color }) => (
                    <View style={{ width: '100%', height: '30%', alignItems: 'center' }}>
                        <Text style={[commonStyles.Medium125, { color: focused ? COLORS.BLUE : '#98a0ab', fontSize: 12, marginTop: -6 }]}>MSG</Text>
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
export default connect(STATE)(Tabbar);
