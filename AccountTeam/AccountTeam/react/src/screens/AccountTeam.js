import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import color from 'color'
import { ApolloProgress, Banner, useTheme } from 'apollo-react-native';
import { LOADING_STATUS, isIphone } from '../constants';
import { bootstrap, setInfoContainerVisible, setAppContainerHeight } from '../store/accountSlice/accountSlice'
import { setSortListVisibile } from '../store/sortSlice/sortListSlice'
import { Header } from '../components/Header/Header';
import { accountSelector } from '../store/accountSlice/accountSelector';
import { TeamList } from './components/TeamList';
import { PopOverView } from './components/PopOverView';


export const AccountTeam = ({ accountId }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [isNetworkAvailable, setIsNetWorkAvailable] = useState(true);
    const [isRecordIdAvailable, setIsRecordIdAvailable] = useState(accountId)
    const { loadingStatus, shouldShowDetailScreen } = useSelector(accountSelector);
    useEffect(() => {
        // NativeModules.ReachabilityBridge.networkReachabilityStatus().then(
        //     (networkStatusString) => {

        //         if (networkStatusString == "No Connection") {
        //             setIsNetWorkAvailable(false);
        //         }
        //     }

        // ).catch(
        //     (reason) => { }
        // );
        dispatch(bootstrap(accountId));
    }, [])
    const onDismissPopUps = () => {
        dispatch(setInfoContainerVisible(false))
        dispatch(setSortListVisibile(false));
    }
    const onDismissAlert = () => {
        setIsNetWorkAvailable(true);
    }

    const onDismissRecordTypeError = () => {
        setIsRecordIdAvailable(true);
    }

    const setLayout = useCallback(e => {
        dispatch(setAppContainerHeight(e.nativeEvent.layout.height));
    })

    const isBootstrapping = loadingStatus === LOADING_STATUS.BOOTSTRAPPING;
    const isPending = loadingStatus === LOADING_STATUS.PENDING;
    return (
        <View>
            <View style={[styles.container]} testID={'accountTeamComponent'} onLayout={setLayout} >
                <Banner
                    closeIcon
                    visible={!isNetworkAvailable}
                    variant={'error'}
                    icon={'alert'}
                    onCloseIconPress={() => onDismissAlert()}
                > Not connected to network</Banner>
                <Banner
                    closeIcon
                    visible={!isRecordIdAvailable}
                    variant={'error'}
                    icon={'alert'}
                    onCloseIconPress={() => onDismissRecordTypeError()}
                >Couldn't find the record ID</Banner>
                <TouchableWithoutFeedback onPress={onDismissPopUps} testID={'dismissPopup'}>
                    <View><Header /></View>
                </TouchableWithoutFeedback>

                <TeamList isBootstrapping={isBootstrapping} />
                {shouldShowDetailScreen && <PopOverView />}
            </View>
            {
                (isBootstrapping || isPending) && <View style={[styles.loader, {
                    backgroundColor: theme.dark
                        ? color(theme.colors.placeholder).darken(0.7).hex()
                        : theme.surface
                }]} testID={'loader-wrap'}>
                    <ApolloProgress />
                </View>
            }
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        padding: isIphone ? 10 : 15,
        flex: 1,
        flexBasis: '100%',
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
        zIndex: 10,
    }
});
