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
import { connect } from 'react-redux';
import { commonStyles, COLORS } from '../../components/Common';
import Base from '../Base/Base';

class PatientMenu extends Base {
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


const STATE = state => ({ user: state.user.user });
export default connect(STATE)(PatientMenu);

const styles = StyleSheet.create({
});
