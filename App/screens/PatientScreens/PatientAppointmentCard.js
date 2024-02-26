import { Dimensions, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import ReactNativeModal from 'react-native-modal';
import moment from 'moment';
import ImageLoader from '../../components/ImageLoader';
import images from '../../assets/images';
import { COLORS, commonStyles, getCalculated } from '../../components/Common';

const PatientAppointmentCard = ({
    item,
    status,
    profileImageS3Link,
    sessionType,
    startDate,
    firstname,
    lastname,
    genderLetter,
    onPress,
    city,
    appointmentType
}) => {
    return (
        <TouchableOpacity
            style={{
                paddingHorizontal: getCalculated(5),
                alignSelf: 'center',
                width: Dimensions.get('screen').width / 1.08,
            }}
            onPress={() => onPress()}>
            <View
                style={[
                    styles.shadow,
                ]}>
                <View style={[styles.patientMainView]}>
                    <View style={{ borderRadius: 10, justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
                        <ImageLoader
                            style={styles.userImage}
                            url={{ uri: profileImageS3Link }}
                            placeholder={images.userdefault}
                        />
                    </View>
                    <View>
                        {status !== 6 && (<View style={[styles.statusbg, {
                            backgroundColor: status == 0 ? COLORS.PURPLEBG :
                                status == 1 ? COLORS.YELLOWBG :
                                    status == 2 ? COLORS.GREENBG :
                                        status == 3 ? COLORS.REDBG :
                                            status == 4 ? COLORS.GREENBG :
                                                status == 5 ? COLORS.GRAYBG :
                                                    null
                        }]}>
                            {item?.instant && (
                                <Image
                                    style={styles.instantIcon}
                                    source={images.instanticon}
                                />
                            )}
                            <Text
                                style={[
                                    commonStyles.RegularLight11,
                                    {
                                        color: status == 0
                                            ? COLORS.PURPLE
                                            : status == 1
                                                ? COLORS.Orange
                                                : status == 2 || status == 4
                                                    ? COLORS.GREEN
                                                    : status == 3
                                                        ? COLORS.RED
                                                        : COLORS.LIGHTER_GREY,
                                    },
                                ]}>
                                {status == 0 ? 'Upcoming' : null}
                                {status == 1 ? 'Pending' : null}
                                {status == 2 ? 'Accepted' : null}
                                {status == 3 ? 'Cancelled' : null}
                                {status == 4 ? 'Completed' : null}
                                {status == 5 ? 'Paid/Unpaid' : null}
                                {/* {status == 6 ? 'No show' : null} */}
                            </Text>
                        </View>)}

                        {sessionType == 'telephonic' && (
                            <View style={styles.audioIconBg}>
                                <Image
                                    style={styles.audioIcon}
                                    source={images.audio}
                                />
                            </View>
                        )}
                        {sessionType == 'video' && (
                            <View style={styles.audioIconBg}>
                                <Image
                                    style={styles.audioIcon}
                                    source={images.video}
                                />
                            </View>
                        )}
                    </View>
                </View>
                <View >
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 15,
                            // paddingBottom: 10,
                        }}>
                        <Text style={commonStyles.Medium18}>
                            Dr. {firstname + ' ' + lastname}
                            <Text style={commonStyles.Regular115Blue}>
                                {item?.patient?.miniSurveyForm?.dob
                                    ? genderLetter +
                                    '(' +
                                    moment().diff(
                                        item?.patient?.miniSurveyForm?.dob,
                                        'years',
                                    ) +
                                    ')'
                                    : ''}
                            </Text>
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            // marginTop: 2,
                            width: '100%',
                            paddingHorizontal: 15,
                            paddingVertical: 7
                        }}>
                        <Image
                            style={styles.locationIcon}
                            source={images.locationBig}
                        />
                        <Text
                            style={[
                                commonStyles.RegularLight11,
                                { marginLeft: 5 },
                            ]}>
                            {city}
                        </Text>
                    </View>
                    <View style={styles.bottonLine}>

                        <View
                            style={{ width: Platform.OS == 'ios' ? '80%' : '70%', flexDirection: "row" }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    // marginTop: 2,
                                    width: '50%',
                                    alignItems: "center"
                                    // paddingHorizontal: 15,
                                    // paddingVertical: 7
                                }}>
                                <Image
                                    style={styles.locationIcon}
                                    source={images.calendar}
                                />
                                <Text
                                    style={[
                                        commonStyles.RegularLight11,
                                        { marginTop: 10, marginLeft: 5, color: COLORS.BLUE },
                                    ]}>
                                    {appointmentType}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    marginTop: 2,
                                    width: Platform.OS == 'ios' ? '75%' : '75%',
                                }}>
                                <Text style={[commonStyles.BoldLight11, { color: COLORS.BLUE }]}>
                                    {moment(startDate).format('hh:mm A') + ',\n'}
                                </Text>
                                <Text style={[commonStyles.RegularLight11, { color: COLORS.BLUE }]}>
                                    {moment(startDate).format('dddd, MMMM DD, YYYY')}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity >
    );
};

export default PatientAppointmentCard;

const styles = StyleSheet.create({
    shadow: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.BORDERBG,
        // elevation: 5,
    },
    patientMainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: getCalculated(5),
        paddingRight: 10,
        paddingTop: 10
    },
    userImage: {
        width: getCalculated(41),
        height: getCalculated(41),
        borderRadius: 40,
    },

    instantIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        alignSelf: 'center',
        // marginTop: -2,
        // marginLeft: 10,
    },
    audioIconBg: {
        alignSelf: "flex-end",
        borderRadius: 4,
    },
    locationIcon: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    audioIcon: { width: 18, height: 18, resizeMode: 'contain' },
    statusbg: {
        marginTop: 2, paddingHorizontal: 10, paddingVertical: 5,
        marginBottom: 10, borderRadius: 5, flexDirection: "row",
        alignItems: "center", justifyContent: "center"
    },
    bottonLine: {
        backgroundColor: COLORS.BLURBG,
        width: "100%", paddingVertical: 5, paddingHorizontal: 15, borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    }
});
