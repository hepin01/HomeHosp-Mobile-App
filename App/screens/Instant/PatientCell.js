import {Text, View, Dimensions, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import moment from 'moment';

import ImageLoader from '../../components/ImageLoader';

import images from '../../assets/images';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import {ButtonComponent} from '../../components/ButtonComponent';

const PatientCell = ({
  item,
  onItemPressed,
  showWaitingView,
  onConnectPressed,
  onIntakePressed,
}) => {
  const {_id: _pid, firstname, lastname, profileImageS3Link} = item;
  const genderLetter = item?.gender
    ? item?.miniSurveyForm?.gender == 'male'
      ? 'M'
      : 'F'
    : '';

  return (
    <Pressable style={styles.container} onPress={() => onItemPressed()}>
      <View
        style={[
          commonStyles.shadow,
          styles.card,
          {alignSelf: 'center', marginVertical: 7},
        ]}>
        <View style={styles.patientMainView}>
          <ImageLoader
            style={styles.userImage}
            url={{uri: profileImageS3Link}}
            placeholder={images.userdefault}
          />
          <View style={[styles.patientDetailsView]}>
            <View
              style={{
                flexDirection: 'row',
                width: Dimensions.get('screen').width * 0.55,
              }}>
              <Text style={commonStyles.Medium18}>
                {(item?.salutation ? item?.salutation : '') +
                  firstname +
                  ' ' +
                  lastname +
                  ', '}
                <Text style={commonStyles.Regular115Blue}>
                  {item?.dob
                    ? genderLetter +
                      '(' +
                      moment().diff(item?.dob, 'years') +
                      ')'
                    : ''}
                </Text>
              </Text>
            </View>
            {showWaitingView && (
              <View
                style={{
                  flexDirection: 'row',
                  width: Dimensions.get('screen').width * 0.55,
                }}>
                <ButtonComponent
                  style={{marginTop: 20, marginHorizontal: 5, height: 35}}
                  buttonStyle={{
                    fontSize: getCalculated(13),
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                  buttonTitle={'Intake Form'}
                  buttonAction={() => {
                    onIntakePressed();
                  }}
                />

                <ButtonComponent
                  style={{marginTop: 20, marginHorizontal: 5, height: 35}}
                  buttonStyle={{
                    fontSize: getCalculated(13),
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                  buttonTitle={'Connect'}
                  buttonAction={() => {
                    onConnectPressed();
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default React.memo(PatientCell);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  patientMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  userImage: {
    width: getCalculated(57),
    height: getCalculated(57),
    resizeMode: 'contain',
    borderRadius: 6,
  },
  patientDetailsView: {
    width: '100%',
    marginHorizontal: 10,
  },
  instantIcon: {
    width: 15,
    height: 15,
    marginTop: -2,
    marginLeft: 10,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  audioIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  audioIconBg: {
    padding: 10,
    position: 'absolute',
    bottom: 5,
    right: 10,
    // backgroundColor: COLORS.LIGHT_BLUE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: COLORS.LIGHTER_GREY,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7.65,

    elevation: 4,
  },
  card: {
    ...commonStyles.shadowCard,
  },
  line: {
    height: 2,
    width: '100%',
    backgroundColor: '#ebf4f8',
    marginTop: getCalculated(11),
    marginBottom: getCalculated(8),
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    width: getCalculated(18),
    height: getCalculated(18),
  },
  txtNote: {
    ...commonStyles.RegularLight11,
    width: '90%',
    alignSelf: 'center',
    marginLeft: getCalculated(6),
  },
  txtStatus: status => ({
    ...commonStyles.RegularLight11,
    marginTop: 6,
    color:
      status == 1
        ? COLORS.Orange
        : status == 2
        ? COLORS.RED
        : status == 3
        ? COLORS.GREEN
        : status == 0
        ? COLORS.BLUE
        : COLORS.LIGHTER_GREY,
  }),
  txtReqStatus: {
    marginTop: 8,
  },
});
