import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ImageLoader from '../../../components/ImageLoader';
import {COLORS, commonStyles, getCalculated} from '../../../components/Common';
import moment from 'moment';
import images from '../../../assets/images';
import {userId} from '../../../utiles/common';

const ProviderCell = ({
  item,
  index,
  togglePreferredDoctor,
  handleOnPressProvider,
}) => {
  const {
    _id,
    firstname,
    lastname,
    providerType,
    profileImageS3Link,
    preferredByPatients,
  } = item;
  const genderLetter = item?.providerInformation?.gender == 'male' ? 'M' : 'F';
  return (
    <Pressable
      style={styles.eRequestContainer}
      onPress={() => handleOnPressProvider()}>
      <View style={styles.eReqSubContainer}>
        <View style={{flex: 1}}>
          <ImageLoader
            style={styles.imgProfile}
            url={{uri: profileImageS3Link}}
            placeholder={images.userdefault}
          />
        </View>
        <View
          style={{
            flex: 3,
            marginLeft:
              Platform.OS == 'ios' ? getCalculated(15) : getCalculated(20),
            //   alignItems: 'center',
          }}>
          <Text style={commonStyles.Bold18}>
            {'Dr. ' + firstname + ' ' + lastname + ' '}
            <Text style={commonStyles.Regular10Blue}>
              {genderLetter +
                (item?.providerInformation?.dob
                  ? '(' +
                    moment().diff(item?.providerInformation?.dob, 'years') +
                    ')'
                  : '')}
            </Text>
          </Text>
          <View style={{marginTop: 5}}>
            <Text style={commonStyles.Regular10Blue}>{`${providerType}`}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.cardBody, {marginTop: 10}]}>
        {item?.providerInformation?.city ? (
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image style={styles.imgMap} source={images.map} />
            <Text numberOfLines={2} style={commonStyles.RegularGrey11}>
              {`${item?.providerInformation?.city},\n${item?.providerInformation?.state}`}
            </Text>
          </View>
        ) : null}
        <Pressable
          style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
          onPress={() =>
            togglePreferredDoctor(_id, !preferredByPatients.includes(userId()))
          }>
          {preferredByPatients.includes(userId()) ? (
            <Image
              resizeMethod="resize"
              resizeMode="cover"
              style={styles.imgStar}
              source={images.staractiveicon}
            />
          ) : (
            <Image
              resizeMethod="resize"
              resizeMode="cover"
              style={styles.imgStar}
              source={images.stardeactiveicon}
            />
          )}
          <Text style={commonStyles.RegularGrey11}>Preferred Doctor</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default ProviderCell;

const styles = StyleSheet.create({
  eRequestContainer: {
    width: '99%',
    alignSelf: 'center',
    borderRadius: 10.3,
    backgroundColor: COLORS.WHITE,
    marginVertical: getCalculated(10),
    paddingVertical: getCalculated(18),
    paddingHorizontal: getCalculated(15),
    ...commonStyles.shadow,
  },
  eReqSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 30,
  },
  imgProfile: {
    width: getCalculated(57),
    height: getCalculated(57),
    borderRadius: getCalculated(6),
    alignSelf: 'center',
  },
  cardBody: {
    paddingVertical: getCalculated(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgMap: {
    height: getCalculated(16),
    width: getCalculated(12),
    marginRight: getCalculated(12),
  },
  imgCard: {
    height: getCalculated(14),
    width: getCalculated(20),
    marginRight: getCalculated(6),
  },
  imgStar: {
    height: getCalculated(15),
    width: getCalculated(16),
    marginRight: getCalculated(5),
  },
});
