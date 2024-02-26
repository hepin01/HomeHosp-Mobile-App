import React from 'react';

import {StyleSheet, Pressable, Text, Modal, View, Image} from 'react-native';
import {getCalculated, commonStyles, COLORS} from './Common';
import Base from '../screens/Base/Base';
import images from '../assets/images';

export class AlertModal extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      style,
      message,
      showClose,
      renderItem,
      modalVisible,
      closeBtnAction,
      leftButtonStyle,
      leftButtonTitle = 'Okay',
      rightButtonTitle = 'Cancel',
      rightButtonStyle,
      leftButtonAction,
      rightButtonAction,
    } = this.props;
    return (
      <Modal
        style={{}}
        animationType="fade"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalBgView}>
            <View style={styles.modalMainView}>
              {renderItem ? (
                <View>{renderItem}</View>
              ) : (
                <View>
                  <Text style={[commonStyles.Medium16, {margin: 15}]}>
                    {title}
                  </Text>
                  <Text style={styles.messageStyle}>{message}</Text>
                </View>
              )}

              <View style={styles.buttonView}>
                {leftButtonAction ? (
                  <Pressable
                    style={Object.assign({}, styles.leftbuttonBgStyle, style)}
                    onPress={() => leftButtonAction()}>
                    <Text
                      style={Object.assign(
                        {},
                        styles.buttonText,
                        leftButtonStyle,
                      )}>
                      {leftButtonTitle}
                    </Text>
                  </Pressable>
                ) : null}

                {rightButtonAction ? (
                  <Pressable
                    style={Object.assign({}, styles.rightbuttonBgStyle, style)}
                    onPress={() => rightButtonAction()}>
                    <Text
                      style={Object.assign(
                        {},
                        styles.buttonText,
                        rightButtonStyle,
                      )}>
                      {rightButtonTitle}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
              {showClose ? (
                <Pressable
                  onPress={() => {
                    closeBtnAction();
                  }}
                  style={styles.closeBtn}>
                  <Image style={styles.closeImage} source={images.close} />
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalBgView: {
    width: '95%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMainView: {
    width: '95%',
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: getCalculated(7),
    marginTop: getCalculated(7),
  },
  buttonView: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 15,
  },
  leftbuttonBgStyle: {
    width: 'auto',
    backgroundColor: COLORS.BLUE,
    borderRadius: 6,
    justifyContent: 'center',
    height: getCalculated(39),
  },
  rightbuttonBgStyle: {
    width: 'auto',
    backgroundColor: COLORS.LIGHTER_GREY,
    borderRadius: 6,
    justifyContent: 'center',
    height: getCalculated(39),
    marginLeft: 10,
  },
  buttonText: {
    ...commonStyles.Regular11White,
    paddingVertical: getCalculated(5),
    paddingHorizontal: getCalculated(10),
  },
  closeBtn: {position: 'absolute', right: 15, top: 15},
  closeImage: {resizeMode: 'contain', width: 20, height: 20},
  messageStyle: {
    fontSize: getCalculated(15),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    marginLeft: 15,
    marginRight: 15,
  },
});
