import React from 'react';
import FileViewer from 'react-native-file-viewer';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import images from '../../../assets/images';
import {COLORS, commonStyles, getCalculated} from '../../../components/Common';
import ImageLoader from '../../../components/ImageLoader';
import {downloadFileFromUrl} from '../../../utiles/DownloadFile';

const DocumentCell = props => {
  const {
    data: {uri, name, isNew, },
    data,
    onDelete,
    onPressView,
    disabled = false,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        {/* <Image style={styles.imageLogo} source={{uri: data.uri}} /> */}
        <ImageLoader
          style={styles.imageLogo}
          url={{uri: uri}}
          placeholder={images.logopart}
        />
        <View style={styles.textView}>
          <Text
            style={[
              commonStyles.RegularDark11,
              {alignSelf: 'flex-start', textAlignVertical: 'center'},
            ]}>
            {name || data?.title}
          </Text>
        </View>
      </View>
      <View style={styles.notVerifiedview}>
        {!!onPressView && !uri?.includes('file:') ? (
          <TouchableOpacity
            onPress={() => {
                onPressView(uri || data?.tmpNameUrl, name || data?.title);
            }}>
            <Image style={styles.editIcon} source={images.viewcircle} />
          </TouchableOpacity>
        ) : null}

        {!!onDelete && !disabled ? (
          <TouchableOpacity
            onPress={() => {
              onDelete(data);
            }}>
            <Image style={styles.editIcon} source={images.deletecircle} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default React.memo(DocumentCell);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: getCalculated(5),
    overflow: 'hidden',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textView: {
    width: '80%',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  imageLogo: {
    width: getCalculated(60),
    height: getCalculated(40),
    resizeMode: 'contain',
  },
  descStyle: {marginTop: 10},
  editIcon: {
    width: getCalculated(26),
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginHorizontal: 5,
  },
  actionButtons: {alignSelf: 'flex-start', marginTop: -10},
  notVerifiedview: {
    borderBottomRadius: getCalculated(5),
    borderTopColor: COLORS.SUPER_LIGHT_GRAY,
    borderTopWidth: 1,
    width: '100%',
    alignSelf: 'center',
    height: 45,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
    paddingHorizontal: getCalculated(15),
  },
  notVerifiedlogo: {
    width: getCalculated(15),
    resizeMode: 'contain',
    marginHorizontal: getCalculated(10),
  },
});
