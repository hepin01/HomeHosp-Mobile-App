import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  PermissionsAndroid,
  BackHandler,
  Alert,
  Image,
} from 'react-native';
import uuid from 'react-native-uuid';
import {connect} from 'react-redux';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import {
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';
import {useDispatch} from 'react-redux';
import {Store} from '../../../App';
import images from '../../assets/images';
import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import {GiftedChat} from '../../components/react-native-gifted-chat/lib';
import {
  completeInstantConstAppointment,
  getTwilioToken,
  onUserJoined,
  onProviderJoined,
  onUserLeaveAppointment,
  onProviderLeaveAppointment,
  completeAppointment,
} from '../../networking/APIMethods';
import {UPDATE_ARR_MESSAGES, UPDATE_MESSAGE} from '../../redux/TwilioReducer';
import {
  displayErrorMsg,
  getCurrentTimezone,
  isProvider,
  userId,
} from '../../utiles/common';
import CallOptions from './CallOptions';
import {BillingCode} from '../Instant/BiilingCode';
import moment from 'moment';
import NavBarButtonComponent from '../../components/NavBarButtonComponent';
const {height, width} = Dimensions.get('window');
const TwilioCall = ({
  user,
  navigation,
  route: {
    params: {
      popCount = 1,
      appointmentData,
      appointmentData: {from, appointmentId},
      isInstantConsultation: isInstantConsultation = false,
      item: item,
    },
  },
  message = '',
  arrMessage = [],
}) => {
  var timer = null;
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState('disconnected');
  const [dataTracks, setDataTracks] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const twilioVideo = useRef(null);
  const [showCompleteAppointment, setShowCompleteAppointment] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(true);
  const {
    user: {
      user: {firstname, lastname, userType},
    },
  } = Store.getState();
  const username = firstname + ' ' + lastname;
  const connectOptions = {
    dominantSpeakerEnabled: true,
    enableNetworkQualityReporting: true,
  };

  useEffect(() => {
    if (message.trim().length) {
      _onSendMessage(message);
    }
    navigation.setOptions({
      headerLeft: props => (
        <NavBarButtonComponent
          showLogo={false}
          buttonImage={images.back}
          onPress={() => {
            if (status == 'connected') {
              Alert.alert(
                'Confirm',
                'Are you sure you want to leave the call?',
                [
                  {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => {
                      _onEndButtonPress();
                    },
                  },
                  {
                    text: 'No',
                  },
                ],
              );
            } else {
              navigation.pop(popCount);
            }
          }}
        />
      ),
    });
    _activate();
    fetchTwilioToken();
    return () => {
      if (status == 'connected') {
        _onEndButtonPress();
      }
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (status == 'connected') {
        _onEndButtonPress();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (appointmentData.hasOwnProperty('callDuration')) {
      const callDur = !!appointmentData.callDuration
        ? appointmentData?.callDuration
        : 0;
      let min = moment.utc(callDur * 1000).format('mm');
      let sec = moment.utc(callDur * 1000).format('ss');
      const regex = /0[0-9]/;
      if (regex.test(min)) {
        setMinutes(parseInt(min[1]));
      } else {
        setMinutes(parseInt(min));
      }
      if (regex.test(sec)) {
        setSeconds(parseInt(sec[1]));
      } else {
        setSeconds(parseInt(sec));
      }
    }
  }, [appointmentData]);

  useEffect(() => {
    if (seconds == 59) {
      setMinutes(min => min + 1);
      setSeconds(0);
    }
  }, [seconds]);

  useEffect(() => {
    if (status == 'connected') {
      updateUserJoined();
      timer = setInterval(() => {
        setSeconds(oldSec => oldSec + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (videoTracks.size) {
      const temp = videoTracks.keys();
      const key = temp.next().value;
      setSelectedVideo({trackSid: key, trackIdentifier: videoTracks.get(key)});
    }
  }, [videoTracks]);

  function updateUserJoined() {
    const payload = {
      appointmentId: appointmentData?.appointmentId,
      app: appointmentData?.appointmentData,
      isInstantConsultation: from == 'myapp' ? false : true,
    };
    if (isProvider()) {
      payload.isFirstTime =
        appointmentData?.appointmentData?.doctorJoiningTime &&
        appointmentData?.appointmentData?.doctorJoiningTime.length > 0
          ? false
          : true;
      onProviderJoined(
        payload,
        response => {},
        error => {},
      );
    } else {
      payload.isFirstTime =
        appointmentData?.appointmentData?.patientJoiningTime &&
        appointmentData?.appointmentData?.patientJoiningTime.length > 0
          ? false
          : true;
      onUserJoined(
        payload,
        response => {},
        error => {},
      );
    }
  }

  function _activate() {
    activateKeepAwake();
  }

  function _deactivate() {
    deactivateKeepAwake();
  }

  function clearMessages() {
    Store.dispatch({
      type: UPDATE_ARR_MESSAGES,
      payload: [],
    });
    Store.dispatch({
      type: UPDATE_MESSAGE,
      payload: '',
    });
  }
  function fetchTwilioToken() {
    const payload = {
      name: {
        fName: username,
        userId: userId(),
        userType: from == 'myapp' ? userType : from,
      },
    };

    getTwilioToken(
      payload,
      async ({data}) => {
        await connectCall(data);
      },
      error => {
        displayErrorMsg(error);
      },
    );
  }

  const connectCall = async token => {
    if (Platform.OS === 'android') {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    twilioVideo.current.connect({
      accessToken: token?.toString(),
      connectOptions,
      roomName: appointmentId?.toString(),
    });
    setStatus('connecting');
  };

  const _onEndButtonPress = () => {
    twilioVideo?.current?.disconnect();
    if (timer) clearInterval(timer);
    _deactivate();
    clearMessages();
    console.log('_onEndButtonPress', isInstantConsultation);
    if (isProvider()) {
      providerleaveCall();
    } else {
      onUserLeaveTheAppointment();
    }
  };

  const _onMuteButtonPress = () => {
    twilioVideo.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onChatButtonPress = () => {
    navigation.navigate('TwilioChat', {
      username: username,
      sendMessage: message => _onSendMessage(message),
    });
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({error}) => {
    console.log('ERROR: ', error);
    // navigation.pop(isProvider() ? 2 : 1);
    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    console.log('ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({participant, track}) => {
    const newVideoTracks = new Map(videoTracks);
    newVideoTracks.delete(track.trackSid);
    setVideoTracks(newVideoTracks);
    const {fName, userId} = JSON.parse(participant.identity);
    setShowWaitMessage(false);
    // if (userId != user._id) Alert.alert(fName + ' left the call.');
  };

  const _onParticipantRemovedDataTrack = ({participant, track}) => {
    console.log('onParticipantRemovedDataTrack', participant, track);
    const obj = JSON.parse(participant?.identity);
    if (obj?.userType?.toLowerCase() == 'provider') {
      _onEndButtonPress();
    }
  };

  const _onNetworkLevelChanged = ({participant, isLocalUser, quality}) => {
    console.log(
      'Participant',
      participant,
      'isLocalUser',
      isLocalUser,
      'quality',
      quality,
    );
  };

  const _onDominantSpeakerDidChange = ({roomName, roomSid, participant}) => {
    console.log(
      'onDominantSpeakerDidChange',
      `roomName: ${roomName}`,
      `roomSid: ${roomSid}`,
      'participant:',
      participant,
    );
  };

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Need permission to access microphone',
        message:
          'To connect this call we need permission to access your microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To  connect this call we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  };

  const _onVideoButtonPress = () => {
    twilioVideo.current
      .setLocalVideoEnabled(!isVideoEnabled)
      .then(isEnabled => setIsVideoEnabled(isEnabled));
  };

  const _onParticipantAddedDataTrack = ({participant, track}) => {
    // console.log('onParticipantAddedDataTrack: ', participant, track);
    setDataTracks(
      new Map([
        ...dataTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, dataTrackSid: track.trackSid},
        ],
      ]),
    );
  };

  const _onDataTrackMessageReceived = ({message, trackSid}) => {
    const msg = JSON.parse(message);
    Store.dispatch({
      type: UPDATE_ARR_MESSAGES,
      payload: GiftedChat.append(arrMessage, msg),
    });
  };

  const _onSendMessage = message => {
    let sendChatMessage = {
      _id: uuid.v4(),
      msg: message,
      from: username,
      time: new Date(),
    };
    twilioVideo?.current?.sendString(JSON.stringify(sendChatMessage));
  };

  function onUserLeaveTheAppointment() {
    onUserLeaveAppointment(
      {},
      response => {
        navigation.pop(popCount);
      },
      error => {},
    );
  }

  function providerleaveCall() {
    setShowCompleteAppointment(true);
    const durationSeconds = minutes * 60 + seconds;
    const payload = {
      appointmentId: appointmentId.toString(),
      callDuration: durationSeconds,
      app: item,
      isInstantConsultation: true,
    };
    onProviderLeaveAppointment(
      payload,
      response => {
        twilioVideo.current.disconnect();
        // navigation.pop();
      },
      error => {
        console.log(error);
        twilioVideo.current.disconnect();
        // navigation.pop();
      },
    );
  }

  function completeInstantAptByProvider(amount, billingCode) {
    const payload = {
      app: item,
      amount: amount,
      billingCode: billingCode,
      meetingEndTime: moment().format(),
      // callDuration: minutes * 60 + item?.callDuration + seconds,
      callDuration: minutes * 60 + seconds,
    };
    completeInstantConstAppointment(
      payload,
      response => {
        setShowCompleteAppointment(false);
        navigation.pop(popCount);
      },
      error => {
        console.log(error);
      },
    );
  }

  function postCompleteAppointment(amount, billingCode, details) {
    const {days, isFollowUp = 'no'} = details;
    const payload = {
      app: appointmentData?.appointmentData,
      amount: amount,
      billingCode: billingCode,
      meetingEndTime: moment().format(),
      callDuration: minutes * 60 + seconds,
      isFollowUp: isFollowUp,
      days: days,
      timezone: getCurrentTimezone(),
    };
    console.log(JSON.stringify(payload));
    completeAppointment(
      payload,
      response => {
        setShowCompleteAppointment(false);
        navigation.pop(popCount);
      },
      error => {
        console.log(error);
      },
    );
  }
  const oppUser = isProvider() ? 'Patient' : 'Doctor';
  return (
    <SafeAreaView style={styles.container}>
      {videoTracks.size == 0 && showWaitMessage ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={commonStyles.Medium135}>
            Please wait here till {oppUser} joins.
          </Text>
        </View>
      ) : null}
      {status === 'connecting' ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={commonStyles.Medium135}>Connecting...</Text>
        </View>
      ) : null}

      {status === 'connected' ? (
        <View style={styles.callContainer}>
          <View
            style={{
              width: width,
              height: height / 1.9,
            }}>
            {selectedVideo ? (
              <TwilioVideoParticipantView
                style={{width: '100%', height: '100%'}}
                applyZOrder={false}
                key={selectedVideo?.trackSid}
                trackIdentifier={selectedVideo?.trackIdentifier}
              />
            ) : (
              videoTracks.size !== 0 &&
              showWaitMessage && (
                <Image
                  style={{width: '100%', height: '100%'}}
                  source={images.profileSmallDummy}
                />
              )
            )}
          </View>
        </View>
      ) : null}

      {status === 'connected' ? (
        <View style={{justifyContent: 'center'}}>
          <View style={{marginBottom: getCalculated(35)}}>
            <Text style={commonStyles.Bold20}>{username}</Text>
            <Text style={[commonStyles.Bold17, {alignSelf: 'center'}]}>
              {minutes + ':' + seconds}
            </Text>
          </View>
          <CallOptions
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            _onEndButtonPress={_onEndButtonPress}
            _onMuteButtonPress={_onMuteButtonPress}
            _onChatButtonPress={_onChatButtonPress}
            _onVideoButtonPress={_onVideoButtonPress}
          />
        </View>
      ) : null}
      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantAddedDataTrack={_onParticipantAddedDataTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onParticipantRemovedDataTrack={_onParticipantRemovedDataTrack}
        onNetworkQualityLevelsChanged={_onNetworkLevelChanged}
        onDominantSpeakerDidChange={_onDominantSpeakerDidChange}
        onDataTrackMessageReceived={_onDataTrackMessageReceived}
      />
      <View
        style={{
          position: 'absolute',
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          top: height / 2,
          width: '100%',
        }}>
        {status === 'connected' && (
          <View style={{paddingHorizontal: 15}}>
            <View style={styles.remoteGrid}>
              <View
                style={{
                  justifyContent: 'flex-end',
                }}>
                <View
                  style={{
                    borderWidth: 1,
                    width: getCalculated(56),
                    height: getCalculated(56),
                    borderColor: COLORS.WHITE,
                  }}>
                  {isVideoEnabled ? (
                    <TwilioVideoLocalView
                      enabled={false}
                      style={{flex: 1}}
                      applyZOrder={true}
                    />
                  ) : (
                    <Image
                      style={{
                        flex: 1,
                        width: getCalculated(56),
                        height: getCalculated(56),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      source={images.profileSmallDummy}
                    />
                  )}
                </View>

                <Text style={styles.txtYou}>You</Text>
              </View>
              {Array.from(videoTracks, ([trackSid, trackIdentifier], index) => {
                if (selectedVideo?.trackSid != trackSid) {
                  return (
                    <View key={index.toString()}>
                      <View
                        style={{
                          borderWidth: 1,
                          width: getCalculated(56),
                          height: getCalculated(56),
                          borderColor: COLORS.WHITE,
                        }}>
                        <TwilioVideoParticipantView
                          style={{width: '100%', height: '100%'}}
                          key={trackSid}
                          trackIdentifier={trackIdentifier}
                          applyZOrder={true}
                        />
                      </View>
                    </View>
                  );
                }
              })}
            </View>
          </View>
        )}
      </View>
      {showCompleteAppointment && isProvider() && (
        <BillingCode
          duration={minutes * 60 + item?.callDuration || 0 + seconds}
          isNormalConsultation={from == 'myapp'}
          item={item}
          CompleteBtnAction={(amount, billingCode, details = null) => {
            if (from == 'myapp') {
              postCompleteAppointment(amount, billingCode, details);
            } else {
              completeInstantAptByProvider(amount, billingCode);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = ({twilio, user}) => ({
  message: twilio.message,
  arrMessage: twilio.arrMessage,
  user: user.user,
});

export default connect(mapStateToProps)(TwilioCall);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebf4f8',
  },
  callContainer: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_BLUE,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 20,
    width: '80%',
    textAlign: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: '#005a97',
  },
  button: {
    marginTop: 20,
    width: '50%',
    backgroundColor: '#005a97',
    borderWidth: 1,
    padding: 10,
    alignSelf: 'center',
    borderRadius: 5,
  },
  localVideo: {
    borderWidth: 1,
    width: getCalculated(56),
    height: getCalculated(56),
    borderColor: COLORS.WHITE,
    // marginLeft: getCalculated(15),
    // borderRadius: getCalculated(8),
    backgroundColor: 'black',
  },
  remoteVideo: {
    borderWidth: 1,
    backgroundColor: 'black',
    width: getCalculated(56),
    height: getCalculated(56),
    borderColor: COLORS.WHITE,
    // borderRadius: getCalculated(8),
  },
  remoteGrid: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtYou: {
    ...commonStyles.RegularDark11,
    textAlign: 'center',
    marginLeft: getCalculated(15),
  },
  remoteContainer: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    width: getCalculated(56),
    height: getCalculated(56),
    alignItems: 'center',
    marginLeft: getCalculated(15),
    marginVertical: getCalculated(15),
    position: 'absolute',
    right: 0,
  },
});
