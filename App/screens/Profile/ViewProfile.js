/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import images from '../../assets/images';
import {commonStyles, getCalculated, COLORS} from '../../components/Common';
import ActionSheet from 'react-native-custom-actionsheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {getUserProfile, updateProfileImage} from '../../networking/APIMethods';
import Base from '../Base/Base';
import ImagePicker from 'react-native-image-crop-picker';
import {Messages} from '../../components/Messages';

class ViewProfile extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isImageSelected: props.user && props.user.profileImgUrl ? true : false,
      profileImage: {
        uri: props.user.profileImgUrl,
      },
      fileUri: '',
      fileName: '',
      filePath: '',
      isImageViewVisible: false,
      isImageLoading: true,
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.showLoader('');

    getUserProfile(
      response => {
        this.dismissLoader();
        console.log(response);
        const userObj = this.setUser(response?.user);
        console.log(userObj);
        this.props.dispatch({
          type: 'SET_USER',
          payload: userObj,
        });
        this.setState({
          isImageSelected:
            this.props.user && this.props.user.profileImgUrl ? true : false,
          profileImage: {
            uri: this.props.user.profileImgUrl,
          },
        });
      },
      error => {
        this.displayErrorMsg(error);
        this.dismissLoader();
      },
    );
  }

  selectPhotoTapped() {
    this.actionSheet.show();
  }

  getActionSheetRef = ref => (this.actionSheet = ref);

  handlePress = index => {
    //console.log(index)
    if (index == 0) {
    } else if (index == 1) {
      ImagePicker.openCamera({
        width: 1200,
        height: 660,
        cropping: true,
        quality: 1,
        includeBase64: true,
        cropperCircleOverlay: false,
      }).then(image => {
        console.log(image);
        this.updateImage('data:image/jpeg;base64,' + image.data);
        let source = {
          uri: `data:${image.mime};base64,${image.data}`,
        };
        this.setState({
          isImageSelected: true,
          imageData: 'data:image/jpeg;base64,' + image.data,
          profileImage: source,
        });
      });
    } else if (index == 2) {
      ImagePicker.openPicker({
        width: 1200,
        height: 660,
        cropping: true,
        quality: 1,
        includeBase64: true,
        cropperCircleOverlay: false,
      }).then(image => {
        console.log(image);
        this.updateImage('data:image/jpeg;base64,' + image.data);
        let source = {
          uri: `data:${image.mime};base64,${image.data}`,
        };
        this.setState({
          isImageSelected: true,
          imageData: 'data:image/jpeg;base64,' + image.data,
          profileImage: source,
        });
      });
    } else if (index == 3) {
      this.setState({
        isImageSelected: false,
        imageData: '',
        profileImage: images.profileDummy,
      });
    }
  };

  updateImage(imgData) {
    updateProfileImage(
      imgData,
      response => {
        this.props.dispatch({
          type: 'SET_PROFILE_IMAGE',
          payload: response?.profileImage,
        });
        this.displayMsg(response?.message);
      },
      error => {
        this.displayErrorMsg(error);
      },
    );
  }

  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  render() {
    const {profileImage, isImageLoading, isImageSelected} = this.state;
    const {user} = this.props;
    return (
      <View style={commonStyles.container}>
        <View style={styles.imageBgView}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.isImageSelected) {
                this.setState({isImageViewVisible: true});
              }
            }}>
            <Image
              onLoadEnd={() => {
                setTimeout(() => {
                  this.setState({isImageLoading: false});
                }, 1000);
              }}
              style={[
                styles.imageView,
                {resizeMode: isImageSelected ? 'cover' : 'center'},
              ]}
              source={
                !isImageLoading && !isImageSelected
                  ? images.profileDummy
                  : isImageLoading
                  ? images.profileDummy
                  : (profileImage &&
                      (profileImage != null || profileImage.length > 0)) ||
                    isImageSelected
                  ? profileImage
                  : images.profileDummy
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              this.selectPhotoTapped();
            }}>
            <Image style={styles.cameraIcon} source={images.editprofpic} />
          </TouchableOpacity>

          <View style={styles.userNameView}>
            <Text style={{width: '99%'}}>
              <Text style={[commonStyles.Bold17, {flexWrap: 'wrap'}]}>
                {'Dr. ' +
                  user.firstname +
                  ' ' +
                  user.lastname +
                  (user.gender.length > 0 ? ', ' : '')}
              </Text>
              <Text
                style={[
                  commonStyles.Medium11,
                  {alignSelf: 'flex-end', marginBottom: 2},
                ]}>
                {user.gender.charAt(0).toUpperCase() +
                  user.gender.slice(1) +
                  (user.dob.length > 0
                    ? ' (' + this.getAge(user.dob) + ' years)'
                    : '')}
              </Text>
            </Text>
          </View>
        </View>
        <ScrollView
         style={{width: '100%',height: '100%',}}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: 200,
          }}
          showsVerticalScrollIndicator={false}>
          <View style={[commonStyles.shadow, styles.shadowCard]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('EditPersonalInfo');
              }}>
              <Text style={commonStyles.Bold15}>{'About'}</Text>
              <Text style={[commonStyles.Regular12, {marginTop: 5}]}>
                {user.about.length > 0
                  ? user.about
                  : 'Click to add information about you'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[commonStyles.shadow, styles.shadowCard]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('EditContactDetails');
              }}>
              <Text style={commonStyles.Bold15}>{'Contact Details'}</Text>
              <View style={styles.innerView}>
                <Image style={styles.emailImage} source={images.email} />
                <Text style={commonStyles.Regular12}>{user.email}</Text>
              </View>

              <View style={styles.innerView}>
                <Image style={styles.callImage} source={images.call} />
                <Text style={commonStyles.Regular12}>
                  {user.contactnumber.length > 0
                    ? '+1 ' + user.contactnumber
                    : 'Click to add phone number'}
                </Text>
              </View>

              <View style={styles.innerView}>
                <Image style={styles.locationImage} source={images.location} />
                <Text style={[commonStyles.Regular12, {marginRight: 10}]}>
                  {(user.city.length > 0
                    ? user.city + ', '
                    : 'Click to add address') +
                    (user.state.length > 0 ? user.state + ', ' : '') +
                    (user.zipcode.length > 0 ? user.zipcode + ', ' : '') +
                    (user.country.length > 0 ? user.country : '')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[commonStyles.shadow, styles.shadowCard]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('EditSpecialities');
              }}>
              <Text style={commonStyles.Bold15}>{'Specialities'}</Text>
              {/* {specialities.map((speciality, key) => ( */}
              <Text style={[commonStyles.Regular12, {marginTop: 5}]}>
                {user.providerType}
              </Text>
              <Text style={[commonStyles.Regular12, {marginTop: 5}]}>
                {user.providerSubType}
              </Text>
              {/* ))} */}
            </TouchableOpacity>
          </View>

          <View
            style={[
              commonStyles.shadow,
              styles.shadowCard,
              {marginBottom: 10},
            ]}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('EditLanguages');
              }}>
              <Text style={commonStyles.Bold15}>{'Language'}</Text>
              {user.language?.map((language, index) => (
                <Text
                  key={index}
                  style={[commonStyles.Regular12, {marginTop: 5}]}>
                  {language}
                </Text>
              ))}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ActionSheet
          ref={this.getActionSheetRef}
          message={'Select Photo'}
          options={
            this.state.isImageSelected
              ? ['Cancel', 'Camera', 'Photo Library']
              : ['Cancel', 'Camera', 'Photo Library']
          }
          cancelButtonIndex={0}
          onPress={this.handlePress}
        />
        {this.progressLoader()}
      </View>
    );
  }
}

const STATE = state => ({user: state.user.user});
export default connect(STATE)(ViewProfile);

const styles = StyleSheet.create({
  imageBgView: {
    width: '100%',
    height: getCalculated(155),
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  imageView: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    right: 10,
    bottom: 60,
  },
  cameraIcon: {
    width: 32,
    height: 32,
  },
  userNameView: {
    width: '100%',
    height: getCalculated(45),
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 5,
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  shadowCard: {
    width: '90%',
    backgroundColor: 'white',
    marginTop: 15,
    padding: 15,
    borderRadius: 6,
  },
  innerView: {flexDirection: 'row', marginTop: 10},
  emailImage: {
    resizeMode: 'contain',
    marginRight: 10,
    alignSelf: 'center',
    width: getCalculated(16),
    height: getCalculated(12),
  },
  callImage: {
    resizeMode: 'contain',
    marginRight: 10,
    alignSelf: 'center',
    width: getCalculated(16),
    height: getCalculated(16),
  },
  locationImage: {
    resizeMode: 'contain',
    marginRight: 10,
    alignSelf: 'center',
    width: getCalculated(16),
    height: getCalculated(18),
  },
});
