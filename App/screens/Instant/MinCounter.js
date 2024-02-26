import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import images from '../../assets/images';
import { COLORS, commonStyles, getCalculated } from '../../components/Common';
import { approveRejectInstantConsultation } from '../../networking/APIMethods';
import { isProvider } from '../../utiles/common';
import moment from 'moment';

const MinCounter = ({ data, onStatusChange, setLoading }) => {
  const [counter, setCounter] = useState(15);
  var interval = null;
  useEffect(() => {
    const startTime = moment(data?.startDate).add(15, 'minute');
    const graceMin = moment.utc(startTime).diff(moment(), 'minutes');
    if (graceMin > 0) {
      setCounter(moment.utc(startTime).diff(moment(), 'minutes'));
      interval = setInterval(() => {
        if (parseInt(counter) > 0) {
          setCounter(oldCount => oldCount - 1);
        } else {
          setCounter(0);
          if (interval) clearInterval(interval);
        }
      }, 60000);
    } else {
      setCounter(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  function toggleInstantConsultation(status) {
    // status - 1 for accept, 2 for reject
    if (counter > 0) {
      setLoading(true);
      const userType = isProvider() ? 'provider' : 'patient';
      const payload = {
        appointmentId: data._id,
        status: status,
        from: userType,
      };

      const state = status == 1 ? 'accepted' : 'rejected';
      approveRejectInstantConsultation(
        payload,
        response => {
          setLoading(false);
          Alert.alert('Success', 'Request ' + state + ' successfully.', [
            {
              text: 'Ok',
              onPress: () => onStatusChange(),
            },
          ]);
        },
        error => {
          setLoading(false);
          onStatusChange(error);
        },
      );
    } else {
      Alert.alert('Oops!', 'This request is now expired.');
    }
  }

  return (
    <View>
      <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
        <Text style={styles.txtActiveTill}>{'Request active till:'}</Text>
        <View style={styles.btnContainer}>
          <Image source={images.hourglassIcon} style={styles.hour} />
          <Text style={styles.txtTime}>{counter} min</Text>
        </View>
      </View>
      <View style={styles.bottomSubContainer}>
        <Pressable onPress={() => toggleInstantConsultation(1)}>
          <Image style={styles.imgBottomButton} source={images.approveicon} />
        </Pressable>
        <Pressable
          style={{ marginLeft: getCalculated(10) }}
          onPress={() => toggleInstantConsultation(2)}>
          <Image style={styles.imgBottomButton} source={images.declinedapp} />
        </Pressable>
      </View>
    </View>
  );
};

export default MinCounter;

const styles = StyleSheet.create({
  hour: {
    width: getCalculated(8),
    height: getCalculated(11),
    marginLeft: getCalculated(5),
  },
  txtActiveTill: {
    // marginTop: 8,
    ...commonStyles.RegularDark11,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: getCalculated(5),
    marginBottom: getCalculated(11),
  },
  txtTime: {
    ...commonStyles.Bold135,
    marginLeft: getCalculated(8),
  },
  bottomSubContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BLURBG,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },
  imgBottomButton: {
    width: getCalculated(20),
    height: getCalculated(20),
    // marginHorizontal: getCalculated(15)
  },
});
