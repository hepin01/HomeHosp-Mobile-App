/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import { commonStyles, COLORS } from '../../components/Common';
import Base from '../Base/Base';


class Menu extends Base {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
       // this.showLoader("Logging in")
    }

    render() {
        return (
            <View style={commonStyles.container}>
                {this.progressLoader()}
            </View>
        )
    }
};


export default Menu;

const styles = StyleSheet.create({
});
