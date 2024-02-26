import {Text, View, Image, StyleSheet} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import images from '../assets/images';
import {COLORS, commonStyles, getCalculated} from './Common';

const HeaderDocInfo = ({user, children}) => {
  const {firstname, lastname, profileImgUrl} = user;
  return (
    <View style={{backgroundColor: COLORS.WHITE}}>
      <View style={[commonStyles.container, {alignItems: 'center'}]}>
        <View style={commonStyles.increasedNavBar}></View>
        <View style={[styles.welcomeView, commonStyles.shadow]}>
          <Text style={commonStyles.Regular135}>
            {'Welcome, Dr. ' + firstname + ' ' + lastname}
          </Text>
          <Image
            style={styles.userImage}
            source={
              profileImgUrl &&
              (profileImgUrl != null || profileImgUrl.length > 0)
                ? {uri: profileImgUrl}
                : images.profileDummy1
            }></Image>
        </View>
      </View>
      <View>{children && children}</View>
    </View>
  );
};
const mapStateToProps = state => ({user: state.user.user});
export default connect(mapStateToProps)(HeaderDocInfo);
const styles = StyleSheet.create({
  welcomeView: {
    width: '90%',
    height: getCalculated(55),
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    borderRadius: 6,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  userImage: {
    width: getCalculated(41),
    height: getCalculated(41),
    borderRadius: 7,
    resizeMode: 'cover',
  },
});
