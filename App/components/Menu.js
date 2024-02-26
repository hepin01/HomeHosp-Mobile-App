import React from 'react';

import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { commonStyles, getCalculated, COLORS } from "./Common";
import Base from '../screens/Base/Base'
import images from '../assets/images';


export class Menu extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        const { image, title, style, menuAction } = this.props
        return (
            <View>
                <TouchableOpacity
                    style={[styles.buttonBgStyle, style]}
                    onPress={() => menuAction()}
                >
                    <Image style={styles.imageStyle} source={image} />
                    <Text style={[commonStyles.Regular155, styles.textStyle]}>{title}</Text>
                    <Image style={styles.arrowStyle} source={images.nextarrowblue} />
                </TouchableOpacity>
                <View style={styles.line} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonBgStyle: { width: '100%', flexDirection: 'row', height: 40, alignContent:'center'},
    imageStyle:{width:20, resizeMode:'contain', alignSelf:'center'},
    textStyle: { alignSelf: 'center', marginLeft:13, color:COLORS.BLUE},
    arrowStyle: { alignSelf: 'center', width: 6, height:11, position:'absolute', right:0},
    line: { width: '100%', backgroundColor: COLORS.SUPER_LIGHT_GRAY, height: 1, marginVertical: 5 }
})