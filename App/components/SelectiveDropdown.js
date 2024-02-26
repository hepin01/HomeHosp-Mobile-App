import React from 'react';

import {StyleSheet, View, Image, Platform, Text} from 'react-native';
import {getCalculated, COLORS, commonStyles} from './Common';
import Base from '../screens/Base/Base';
import images from '../assets/images';
import SelectDropdown from 'react-native-select-dropdown';

export class SelectiveDropdown extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      value,
      list,
      onSelect,
      selectedItem,
      error,
      errorMessage,
      getRef,
    } = this.props;
    return (
      <View style={[styles.dropdownView, this.props.style]}>
        <SelectDropdown
          data={list}
          ref={ref => getRef && getRef(ref)}
          onSelect={(selectedItem, index) => {
            onSelect(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          renderDropdownIcon={(selectedItem, index) => (
            <Image
              style={commonStyles.dropArrowStyle}
              source={images.arrowdowngray}
            />
          )}
          buttonStyle={styles.ddBtnStyle}
          buttonTextStyle={styles.btnTxtStyle(
            value && value.length > 0 && !value?.includes('Select'),
          )}
          dropdownIconPosition="right"
          defaultButtonText={value}
          dropdownStyle={styles.ddStyle}
          rowStyle={{alignItems: 'flex-start'}}
          rowTextStyle={[commonStyles.Regular135, styles.rowTxtStyle]}
          //numberOfLines={2}
          {...this.props}
        />
        {error && errorMessage ? (
          <View
            style={{marginVertical: getCalculated(5), alignSelf: 'flex-start'}}>
            <Text style={commonStyles.Regular11Red}>{errorMessage}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dropdownView: {
    marginTop: 5,
    borderRadius: 6,
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1,
    alignSelf: 'center',
    height: getCalculated(40),
    // width: '91%',
    alignItems: 'center',
  },
  rowTxtStyle: {textAlign: 'left', alignSelf: 'center'},
  btnTxtStyle: hasLength => ({
    fontSize: getCalculated(14.5),
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    marginLeft: 0,
    color: hasLength ? COLORS.DARK_GRAY : COLORS.LIGHTER_GREY,
  }),
  ddBtnStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    alignSelf: 'center',
  },
  ddStyle: {width: '90%', borderRadius: 6, marginTop: -4},
  dropdownArrowStyle: {
    alignSelf: 'center',
    width: 11,
    height: 6,
    marginRight: 5,
  },
});
