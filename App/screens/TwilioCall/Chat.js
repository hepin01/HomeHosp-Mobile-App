import React, {useState, useEffect, useCallback} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import uuid from 'react-native-uuid';
import {
  GiftedChat,
  Send,
  Bubble,
  Composer,
  MessageText,
} from '../../components/react-native-gifted-chat';

import {COLORS, commonStyles, getCalculated} from '../../components/Common';
import images from '../../assets/images';
import {displayErrorMsg, userId} from '../../utiles/common';
import {connect, useDispatch} from 'react-redux';
import {UPDATE_MESSAGE} from '../../redux/TwilioReducer';

const Chat = props => {
  const {
    arrMessage,
    route: {
      params: {sendMessage, username},
    },
  } = props;
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (props.arrMessage.length) {
      const {_id, msg, time, from} = arrMessage[0];
      const mesg = {
        _id: _id,
        text: msg,
        createdAt: time,
        user: {
          _id: _id,
          name: from,
        },
      };

      setMessages(oldArr => [mesg, ...oldArr]);
    }
  }, [props.arrMessage]);

  const onSend = useCallback((messages = [], id) => {
    // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    if (messages.length) {
      const newMessage = messages[0].text;
      const createdAt = messages[0].createdAt;
      sendMessage(newMessage);
      dispatch({
        type: UPDATE_MESSAGE,
        payload: newMessage,
      });

      let sendChatMessage = {
        _id: uuid.v4(),
        text: newMessage,
        createdAt: new Date(),
        user: {
          _id: userId(),
          name: username,
        },
      };
      setMessages(oldArr => [sendChatMessage, ...oldArr]);
    }
  }, []);

  const renderMessageText = props => {
    return (
      <MessageText
        {...props}
        customTextStyle={{
          fontSize: getCalculated(13.5),
          // fontFamily: 'SourceSansPro-Regular',
        }}
      />
    );
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        // position={'left'}
        wrapperStyle={{
          left: styles.leftBubble,
          right: styles.rightBubble,
        }}
      />
    );
  };

  const renderComposer = props => {
    return (
      <View style={{flex: 1, backgroundColor: '#ebf4f8'}}>
        <View style={styles.composer}>
          <Composer
            {...props}
            textInputProps={{
              autoCorrect: false,
            }}
            textInputStyle={{
              backgroundColor: COLORS.BLUE,
              ...commonStyles.Regular12,
              color: COLORS.WHITE,
            }}
          />
          <Send
            {...props}
            containerStyle={styles.sendButtonContainer}
            sendButtonProps={styles.sendButton}>
            <Image
              source={images.enter}
              style={{width: 40, height: 40, resizeMode: 'contain'}}
            />
          </Send>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ebf4f8'}}>
      <GiftedChat
        wrapInSafeArea={true}
        user={{_id: userId()}} //place the logged in users userid here
        alwaysShowSend={true}
        showUserAvatar={true}
        messages={messages}
        renderSend={() => null}
        showAvatarForEveryMessage
        renderUsernameOnMessage={true}
        placeholder={'Type Your Text Here...'}
        placeholderTextColor={COLORS.WHITE}
        onSend={messages => onSend(messages)}
        renderBubble={props => renderBubble(props)}
        renderComposer={props => renderComposer(props)}
        renderMessageText={props => renderMessageText(props)}
      />
    </View>
  );
};
const mapStateToProps = ({twilio}) => ({
  arrMessage: twilio.arrMessage,
});

export default connect(mapStateToProps)(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  leftBubble: {
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    backgroundColor: COLORS.WHITE,
    // marginHorizontal: getCalculated(21.5),
  },
  rightBubble: {
    borderRadius: 5,
    backgroundColor: COLORS.BLUE,
    borderBottomRightRadius: 0,
    // marginVertical: getCalculated(21.5),
  },
  sendButtonContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BLUE,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  composer: {
    padding: 5,
    margin: 15,
    borderRadius: 5,
    flexDirection: 'row',
    backgroundColor: COLORS.BLUE,
  },
});
