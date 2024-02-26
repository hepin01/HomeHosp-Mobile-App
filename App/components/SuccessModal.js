import React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  View,
  Image,
} from 'react-native';
import {getCalculated, commonStyles, COLORS} from './Common';
import Base from '../screens/Base/Base';
import images from '../assets/images';
import {fontStyles} from '../styles/FontStyle';

export class SuccessModal extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        style={{}}
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({modalVisible: false});
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modalBgView}>
            <View style={styles.modalMainView}>
              <Image style={styles.headerImage} source={this.props.image} />
              <Text style={styles.titleStyle}>{this.props.title}</Text>
              <Text style={styles.messageStyle}>{this.props.message}</Text>

              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={[styles.rightbuttonBgStyle, this.props.style]}
                  onPress={() => this.props.buttonAction()}>
                  <Text
                    style={[styles.buttonText, this.props.rightButtonStyle]}>
                    {this.props.rightButtonTitle}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* {this.props.showClose ? (
                <TouchableOpacity
                  onPress={() => {
                    this.props.closeBtnAction();
                  }}
                  style={styles.closeBtn}>
                  <Image style={styles.closeImage} source={images.close} />
                </TouchableOpacity>
              ) : null} */}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    marginTop: -250,
    paddingVertical: 10,
  },
  buttonView: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 15,
  },
  rightbuttonBgStyle: {
    width: 'auto',
    backgroundColor: COLORS.BLUE,
    borderRadius: 6,
    justifyContent: 'center',
    height: getCalculated(30),
    marginLeft: 10,
  },
  buttonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: getCalculated(13.5),
    color: COLORS.WHITE,
    textAlign: 'center',
    paddingLeft: getCalculated(10),
    paddingRight: getCalculated(10),
  },
  closeBtn: {position: 'absolute', right: 15, top: 15},
  closeImage: {resizeMode: 'contain', width: 15, height: 15},
  titleStyle: {
    fontSize: getCalculated(20),
    textAlignVertical: 'center',
    textAlign: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Bold',
    width: '90%',
    alignSelf: 'center',
  },
  messageStyle: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    textAlign: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Medium',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  headerImage: {
    resizeMode: 'contain',
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
});
