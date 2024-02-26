/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import moment from 'moment';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {commonStyles} from '../../components/Common';
import {
  getNotifications,
  setAllNotificationsToRead,
} from '../../networking/APIMethods';
import Base from '../Base/Base';

class ProviderNotification extends Base {
  constructor(props) {
    super(props);
    this.state = {
      arrNow: [],
      arrEarlier: [],
    };
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      PushNotification.getApplicationIconBadgeNumber(number => {
        if (number > 0) {
          PushNotification.setApplicationIconBadgeNumber(0);
        }
      });
    }
    this.showLoader();
    getNotifications(
      response => {
        this.dismissLoader();
        if (response?.length) {
          let newNot = [];
          let earlierNot = [];
          response.forEach(element => {
            if (element.read) {
              earlierNot.push(element);
            } else {
              newNot.push(element);
            }
          });
          this.setState({arrNow: newNot, arrEarlier: earlierNot}, () => {
            setAllNotificationsToRead(
              response => {},
              err => console.log(err),
            );
          });
        }
      },
      err => {
        this.dismissLoader();
        console.log(err);
      },
    );
  }

  itemClicked(item, index) {}
  render() {
    const {arrNow, arrEarlier} = this.state;
    return (
      <View style={commonStyles.container}>
        {this.progressLoader()}
        {arrNow.length != 0 || arrEarlier.length != 0 ? (
          <ScrollView
            style={{width: '100%'}}
            contentContainerStyle={{width: '100%', alignItems: 'center'}}
            showsVerticalScrollIndicator={false}>
            {arrNow.length ? (
              <>
                <Text style={[commonStyles.Bold15, styles.stepText]}>New</Text>
                <View style={[commonStyles.shadow, styles.shadowCard]}>
                  {arrNow.map((item, index) => {
                    var time = '';
                    if (moment().diff(moment(item?.time), 'hours') < 24) {
                      time = moment(item?.time).fromNow();
                    } else {
                      time =
                        moment(item?.time).calendar().split(' ')[0] +
                        ',  ' +
                        moment(item?.time).format('HH:MM A');
                    }
                    return (
                      <TouchableOpacity
                        key={item._id}
                        activeOpacity={0.8}
                        onPress={() => this.itemClicked(item, index)}>
                        <View style={styles.cellContainer}>
                          <Text style={commonStyles.Medium135}>
                            {item?.message}
                          </Text>
                          <Text
                            style={[commonStyles.Regular12, styles.timeStyle]}>
                            {time}
                          </Text>
                        </View>
                        {arrNow.length - index > 1 && (
                          <View style={commonStyles.line} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : null}
            {arrEarlier.length ? (
              <>
                <Text style={[commonStyles.Bold15, styles.stepText]}>
                  Earlier
                </Text>
                <View style={[commonStyles.shadow, styles.shadowCard]}>
                  {arrEarlier.map((item, index) => {
                    const time = moment(item?.time).format(
                      'MMM DD, YYYY  HH:MM A',
                    );
                    return (
                      <TouchableOpacity
                        key={item._id}
                        activeOpacity={0.8}
                        onPress={() => this.itemClicked(item, index)}>
                        <View style={styles.cellContainer}>
                          <Text style={commonStyles.Medium135}>
                            {item?.message}
                          </Text>
                          <Text
                            style={[commonStyles.Regular12, styles.timeStyle]}>
                            {time}
                          </Text>
                        </View>
                        {arrEarlier.length - index > 1 && (
                          <View style={commonStyles.line} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : null}
          </ScrollView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={commonStyles.Medium16}>No notification available</Text>
          </View>
        )}
      </View>
    );
  }
}

export default ProviderNotification;

const styles = StyleSheet.create({
  stepText: {
    marginTop: 15,
    marginHorizontal: 20,
    alignSelf: 'flex-start',
  },
  shadowCard: {
    width: '90%',
    backgroundColor: 'white',
    marginVertical: 15,
    padding: 15,
    borderRadius: 6,
  },
  timeStyle: {
    marginVertical: 5,
  },
});
