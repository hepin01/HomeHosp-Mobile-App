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
import Base from '../Base/Base';

class PatientNotification extends Base {
  constructor(props) {
    super(props);
    this.state = {
      arrItems: [],
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
    let nowNotis = [];
    let earlierNotis = [];
    this.state.arrItems.map((item, index) => {
      var duration = moment.duration(moment().diff(item?.time));
      var hours = duration.asHours();
      if (hours <= 48) {
        nowNotis = [...nowNotis, item];
      } else {
        earlierNotis = [...earlierNotis, item];
      }
    });
    this.setState({arrNow: nowNotis, arrEarlier: earlierNotis});
  }

  itemClicked(item, index) {}
  render() {
    const {arrNow, arrEarlier} = this.state;
    return (
      <View style={commonStyles.container}>
        {arrNow.length != 0 || arrEarlier.length != 0 ? (
          <ScrollView
            style={{width: '100%'}}
            contentContainerStyle={{width: '100%', alignItems: 'center'}}
            showsVerticalScrollIndicator={false}>
            <Text style={[commonStyles.Bold15, styles.stepText]}>New</Text>
            <View style={[commonStyles.shadow, styles.shadowCard]}>
              {arrNow.map((item, index) => {
                var time = '';
                if (moment().diff(item?.time, 'hours') < 24) {
                  time = (item?.time).fromNow();
                } else {
                  time =
                    (item?.time).calendar().split(' ')[0] +
                    ',  ' +
                    (item?.time).format('HH:MM A');
                }
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.itemClicked(item, index)}>
                    <View style={styles.cellContainer}>
                      <Text style={commonStyles.Medium135}>{item?.title}</Text>
                      <Text style={[commonStyles.Regular12, styles.timeStyle]}>
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

            <Text style={[commonStyles.Bold15, styles.stepText]}>Earlier</Text>
            <View style={[commonStyles.shadow, styles.shadowCard]}>
              {arrEarlier.map((item, index) => {
                const time = (item?.time).format('MMM DD, YYYY  HH:MM A');
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.itemClicked(item, index)}>
                    <View style={styles.cellContainer}>
                      <Text style={commonStyles.Medium135}>{item?.title}</Text>
                      <Text style={[commonStyles.Regular12, styles.timeStyle]}>
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

export default PatientNotification;

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
