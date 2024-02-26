import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Radio} from '../../../../components/Radio';
import Base from '../../../Base/Base';
import {
  COLORS,
  commonStyles,
  getCalculated,
} from '../../../../components/Common';
import {validateEnteredCharacters} from '../../../../utiles/validator';

export class QuesRadio extends Base {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      style,
      isChecked,
      question,
      yesSelected,
      reason,
      onChangeReason,
      showReason,
      yesTitle,
      noTitle,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={commonStyles.Medium135}>{question}</Text>
        <View style={styles.rowView}>
          <Radio
            isChecked={isChecked}
            title={yesTitle ?? 'Yes'}
            checkmarkAction={() => {
              yesSelected(true);
            }}
          />
          <Radio
            style={{marginLeft: 20}}
            isChecked={!isChecked}
            title={noTitle ?? 'No'}
            checkmarkAction={() => {
              yesSelected(false);
            }}
          />
        </View>
        {isChecked && showReason && (
          <View style={{}}>
            <Text style={styles.addDetailsTitle}>{'Add more details'}</Text>
            <View style={styles.textFiledBgViewStyle}>
              <TextInput
                style={styles.textFieldcustom}
                onChangeText={text => {
                  onChangeReason(validateEnteredCharacters(text));
                }}
                allowFontScaling={false}
                onSubmitEditing={() => {}}
                value={reason}
                placeholder="Enter details here"
                keyboardType="default"
                placeholderTextColor="#98a0ab"
                returnKeyType="next"
                autoCapitalize="sentences"
                maxLength={220}
                blurOnSubmit={false}
                numberOfLines={4}
                multiline={true}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {width: '100%', marginVertical: 10},
  rowView: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    alignSelf: 'center',
  },
  textFiledBgViewStyle: {
    height: 88,
    width: '100%',
    alignSelf: 'flex-start',
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1.2,
    borderRadius: 6,
    marginTop: 10,
  },
  textFieldcustom: {
    fontSize: getCalculated(13.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    padding: 10,
  },
  addDetailsTitle: {...commonStyles.RegularGrey135, marginTop: 15},
});
