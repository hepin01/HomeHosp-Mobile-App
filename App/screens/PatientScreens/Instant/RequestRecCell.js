import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import moment from 'moment';

import ImageLoader from '../../../components/ImageLoader';

import images from '../../../assets/images';
import { COLORS, commonStyles, getCalculated } from '../../../components/Common';
import MinCounter from '../../Instant/MinCounter';
import BottomButtons from './BottomButtons';
import TryAgain from './TryAgain';
import { SmallButton } from '../../../components/SmallButton';
import { getFinalPrice } from '../../../utiles/common';
import PatientRequestCard from './PatientRequestCard';

const RequestRecCell = ({
  item,
  onToggle,
  connectCall,
  makePayment,
  setLoading,
  userDetails,
}) => {
  const {
    _id,
    status,
    sessionType,
    startDate,
    _id: _pid,
    firstname,
    lastname,
    dob,
    intakeId,
    gender,
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
  const isInProcess = status == 0;
  const isAccepted = status == 1;
  const isRejected = status == 2;
  const inProgress = status == 3;
  const isExpired = status == 4;
  const isCompleted = status == 5;
  const isUnpaid = status == 6;

  function renderStatus() {
    if (status == 0) {
      return (
        <MinCounter
          data={item}
          onStatusChange={status => onToggle(status)}
          setLoading={bool => setLoading(bool)}
          onToggle={status => console.log(status)}
        />
      );
    } else {
      return (
        <View>
          <Text style={styles.txtReqStatus(isExpired)}>
            {'Request Status:'}
          </Text>
          <Text style={styles.txtStatus(status)}>
            {isInProcess ? 'In Process' : null}
            {isRejected ? 'Rejected' : null}
            {inProgress ? 'In Progress' : null}
            {isExpired ? 'Expired' : null}
            {isAccepted ? 'Accepted' : null}
            {isUnpaid ? 'Payment pending' : null}
            {isCompleted ? 'Completed' : null}
          </Text>
        </View>
      );
    }
  }

  return (
    <PatientRequestCard
      received={true}
      item={item}
      status={status}
      profileImageS3Link={profileImageS3Link}
      sessionType={sessionType}
      startDate={startDate}
      firstname={firstname}
      lastname={lastname}
      intakeId={intakeId}
      genderLetter={genderLetter}
      dob={dob}
      onToggle={(val) => onToggle(val)}
      onLoading={(bool) => onToggle(bool)}
      connectCall={() => connectCall()}
      makePayment={() => makePayment()}
    />
    // <View style={{width: '100%', alignSelf: 'center'}}>
    //   <View
    //     style={[
    //       styles.shadow,
    //       styles.card(isExpired),
    //       {alignSelf: 'center', marginVertical: 7},
    //     ]}>
    //     <View style={styles.patientMainView}>
    //       <ImageLoader
    //         style={styles.userImage}
    //         url={{uri: profileImageS3Link}}
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

    //         <View style={{width: Platform.OS == 'ios' ? '80%' : '55%'}}></View>
    //         {renderStatus()}
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
    //     {isAccepted && !intakeId ? (
    //       <BottomButtons
    //         data={item}
    //         onStatusChange={status => onToggle(status)}
    //       />
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

export default React.memo(RequestRecCell);

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
        ? COLORS.GREEN
        : status == 2
          ? COLORS.RED
          : status == 1
            ? COLORS.GREEN
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
  btnCont: {
    flexDirection: 'row',
  },
  connectBtn: { width: '50%', alignSelf: 'flex-end' },
});
