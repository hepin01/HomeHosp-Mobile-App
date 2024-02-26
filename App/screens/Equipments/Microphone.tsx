import React from 'react';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    OutputFormatAndroidType,
  } from 'react-native-audio-recorder-player';
  import type {
    AudioSet,
    PlayBackType,
    RecordBackType,
  } from 'react-native-audio-recorder-player';
  import {
    Alert,
    Dimensions,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import CallDetectorManager from 'react-native-call-detection';
  import Button from './Button';
  import RNFetchBlob from 'rn-fetch-blob';
  import type {ReactElement} from 'react';
import { COLORS, commonStyles, getCalculated } from '../../components/Common';
  
  const styles: any = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.WHITE,
      flexDirection: 'column',
      alignItems: 'center',
    },
    titleTxt: {
      marginTop: 100,
      ...commonStyles.Medium135
    },
    playTxt: {
      marginTop: 50,
      ...commonStyles.Medium135
    },
    viewRecorder: {
      marginTop: 40,
      width: '100%',
      alignItems: 'center',
    },
    recordBtnWrapper: {
      flexDirection: 'row',
    },
    viewPlayer: {
      marginTop: 60,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    viewBarWrapper: {
      marginTop: 28,
      marginHorizontal: 28,
      alignSelf: 'stretch',
    },
    viewBar: {
      backgroundColor: '#ccc',
      height: 4,
      alignSelf: 'stretch',
    },
    viewBarPlay: {
      backgroundColor: COLORS.BLUE,
      height: 4,
      width: 0,
    },
    playStatusTxt: {
      marginTop: 8,
      color: '#ccc',
    },
    playBtnWrapper: {
      flexDirection: 'row',
      marginTop: 40,
    },
    btn: {
      borderRadius: 10.3,
    alignSelf: 'center',
    ...commonStyles.shadow,
    backgroundColor: COLORS.WHITE,
    paddingVertical: getCalculated(2),
    paddingHorizontal: getCalculated(8),
    },
    txt: {
      marginHorizontal: 8,
      marginVertical: 4,
      ...commonStyles.Medium11
    },
    txtRecordCounter: {
      marginTop: 32,
      // textAlignVertical: 'center',
      letterSpacing: 3,
      ...commonStyles.Medium11
    },
    txtCounter: {
      marginTop: 12,
      // textAlignVertical: 'center',
      letterSpacing: 3,
      ...commonStyles.Medium11
    },
  });
  
  interface State {
    isLoggingIn: boolean;
    recordSecs: number;
    recordTime: string;
    currentPositionSec: number;
    currentDurationSec: number;
    playTime: string;
    duration: string;
    disableRecording: boolean;
    disablePlay: boolean;
  }
  
  const screenWidth = Dimensions.get('screen').width;
  
  class Microphone extends React.Component<any, State> {
    private dirs = RNFetchBlob.fs.dirs;
    private path = Platform.select({
      ios: undefined,
      android: undefined,
  
      // Discussion: https://github.com/hyochan/react-native-audio-recorder-player/discussions/479
      // ios: 'https://firebasestorage.googleapis.com/v0/b/cooni-ebee8.appspot.com/o/test-audio.mp3?alt=media&token=d05a2150-2e52-4a2e-9c8c-d906450be20b',
      // ios: 'https://staging.media.ensembl.fr/original/uploads/26403543-c7d0-4d44-82c2-eb8364c614d0',
      // ios: 'hello.m4a',
      // android: `${this.dirs.CacheDir}/hello.mp3`,
    });
  
    private audioRecorderPlayer: AudioRecorderPlayer;
    public callDetector: CallDetectorManager;
    constructor(props: any) {
      super(props);
      this.state = {
        isLoggingIn: false,
        recordSecs: 0,
        recordTime: '00:00:00',
        currentPositionSec: 0,
        currentDurationSec: 0,
        playTime: '00:00:00',
        duration: '00:00:00',
        disableRecording: false,
        disablePlay: true,
      };
      this.callDetector= null
      this.audioRecorderPlayer = new AudioRecorderPlayer();
      this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
    }

    componentDidMount(): void {
      this.startListener();
      this.props.navigation.addListener('beforeRemove', e => {
        if (this.state.playTime === '00:00:00' && this.state.recordTime == '00:00:00') {
          //  no audio recorded so pop the screen
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Oops!!',
          'Are you sure you want to cancel the microphone test?',
          [
            {text: 'No', style: 'cancel', onPress: () => {}},
            {
              text: 'Yes',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => {
                this.onStopRecord();
                this.onStopPlay();
                this.props.navigation.dispatch(e.data.action);
              },
            },
          ],
        );
      })
    }

    componentWillUnmount(): void {
      this.stopListener()
    }
    startListener() {
      this.callDetector = new CallDetectorManager(
        (event, phoneNumber) => {
          // For iOS event will be either "Connected",
          // "Disconnected","Dialing" and "Incoming"
  
          // For Android event will be either "Offhook",
          // "Disconnected", "Incoming" or "Missed"
          // phoneNumber should store caller/called number
  
          if (event === 'Disconnected') {
            // Do something call got disconnected
          } else if (event === 'Connected') {
            // Do something call got connected
            // This clause will only be executed for iOS
            // this.props.navigation.pop();
          } else if (event === 'Incoming') {
            // Do something call got incoming
            this.onStopRecord();
          } else if (event === 'Dialing') {
            // Do something call got dialing
            // This clause will only be executed for iOS
          } else if (event === 'Offhook') {
            //Device call state: Off-hook.
            // At least one call exists that is dialing,
            // active, or on hold,
            // and no calls are ringing or waiting.
            // This clause will only be executed for Android
          } else if (event === 'Missed') {
            // Do something call got missed
            // This clause will only be executed for Android
          }
        },
        false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
        () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
        {
          title: 'Phone State Permission',
          message:
            'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
        }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
      );
    }
  
    stopListener() {
      this.callDetector && this.callDetector.dispose();
    }

    public render(): ReactElement {
      let playWidth =
        (this.state.currentPositionSec / this.state.currentDurationSec) *
        (screenWidth - 56);
  
      if (!playWidth) {
        playWidth = 0;
      }
  
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.titleTxt}>Record an audio</Text>
          <Text style={styles.txtRecordCounter}>{this.state.recordTime}</Text>
          <View style={styles.viewRecorder}>
            <View style={styles.recordBtnWrapper}>
              <Button
              disabled={this.state.disableRecording}
                style={styles.btn}
                onPress={this.onStartRecord}
                textStyle={styles.txt}>
                Record
              </Button>
              <Button
              disabled={this.state.disableRecording}
                style={[
                  styles.btn,
                  {
                    marginLeft: 12,
                  },
                ]}
                onPress={this.onPauseRecord}
                textStyle={styles.txt}>
                Pause
              </Button>
              <Button
              disabled={this.state.disableRecording}
                style={[
                  styles.btn,
                  {
                    marginLeft: 12,
                  },
                ]}
                onPress={this.onResumeRecord}
                textStyle={styles.txt}>
                Resume
              </Button>
              <Button
              disabled={this.state.disableRecording}
                style={[styles.btn, {marginLeft: 12}]}
                onPress={this.onStopRecord}
                textStyle={styles.txt}>
                Stop
              </Button>
            </View>
          </View>
          <View style={styles.viewPlayer}>
            <TouchableOpacity
              style={styles.viewBarWrapper}
              onPress={this.onStatusPress}>
              <View style={styles.viewBar}>
                <View style={[styles.viewBarPlay, {width: playWidth}]} />
              </View>
            </TouchableOpacity>
            <Text style={styles.txtCounter}>
              {this.state.playTime} / {this.state.duration}
            </Text>
            <Text style={styles.playTxt}>Play the audio</Text>
            <View style={styles.playBtnWrapper}>
              <Button
              disabled={this.state.disablePlay}
                style={styles.btn}
                onPress={this.onStartPlay}
                textStyle={styles.txt}>
                Play
              </Button>
              <Button
              disabled={this.state.disablePlay}
                style={[
                  styles.btn,
                  {
                    marginLeft: 12,
                  },
                ]}
                onPress={this.onPausePlay}
                textStyle={styles.txt}>
                Pause
              </Button>
              <Button
              disabled={this.state.disablePlay}
                style={[
                  styles.btn,
                  {
                    marginLeft: 12,
                  },
                ]}
                onPress={this.onResumePlay}
                textStyle={styles.txt}>
                Resume
              </Button>
              <Button
              disabled={this.state.disablePlay}
                style={[
                  styles.btn,
                  {
                    marginLeft: 12,
                  },
                ]}
                onPress={this.onStopPlay}
                textStyle={styles.txt}>
                Stop
              </Button>
            </View>
          </View>
        </SafeAreaView>
      );
    }
  
    private onStatusPress = (e: any): void => {
      const touchX = e.nativeEvent.locationX;
      console.log(`touchX: ${touchX}`);
  
      const playWidth =
        (this.state.currentPositionSec / this.state.currentDurationSec) *
        (screenWidth - 56);
      console.log(`currentPlayWidth: ${playWidth}`);
  
      const currentPosition = Math.round(this.state.currentPositionSec);
  
      if (playWidth && playWidth < touchX) {
        const addSecs = Math.round(currentPosition + 1000);
        this.audioRecorderPlayer.seekToPlayer(addSecs);
        console.log(`addSecs: ${addSecs}`);
      } else {
        const subSecs = Math.round(currentPosition - 1000);
        this.audioRecorderPlayer.seekToPlayer(subSecs);
        console.log(`subSecs: ${subSecs}`);
      }
    };
  
    private onStartRecord = async (): Promise<void> => {
      if (Platform.OS === 'android') {
        try {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
  
          console.log('write external stroage', grants);
  
          if (
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('permissions granted');
          } else {
            console.log('All required permissions not granted');
  
            return;
          }
        } catch (err) {
          console.warn(err);
  
          return;
        }
      }
      this.setState({disablePlay: true})
      const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
      };
  
      console.log('audioSet', audioSet);
  
      const uri = await this.audioRecorderPlayer.startRecorder(
        this.path,
        audioSet,
      );
  
      this.audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        // console.log('record-back', e);
        this.setState({
          recordSecs: e.currentPosition,
          recordTime: this.audioRecorderPlayer.mmssss(
            Math.floor(e.currentPosition),
          ),
        });
      });
      console.log(`uri: ${uri}`);
    };
  
    private onPauseRecord = async (): Promise<void> => {
      try {
        const r = await this.audioRecorderPlayer.pauseRecorder();
        console.log(r);
      } catch (err) {
        console.log('pauseRecord', err);
      }
    };
  
    private onResumeRecord = async (): Promise<void> => {
      await this.audioRecorderPlayer.resumeRecorder();
    };
  
    private onStopRecord = async (): Promise<void> => {
      const result = await this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
      this.setState({
        recordSecs: 0,
        disablePlay: false,
      });
      console.log(result);
    };
  
    private onStartPlay = async (): Promise<void> => {
      console.log('onStartPlay', this.path);
  
      try {
        const msg = await this.audioRecorderPlayer.startPlayer(this.path);
  
        //? Default path
        // const msg = await this.audioRecorderPlayer.startPlayer();
        const volume = await this.audioRecorderPlayer.setVolume(1.0);
        console.log(`path: ${msg}`, `volume: ${volume}`);
  
        this.audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
          console.log('playBackListener', e);
          this.setState({
            disableRecording: true,
            currentPositionSec: e.currentPosition,
            currentDurationSec: e.duration,
            playTime: this.audioRecorderPlayer.mmssss(
              Math.floor(e.currentPosition),
            ),
            duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
          });
        });
      } catch (err) {
        console.log('startPlayer error', err);
      }
    };
  
    private onPausePlay = async (): Promise<void> => {
      await this.audioRecorderPlayer.pausePlayer();
    };
  
    private onResumePlay = async (): Promise<void> => {
      await this.audioRecorderPlayer.resumePlayer();
    };
  
    private onStopPlay = async (): Promise<void> => {
      console.log('onStopPlay');
      this.setState({disableRecording: false})
      this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
    };
  }
  
  export default Microphone;