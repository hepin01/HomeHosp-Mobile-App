/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import images from '../../../assets/images';
import {commonStyles, COLORS} from '../../../components/Common';
import {Menu} from '../../../components/Menu';
import { webview } from '../../../networking/Constats';
import { getWebViewUrl } from '../../../utiles/common';
import Base from '../../Base/Base';

class PaymentInsurance extends Base {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  redirectTowebView() {
    // profile/payment-info/
    const webviewUri = getWebViewUrl('profile/payment-info/');
    this.props.navigation.navigate(webview, {
      uri: webviewUri,
      title: 'Payment Information',
    });
  }
  render() {
    return (
      <View style={commonStyles.container}>
        <View style={styles.subContainer}>
          <Menu
            style={{marginTop: 20}}
            title={'Payment Information'}
            image={images.payment}
            menuAction={() => this.redirectTowebView()}
          />
          <Menu
            style={{marginTop: 7}}
            title={'Insurance'}
            image={images.insuranceicon}
            menuAction={() => {
              this.props.navigation.navigate('InsuranceDetails');
            }}
          />
        </View>
      </View>
    );
  }
}

export default PaymentInsurance;

const styles = StyleSheet.create({
  subContainer: {width: '90%'},
});
