import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Paragraph, IconButton } from 'apollo-react-native'
import { useSelector } from 'react-redux';
import { UserContext } from '../../../screens/MeetingsAttendeeList/MeetingAttendeeList'
import { NAMESPACE } from '../../../constants'


const UserDetails = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const contextData = React.useContext(UserContext);
    const { meetingDetails } = useSelector((state) => state.meeting);
    useEffect(() => {
        const { records } = meetingDetails[0][`${NAMESPACE}MeetingMember__r`];
        if (records) {
            const currentUserInfo = records.filter(record => record.Id === contextData);
            setCurrentUser(currentUserInfo[0]);
        }

    }, [contextData]);
    return (
        <View style={styles.userDetailsContainer}>
            <View>
                <IconButton
                    icon="pencil"
                    disabled={true}
                    color={"#000"}
                    size={18}
                />
            </View>
            <View>
                <Paragraph style={[styles.labelText]}>{currentUser ? currentUser.Name : ''}</Paragraph>
            </View>
        </View>
    )
};

export default UserDetails;

const styles = StyleSheet.create({
    userDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    labelText: {
        fontSize: 14,
        color: '#8D8D8D',
        marginTop: 0
    }
});