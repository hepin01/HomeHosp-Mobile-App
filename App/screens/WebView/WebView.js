import React from 'react';
import {WebView} from 'react-native-webview';
// import CallDetectorManager from 'react-native-call-detection';

import Base from '../Base/Base';
import {isProvider} from '../../utiles/common';

class WebviewDetails extends Base {
  constructor(props) {
    super(props);
    // this.permissionGranted = true
  }

  componentDidMount() {
    // this.startListener();
  }

  componentWillUnmount() {
    // this.stopListener();
  }

  // startListener() {
  //   this.callDetector = new CallDetectorManager(
  //     (event, phoneNumber) => {
  //       // For iOS event will be either "Connected",
  //       // "Disconnected","Dialing" and "Incoming"

  //       // For Android event will be either "Offhook",
  //       // "Disconnected", "Incoming" or "Missed"
  //       // phoneNumber should store caller/called number

  //       if (event === 'Disconnected') {
  //         // Do something call got disconnected
  //       } else if (event === 'Connected') {
  //         // Do something call got connected
  //         // This clause will only be executed for iOS
  //         // this.props.navigation.pop();
  //       } else if (event === 'Incoming') {
  //         // Do something call got incoming
  //         this.props.navigation.pop();
  //       } else if (event === 'Dialing') {
  //         // Do something call got dialing
  //         // This clause will only be executed for iOS
  //       } else if (event === 'Offhook') {
  //         //Device call state: Off-hook.
  //         // At least one call exists that is dialing,
  //         // active, or on hold,
  //         // and no calls are ringing or waiting.
  //         // This clause will only be executed for Android
  //       } else if (event === 'Missed') {
  //         // Do something call got missed
  //         // This clause will only be executed for Android
  //       }
  //     },
  //     false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
  //     () => {
  //       this.permissionGranted = false
  //     }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
  //     {
  //       title: 'Phone State Permission',
  //       message:
  //         'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
  //     }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
  //   );
  // }

  // stopListener() {
  //   if (this.permissionGranted && this.callDetector) {
  //     this.callDetector && this.callDetector.dispose();
  //   }
  // }

  onMessage = data => {
    const webData = data?.nativeEvent?.data;
    console.log(typeof webData);
    console.log(webData);
    const {pop, navigate} = this.props.navigation;
    if (
      webData == 'back' ||
      webData == 'Medical history has been updated successfully.'
    ) {
      pop();
    } else if (webData.includes('appointmentData')) {
      this.props.navigation.navigate('TwilioCall', {
        popCount: 2,
        appointmentData: JSON.parse(webData),
      });
    }
  };

  render() {
    const webURI = this.props.route.params.uri;
     console.log(webURI)
    return (
      <WebView
        allowsInlineMediaPlayback={true}
        javaScriptEnabled
        javaScriptEnabledAndroid={true}
        originWhitelist={['*']}
        mediaPlaybackRequiresUserAction={false}
        androidLayerType="software"
        onLoadStart={syntheticEvent => this.showLoader('')}
        onLoad={() => this.dismissLoader()}
        onError={() => this.dismissLoader()}
        cacheMode={'LOAD_NO_CACHE'}
        cacheEnabled={false}
        onMessage={this.onMessage}
        source={{
          uri: encodeURI(webURI),
        }}
        useWebkit
        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
      />
    );
  }
}

export default WebviewDetails;
