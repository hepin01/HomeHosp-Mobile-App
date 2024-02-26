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

import MinCounter from './MinCounter';
import ImageLoader from '../../components/ImageLoader';

import images from '../../assets/images';
import { COLORS, commonStyles, getCalculated } from '../../components/Common';
import { SmallButton } from '../../components/SmallButton';
import RequestCard from './RequestCard';

const RequestRecCell = ({ item, onToggle, completeAppointment, onLoading }) => {
  const {
    _id,
    status,
    sessionType,
    startDate,
    _id: _pid,
    firstname,
    lastname,
    profileImageS3Link,
    paymentStatus,
  } = item;
  const genderLetter = item?.patient?.miniSurveyForm?.gender
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
  const isInProcess = status == 3;
  const isAccepted = status == 1;
  const isRejected = status == 2;
  const isExpired = status == 4;
  const isCompleted = status == 5;
  const isUnpaid = status == 6;
  const paymentSuccessFull = paymentStatus == 'succeeded'
  let isIntakeFormFilled = true;

  if (item.hasOwnProperty('intakeId')) {
    isIntakeFormFilled = false;
  }

  function handleCardPressed(element) {
    console.log(element);
  }
  function renderStatus() {
    if (status == 0) {
      return (
        <MinCounter
          data={item}
          onStatusChange={status => onToggle(status)}
          setLoading={bool => onLoading(bool)}
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
            {isAccepted ? 'Accepted' : null}
            {isRejected ? 'Rejected' : null}
            {isExpired ? 'Expired' : null}
            {isUnpaid ? 'Patient hasn\'t paid yet' : null}
            {paymentSuccessFull ? 'Completed' : null}
          </Text>
        </View>
      );
    }
  }
  return (
    <>
      <RequestCard
        received={true}
        item={item}
        status={status}
        profileImageS3Link={profileImageS3Link}
        sessionType={sessionType}
        startDate={startDate}
        firstname={firstname}
        lastname={lastname}
        genderLetter={genderLetter}
        paymentSuccessFull={paymentSuccessFull}
        paymentStatus={paymentStatus}
        completeAppointment={() => completeAppointment()}
        onToggle={(val) => onToggle(val)}
        onLoading={(bool) => onToggle(bool)}
        isIntakeFormFilled={isIntakeFormFilled} />
    </>
    // <Pressable
    //   disabled={!(isIntakeFormFilled && isAccepted)}
    //   style={{ width: '100%', alignSelf: 'center' }}
    //   onPress={() => handleCardPressed(item)}>
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
    //             {(item?.patient?.miniSurveyForm?.salutation
    //               ? item?.patient?.miniSurveyForm?.salutation
    //               : '') +
    //               firstname +
    //               ' ' +
    //               lastname +
    //               ', '}
    //             <Text
    //               style={
    //                 isExpired
    //                   ? commonStyles.RegularLight115
    //                   : commonStyles.Regular115Blue
    //               }>
    //               {item?.patient?.miniSurveyForm?.dob
    //                 ? genderLetter +
    //                 '(' +
    //                 moment().diff(
    //                   item?.patient?.miniSurveyForm?.dob,
    //                   'years',
    //                 ) +
    //                 ')'
    //                 : ''}
    //             </Text>
    //           </Text>
    //         </View>

    //         <View style={{ width: Platform.OS == 'ios' ? '80%' : '55%' }}></View>
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
    //     {isAccepted && isIntakeFormFilled ? (
    //       <View>
    //         <View style={styles.line} />
    //         <View style={styles.note}>
    //           <Image style={styles.info} source={images.info} />
    //           <Text style={styles.txtNote}>
    //             Waiting for patient to complete their details
    //           </Text>
    //         </View>
    //       </View>
    //     ) : null}
    //     {isCompleted && paymentStatus !== 'succeeded' && (
    //       <SmallButton
    //         buttonTitle={'Complete Appointment'}
    //         whiteBg={false}
    //         buttonAction={() => completeAppointment()}
    //         style={styles.connectBtn}
    //       />
    //     )}
    //     {/* {isUnpaid && (
    //       <Text style={[commonStyles.Regular11Red, {alignSelf: 'flex-end'}]}>
    //         Patient hasn't paid yet
    //       </Text>
    //     )} */}
    //   </View>
    // </Pressable>
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
    // 6: unpaid
    ...commonStyles.RegularLight11,
    marginTop: 6,
    color:
      status == 3
        ? COLORS.Orange
        : status == 2 || status == 6
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
  connectBtn: { width: '50%', alignSelf: 'flex-end' },
});