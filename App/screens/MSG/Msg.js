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

class Msg extends Base {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() { }

    render() {
        return (
            <View style={commonStyles.container}>
             
            </View>
        )
    }
};


export default Msg;

const styles = StyleSheet.create({
});
