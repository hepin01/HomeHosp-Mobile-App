import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {displayErrorMsg, getUTCIso, userId} from '../../../utiles/common';
import ImageLoader from '../../../components/ImageLoader';
import images from '../../../assets/images';
import {COLORS, commonStyles, getCalculated} from '../../../components/Common';
import moment from 'moment';
import {SmallButton} from '../../../components/SmallButton';
import {useNavigation} from '@react-navigation/native';
import {Store} from '../../../../App';
import {UPDATE_SELECTED_DOCTOR} from '../../../redux/BookAppointmentReducer';
import {getTimeZone} from 'react-native-localize';
import {requestProviderForInstantConsultation} from '../../../networking/APIMethods';
import {Loader} from '../../../components/Loader';

const DocInfo = ({doctorDetails}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [appType, setAppType] = useState([
    {
      id: 1,
      selected: true,
      title: 'Instant Consultation',
    },
    {
      id: 2,
      selected: false,
      title: 'Schedule Appointment',
    },
  ]);
  const {
    _id,
    firstname,
    lastname,
    profileImageS3Link,
    providerType,
    providerSubType,
    preferredByPatients,
    providerInformation: {city, state, about},
  } = doctorDetails;
  const genderLetter = doctorDetails?.providerInformation?.gender
    ? doctorDetails?.miniSurveyForm?.gender == 'male'
      ? 'M'
      : 'F'
    : '';
  const isPreferred = preferredByPatients.includes(userId());

  function handleOnPressAppType(data) {
    const tempArr = [...appType];
    let modArr = [];
    modArr = tempArr.map(item => {
      if (item.id == data.id) {
        return {
          ...item,
          selected: true,
        };
      } else {
        return {
          ...item,
          selected: false,
        };
      }
    });
    setAppType(modArr);
  }

  function bookInstantAppointment() {
    setLoading(true);
    requestProviderForInstantConsultation(
      _id,
      response => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Your instant consultation request has been sent to the doctor, you can check the Request status',
          [
            {
              text: 'Ok',
              onPress: () => navigation.navigate('InstantAppListing'),
            },
          ],
        );
      },
      error => {
        setLoading(false);
        console.log(error);
        displayErrorMsg(error);
      },
    );
  }

  function handleBookAppointment() {
    const item = appType.find(ele => ele.selected == true);
    if (item?.id == 1) {
      bookInstantAppointment();
    } else if (item?.id == 2) {
      Store.dispatch({
        type: UPDATE_SELECTED_DOCTOR,
        payload: doctorDetails,
      });
      navigation.navigate('BookAppointment');
    } else {
      displayErrorMsg('Oops! Please select an appointment type.');
    }
  }

  return (
    <View style={{padding: getCalculated(15)}}>
      <Loader modalVisible={loading} />
      <View style={[styles.docCellView, styles.shadow]}>
        <View style={styles.subcontainer}>
          <View style={styles.rowView}>
            <ImageLoader
              style={styles.imageLogo}
              url={{uri: profileImageS3Link}}
              placeholder={images.userdefault}
            />
            <View style={styles.textView}>
              <Text style={commonStyles.Bold18}>
                Dr. {firstname + ' ' + lastname + ' '}
                <Text style={commonStyles.Regular115Blue}>
                  {genderLetter +
                    (doctorDetails?.providerInformation?.dob
                      ? ' (' +
                        moment().diff(
                          doctorDetails?.providerInformation?.dob,
                          'years',
                        ) +
                        ')'
                      : '')}
                </Text>
              </Text>
              <Text
                style={
                  commonStyles.Regular115Blue
                }>{`${providerType},\n${providerSubType}`}</Text>
            </View>
          </View>
          <View style={styles.smallRowView}>
            <View style={styles.miniRowView}>
              <Image style={styles.locationIcon} source={images.map} />
              <Text numberOfLines={2} style={commonStyles.RegularGrey11}>
                {city}, {state}
              </Text>
            </View>
            <View style={styles.miniRowView}>
              <Image
                style={styles.startIcon}
                source={
                  isPreferred ? images.staractiveicon : images.stardeactiveicon
                }
              />
              <Text style={[commonStyles.RegularGrey11]}>
                {isPreferred ? 'Preferred Doctor' : 'Not Preferred'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.textTitle}>About</Text>
        <Text style={styles.detailText}>{about}</Text>
      </View>
      <View style={styles.checkboxes}>
        {appType.map((item, index) => {
          const imgSrc = item.selected ? images.checked : images.unchecked;
          return (
            <Pressable
              key={item.id.toString()}
              style={styles.optionContainer}
              onPress={() => handleOnPressAppType(item)}>
              <Image source={imgSrc} style={styles.imgCheckBox} />
              <Text style={commonStyles.Regular12}>{item.title}</Text>
            </Pressable>
          );
        })}
      </View>
      <SmallButton
        style={{marginTop: 50, alignSelf: 'center'}}
        buttonTitle={'Book'}
        buttonAction={() => handleBookAppointment()}
      />
    </View>
  );
};

export default React.memo(DocInfo);

const styles = StyleSheet.create({
  docCellView: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    marginVertical: 7,
    paddingVertical: 15,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.65,
    elevation: 5,
  },
  subcontainer: {
    borderRadius: getCalculated(8),
    // paddingTop: getCalculated(10),
    width: '95%',
    alignSelf: 'center',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    width: '100%',
    alignItems: 'center',
    height: 'auto',
  },
  textView: {
    width: '80%',
    paddingHorizontal: 15,
    marginVertical: 0,
  },
  textView: {
    width: '80%',
    paddingHorizontal: 15,
    marginVertical: 0,
  },
  imageLogo: {
    width: getCalculated(55),
    height: getCalculated(55),
    resizeMode: 'cover',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  smallRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  miniRowView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // width: '50%',
    // flexWrap: 'wrap',
  },
  locationIcon: {
    width: getCalculated(12),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 5,
  },
  startIcon: {
    width: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 5,
  },
  textTitle: {
    ...commonStyles.Bold15,
    margin: 10,
  },
  detailText: {
    ...commonStyles.RegularBlack115,
    marginHorizontal: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: getCalculated(12),
  },
  imgCheckBox: {
    width: getCalculated(18),
    height: getCalculated(18),
    marginRight: getCalculated(16),
  },
  checkboxes: {
    marginHorizontal: getCalculated(15),
    marginVertical: getCalculated(24),
  },
});
