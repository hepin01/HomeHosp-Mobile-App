import {Alert, StyleSheet, View} from 'react-native';
import React from 'react';
import {SmallButton} from '../../../components/SmallButton';
import {COLORS, commonStyles, getCalculated} from '../../../components/Common';
import {isProvider} from '../../../utiles/common';
import {approveRejectInstantConsultation} from '../../../networking/APIMethods';
import {useNavigation} from '@react-navigation/native';

const BottomButtons = ({data, onStatusChange}) => {
  const navigation = useNavigation();
  function cancelRequest() {
    // status - 1 for accept, 2 for reject
    const userType = isProvider() ? 'provider' : 'patient';
    const payload = {
      appointmentId: data._id,
      status: 2,
      from: userType,
    };
  approveRejectInstantConsultation(
      payload,
      response => {
        Alert.alert('Success', 'Request cancelled successfully.', [
          {
            text: 'OK',
            onPress: () => onStatusChange(""),
          },
        ]);
      },
      error => {
        onStatusChange(error);
      },
    );
  }

  return (
    <View>
      {/* <View style={styles.line} /> */}
      <View style={styles.btnCont}>
        <SmallButton
          buttonTitle={'Complete Details'}
          style={{marginRight: getCalculated(13)}}
          buttonTextStyle={styles.btnText}
          buttonAction={() =>
            navigation.navigate('IntakeForm', {
              appointmentId: data._id,
              isFromInstantConsultion: true,
            })
          }
        />
        <SmallButton
          buttonTitle={'Cancel Request'}
          whiteBg={true}
          buttonAction={() => cancelRequest()}
          buttonTextStyle={styles.btnTextCancel}
        />
      </View>
    </View>
  );
};

export default BottomButtons;

const styles = StyleSheet.create({
  line: {
    height: 2,
    width: '100%',
    backgroundColor: '#ebf4f8',
    marginTop: getCalculated(11),
    marginBottom: getCalculated(8),
  },
  btnCont: {
    flexDirection: 'row',
  },
  btnText: {
    ...commonStyles.Medium11White,
  },
  btnTextCancel: {
    ...commonStyles.Medium11White,
    color: COLORS.BLUE,
  },
});
