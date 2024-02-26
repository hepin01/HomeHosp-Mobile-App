import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import moment from 'moment';

import ImageLoader from '../../../components/ImageLoader';

import images from '../../../assets/images';
import { COLORS, commonStyles, getCalculated } from '../../../components/Common';
import BottomButtons from './BottomButtons';
import TryAgain from './TryAgain';
import { requestProviderForInstantConsultation } from '../../../networking/APIMethods';
import { displayErrorMsg, getFinalPrice } from '../../../utiles/common';
import { Store } from '../../../../App';
import { SmallButton } from '../../../components/SmallButton';
import PatientRequestCard from './PatientRequestCard';
import { useNavigation } from '@react-navigation/native';

const RequestSentCell = ({
  item,
  onRequestResent,
  // navigation,
  setLoading,
  connectCall,
  makePayment,
  userDetails,
}) => {
  const navigation = useNavigation()
  const {
    _id,
    status,
    sessionType,
    firstname,
    lastname,
    dob,
    intakeId,
    gender,
    providerId,
    profileImageS3Link,
  } = item;
  const genderLetter = gender
    ? item?.miniSurveyForm?.gender == 'male'
      ? 'M'
      : 'F'
    : '';
  // 0: pending,
  // 1: accepted,
  // 2: rejected,
  // 3: in progress,
  // 4: expired,
  // 5: completed
  const isSent = status == 0;
  const isAccepted = status == 1;
  const isRejected = status == 2;
  const isInProcess = status == 3;
  const isExpired = status == 4;
  const isCompleted = status == 5;
  const isUnpaid = status == 6;

  let isIntakeFormFilled = true;

  if (item.hasOwnProperty('intakeId')) {
    isIntakeFormFilled = false;
  }
  const {
    user: {
      user: { userType },
    },
  } = Store.getState();
  function renderStatus() {
    return (
      <Pressable
        disabled={!(isAccepted && isIntakeFormFilled)}
        onPress={() => {
          navigation.navigate('TwilioCall', {
            popCount: 1,
            appointmentData: {
              ...item,
              from: userType,
              appointmentId: _id,
            },
            isInstantConsultation: true,
            item: item,
          });
        }}>
        <Text style={styles.txtReqStatus(isExpired)}>{'Request Status:'}</Text>
        <Text style={styles.txtStatus(status)}>
          {isInProcess ? 'In Process' : null}
          {isRejected ? 'Rejected' : null}
          {isAccepted ? 'Accepted' : null}
          {isSent ? 'Sent' : null}
          {isExpired ? 'Expired' : null}
          {isUnpaid ? 'Payment pending' : null}
          {isCompleted ? 'Completed' : null}
        </Text>
      </Pressable>
    );
  }
  function resendRequest() {
    setLoading(true);
    requestProviderForInstantConsultation(
      providerId,
      response => {
        setLoading(false);
        onRequestResent();
      },
      error => {
        setLoading(false);
        console.log(error);
        displayErrorMsg(error);
      },
    );
  }

  return (
    <PatientRequestCard
      received={false}
      item={item}
      status={status}
      profileImageS3Link={profileImageS3Link}
      sessionType={sessionType}
      firstname={firstname}
      lastname={lastname}
      intakeId={intakeId}
      genderLetter={genderLetter}
      dob={dob}
      onToggle={(val) => onToggle(val)}
      onLoading={(bool) => onToggle(bool)}
      connectCall={() => connectCall()}
      makePayment={() => makePayment()}
      resendRequest={() => resendRequest()}
      onRequestResent={() => onRequestResent()}
      isIntakeFormFilled={isIntakeFormFilled}
      onPress={() => {
        navigation.navigate('TwilioCall', {
          popCount: 1,
          appointmentData: {
            ...item,
            from: userType,
            appointmentId: _id,
          },
          isInstantConsultation: true,
          item: item,
        });
      }}
    />
    // <View style={{ width: '100%', alignSelf: 'center' }}>
    //   <View
    //     style={[
    //       styles.shadow,
    //       styles.card(isExpired),
    //       { alignSelf: 'center', marginVertical: 7 },
    //     ]}>
    //     <View style={styles.patientMainView}>
    //       <ImageLoader
    //         style={styles.userImage}
    //         url={{ uri: profileImageS3Link }}
    //         placeholder={images.userdefault}
    //       />
    //       <View style={[styles.patientDetailsView]}>
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             width: Dimensions.get('screen').width * 0.55,
    //           }}>
    //           <Text
    //             style={
    //               isExpired ? commonStyles.Light18 : commonStyles.Medium18
    //             }>
    //             {'Dr. ' + firstname + ' ' + lastname + ', '}
    //             <Text
    //               style={
    //                 isExpired
    //                   ? commonStyles.RegularLight115
    //                   : commonStyles.Regular115Blue
    //               }>
    //               {dob
    //                 ? genderLetter + '(' + moment().diff(dob, 'years') + ')'
    //                 : ''}
    //             </Text>
    //           </Text>
    //         </View>

    //         <View style={{ width: Platform.OS == 'ios' ? '80%' : '55%' }}></View>
    //         {renderStatus()}
    //         {isExpired ? (
    //           <TryAgain onPressTryAgain={() => resendRequest()} />
    //         ) : null}
    //       </View>
    //       {sessionType == 'telephonic' && (
    //         <View style={styles.audioIconBg}>
    //           <Image style={styles.audioIcon} source={images.audio} />
    //         </View>
    //       )}
    //       {sessionType == 'video' && (
    //         <View style={styles.audioIconBg}>
    //           <Image style={styles.audioIcon} source={images.video} />
    //         </View>
    //       )}
    //     </View>
    //     {/* {isAccepted && isIntakeFormFilled ? (
    //       <BottomButtons data={item} />
    //     ) : null} */}

    //     {isAccepted && !intakeId ? (
    //       <BottomButtons data={item} onStatusChange={() => onRequestResent()} />
    //     ) : null}
    //     {intakeId && isAccepted && (
    //       <SmallButton
    //         buttonTitle={'Connect'}
    //         whiteBg={false}
    //         buttonAction={() => connectCall()}
    //         style={styles.connectBtn}
    //       />
    //     )}

    //     {isUnpaid && (
    //       <SmallButton
    //         buttonTitle={'Pay $' + item?.price}
    //         whiteBg={false}
    //         buttonAction={() => makePayment()}
    //         style={styles.connectBtn}
    //       />
    //     )}
    //   </View>
    // </View>
  );
};

export default React.memo(RequestSentCell);

const styles = StyleSheet.create({
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
  patientDetailsView: { marginHorizontal: 10, width: '100%' },
  instantIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: -2,
    marginLeft: 10,
  },
  audioIcon: { width: 15, height: 15, resizeMode: 'contain' },
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
  card: status => ({
    ...commonStyles.shadowCard,
    backgroundColor: status ? '#e6e6e6' : COLORS.WHITE,
  }),
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
    // 0: pending,
    // 1: accepted,
    // 2: rejected,
    // 3: in progress,
    // 4: expired,
    // 5: completed
    ...commonStyles.RegularLight11,
    marginTop: 6,
    color:
      status == 3
        ? COLORS.Orange
        : status == 2 || status == 4
          ? COLORS.RED
          : status == 1
            ? COLORS.GREEN
            : status == 0
              ? COLORS.BLUE
              : COLORS.LIGHTER_GREY,
  }),
  txtReqStatus: isExpired => {
    const obj = isExpired
      ? commonStyles.RegularLight11
      : commonStyles.RegularDark11;
    return {
      marginTop: 8,
      ...obj,
    };
  },
  connectBtn: { width: '50%', alignSelf: 'flex-end' },
});
