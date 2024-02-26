import React, {Component} from 'react';

import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Platform,
  Text,
  Button,
  Keyboard,
} from 'react-native';
import {getCalculated, COLORS, commonStyles} from './Common';
import Base from '../screens/Base/Base';
import Akira from './Akira';
import AkiraNormal from './AkiraNormal';
import {InputAccessoryView} from 'react-native';

export class TextFieldComponent extends Base {
  constructor(props) {
    super(props);
  }

  focus = () => {
    this.refs.input.focus();
  };

  render() {
    const {error, errorMessage} = this.props;
    return (
      <View
        ref="container"
        style={Object.assign(
          {},
          styles.textFiledBgViewStyle,
          this.props.style,
        )}>
        <AkiraNormal
          ref="input"
          inputAccessoryViewID={"txtDismiss"}
          label={this.props.placeholder}
          labelStyle={[styles.labelStyle, this.props.labelStyle]}
          inputPadding={this.props.inputPadding || 10}
          labelHeight={25}
          allowFontScaling={false}
          value={this.props.value}
          editable={this.props.editable}
          textError={"this.props.textError"}
          Regular125={[styles.textFieldcustom, this.props.Regular125]}
          // this is used to set backgroundColor of label mask.
          // please pass the backgroundColor of your TextInput container.
          textContentType={this.props.textContentType}
          keyboardType={this.props.keyboardType || 'default'}
          returnKeyType={this.props.returnKeyType}
          autoCapitalize={
            Platform.OS == 'android' && this.props.autoCapitalize == 'words'
              ? 'sentences'
              : this.props.autoCapitalize || 'none'
          }
          blurOnSubmit={this.props.blurOnSubmit}
          maxLength={this.props.maxLength}
          selectTextOnFocus={true}
          onSubmitEditing={this.props.onSubmitEditing}
          onFocus={this.props.onFocus}
          autoCorrect={false}
          onChangeText={this.props.onChangeText}
          clearButtonMode={this.props.clearButtonMode || 'never'}
          secureTextEntry={this.props.secureTextEntry}
          spellCheck={this.props.spellCheck || false}
          onBlur={this.props.onBlur}
          normalColor={this.props.normalColor}
          auto
        />
        {Platform.OS === 'ios' && (
          <InputAccessoryView nativeID={'txtDismiss'}>
            <View style={styles.inputAccessory}>
              <Button
                onPress={() => {
                  Keyboard.dismiss();
                }}
                title="Done"
              />
            </View>
          </InputAccessoryView>
        )}
        {error && errorMessage ? (
          <View style={{marginVertical: getCalculated(5)}}>
            <Text style={commonStyles.Regular11Red}>{errorMessage}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  textFiledBgViewStyle: {
    height: getCalculated(60),
    marginHorizontal: getCalculated(15),
    width: 'auto',
    marginBottom: getCalculated(-20),
  },
  textFieldcustom: {
    fontSize: getCalculated(15.5),
    textAlignVertical: 'center',
    color: COLORS.DARK_GRAY,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
  },
  labelStyle: {
    alignSelf: 'flex-start',
    marginLeft: 7,
    color: '#98a0ab',
    fontFamily: 'Roboto-Regular',
    fontSize: getCalculated(12),
  },
  inputAccessory: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
  }
});
