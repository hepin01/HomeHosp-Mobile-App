import moment from 'moment';
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import images from '../../../assets/images';
import {COLORS, commonStyles, getCalculated} from '../../../components/Common';
import ImageLoader from '../../../components/ImageLoader';
import {userId} from '../../../utiles/common';

const PreferencesCell = props => {
  const item = props?.data;
  const {
    _id,
    firstname,
    lastname,
    profileImageS3Link,
    providerType,
    providerSubType,
    preferredByPatients,
    providerInformation,
  } = item;
  const genderLetter = item?.providerInformation?.gender
    ? item?.providerInformation?.gender?.toLowerCase() == 'male'
      ? 'M'
      : 'F'
    : '';
  const isPreferred = preferredByPatients?.includes(userId());
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => {
        props?.onPressCell();
      }}>
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
                (item?.providerInformation?.dob
                  ? ' (' +
                    moment().diff(item?.providerInformation?.dob, 'years') +
                    ')'
                  : '')}
            </Text>
          </Text>
          <Text
            style={
              commonStyles.Regular115Blue
            }>{`${providerType},${providerSubType}`}</Text>
        </View>
      </View>
      <View style={styles.smallRowView}>
        <View style={styles.miniRowView}>
          <Image style={styles.locationIcon} source={images.map} />
          <Text style={commonStyles.RegularGrey11}>
            {providerInformation?.city}{',\n'}{providerInformation?.state}
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
      <TouchableOpacity
        onPress={() => {
          props?.onCheck();
        }}>
        <View style={styles.checkAvailability}>
          <Image style={styles.clockIcon} source={images.clock2} />
          <Text style={commonStyles.Regular135Blue}>
            {'Check Availability'}
          </Text>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(PreferencesCell);

const styles = StyleSheet.create({
  container: {
    borderRadius: getCalculated(8),
    paddingTop: getCalculated(10),
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
    width: '50%',
    flexWrap: 'wrap',
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
  descStyle: {marginBottom: 5},
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
  actionButtons: {alignSelf: 'flex-start'},
  checkAvailability: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    marginTop: 10,
    borderTopColor: COLORS.SUPER_LIGHT_GRAY,
    borderTopWidth: 1,
    alignSelf: 'center',
  },
  clockIcon: {
    width: 18,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 5,
  },
});
