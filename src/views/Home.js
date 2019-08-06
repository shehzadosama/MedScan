import React, {
    Component,
} from 'react'
import {
    View,
    Vibration,
    Text,
    Dimensions
} from 'react-native'

import Barcode from 'react-native-smart-barcode'
import TimerEnhance from 'react-native-smart-timer-enhance'
import Permissions from 'react-native-permissions'
import Spinner from 'react-native-loading-spinner-overlay';
import Share from 'react-native-share';

import { IconButton } from '../components/Buttons'
import * as global from '../global'
import moment from 'moment';
import { RNCamera } from 'react-native-camera';
// import Torch from 'react-native-torch';
// import RNBeep from 'react-native-a-beep';

const { height, width } = Dimensions.get('window');

const styles = {
    overlayView: {
        position: "absolute", width: "100%", height: "100%"
        , paddingTop: global.mainTopPadding
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        width: "100%",
        paddingHorizontal: 15,
    },
    headerButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center"
    },
    detection: {
        marginTop: 50,
        alignItems: "center",
        width: "100%",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
        width: "100%",
        marginTop: "auto",
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    cameraContainer: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0
    },
}

class Home extends Component {
    detection = {
        code: '',
        codeType: '',
        detectionCount: 0,
        latitude: 0,
        longitude: 0,
        timestamp: '',
    }


    constructor(props) {
        super(props);
        this.state = {
            viewAppear: false,
            detectedShow: false,
            loading: false,
        };

        this.requestPermissions(['camera', 'location']);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                {this.state.viewAppear ?
                    <Barcode style={{ flex: 1, }}
                        scannerLineInterval={0}
                        ref={component => this._barCode = component}
                        onBarCodeRead={this._onBarCodeRead} />

                    : null}
                <View style={styles.overlayView}>
                    <View style={styles.header}>
                        <Text style={{ color: "#00DD00", fontSize: 24 }}>
                            {global.strings.app_name_version}
                        </Text>
                    </View>
                    {
                        this.state.detectedShow ?
                            <View style={styles.detection}>
                                <View>
                                    <Text style={{ color: "white", fontSize: 14 }}>Scanned Code: {this.detection.code}</Text>
                                    <Text style={{ color: "white", fontSize: 14 }}>Type: {this.detection.codeType}</Text>
                                    <Text style={{ color: "white", fontSize: 14 }}>Timestamp: {this.detection.timestamp}</Text>
                                    {/* <Text style={{color: "white", fontSize: 14}}>Location: {this.detection.latitude},{this.detection.longitude}</Text> */}
                                </View>
                            </View> : null
                    }
                    <View style={styles.footer}>
                        <IconButton onPress={this.share}
                            style={{ marginRight: 0, ...styles.headerButton }}
                            name="share-alt" size={30} color="#00FF00"
                        />
                        <IconButton onPress={this.openHistory}
                            style={styles.headerButton}
                            name="bars" size={30} color="#00FF00" />
                        <IconButton onPress={this.shareLocation}
                            style={styles.headerButton}
                            name="location-arrow" size={30} color="#00FF00"
                        />

                        <IconButton onPress={this.openMore}
                            style={{ ...styles.headerButton }}
                            name="plus-square" size={30} color="#00FF00" />
                        <IconButton onPress={this.openConfiguration}
                            style={styles.headerButton}
                            name="gear" size={30} color="#00FF00" />
                    </View>
                </View>
                <Spinner visible={this.state.loading} overlayColor="#000000B2" style={{ width: 40, height: 40, resizeMode: 'contain' }} />
            </View>
        )
    }

    componentDidMount() {
        // Torch.switchState(true);
        RNCamera.Constants.FlashMode.torch

        let viewAppearCallBack = (event) => {
            this.setTimeout(() => {
                this.setState({
                    viewAppear: true,
                })
                if (this.state.detectedShow)
                    this._startScan();
            }, 255)

        }
        this._listeners = [
            this.props.navigation.addListener('willFocus', viewAppearCallBack)
        ]
    }

    componentWillUnmount() {
        this._listeners && this._listeners.forEach(listener => listener.remove());
        // this._onFocusListener.remove();
    }

    _onBarCodeRead = (e) => {
        // console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`)
        // RNBeep.beep()
        // RNBeep.PlaySysSound(RNBeep.AndroidSoundIDs.TONE_CDMA_ONE_MIN_BEEP)

        this._stopScan()
        Vibration.vibrate(200);
        this.detection = {
            code: e.nativeEvent.data.code,
            codeType: e.nativeEvent.data.type,
            timestamp: moment(e.timeStamp).format('YYYY-MM-DD hh:mm:ss'),
            // latitude: 0,
            // longitude: 0,
            detectionCount: 1,
        }

        this._showResult();
        // this.requestPermission('location').then(isPermitted => {
        //     if (isPermitted) {
        //         this._getLocation().then(location => {
        //             location && (this.detection.latitude = location.coords.latitude.toFixed(6), this.detection.longitude = location.coords.longitude.toFixed(6));
        //             this._showResult();
        //         });
        //     } else {
        //         alert("Location Permission is not granted");
        //         this._showResult();
        //     }

        // }).catch((e) => {
        //     console.log(e.message);
        // });
    }

    _startScan = (e) => {
        this.setState({ detectedShow: false });
        this._barCode.startScan()
    }

    _stopScan = (e) => {
        this._barCode.stopScan()
    }

    requestPermissions = async (perms) => {
        for (var i = 0; i < perms.length; i++) {
            await this.requestPermission(perms[i]);
        }
    }

    requestPermission = async (perm) => {
        try {
            let resp = await Permissions.check(perm);
            if (resp == 'authorized') return true;
            else if (resp == 'undetermined') {
                resp = await Permissions.request(perm);
                return resp == 'authorized';
            }
            else return false;

        } catch (error) {
            // console.log(error);
        }
        return false;
    }

    _getLocation = () => {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position);
                },
                (error) => {
                    alert(error.message)
                    resolve(undefined);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
            );
        });
    }

    _showResult = () => {
        let itemIdx = global.findItemWithKeyInArray("code", this.detection.code, global.getBarcodes());
        if (itemIdx == -1) {
            global.addBarcode(this.detection);
        } else {
            global.getBarcodes()[itemIdx].detectionCount += 1
            global.getBarcodes()[itemIdx].timestamp = this.detection.timestamp;
            // global.getBarcodes()[itemIdx].latitude = this.detection.latitude;
            // global.getBarcodes()[itemIdx].longitude = this.detection.longitude;
            global.setBarcodes(global.getBarcodes());
        }

        if (global.getSetting().batchScan)
            setTimeout(() => {
                this._startScan();
            }, 100);
        else {
            this.setState({ detectedShow: true });
        }
    }

    share = async () => {
        codes = global.getBarcodes().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        if (codes.length == 0) return;

        let message = codes.length + ' Barcode(s) are scanned.\n';
        for (var i = 0; i < codes.length; i++) {
            message += Object.values(codes[i]).join(global.getSetting().delimiter);
        }

        try {
            let shareBarcodes = {
                title: "Barcode Generated",
                message: message,
                subject: "Share Barcode" //  for email
            };

            await Share.open(shareBarcodes);
        } catch (error) {

        }
    }

    shareLocation = () => {
        this.setState({ loading: true });

        this.requestPermission('location').then(isPermitted => {
            if (isPermitted) {
                this._getLocation().then(async location => {
                    this.setState({ loading: false });
                    if (!location) {
                        return;
                    }

                    try {
                        let message = { Lat: location.coords.latitude, Lon: location.coords.longitude }
                        message = Object.values(message).join(global.getSetting().delimiter);
                        await Share.open({
                            title: "Share Location",
                            message: message,
                            subject: "Share Location",
                        });
                    } catch (e) {
                        alert(e.message)
                    }
                });
            } else {
                this.setState({ loading: false });
                alert("Location Permission is not granted");
            }

        }).catch((e) => {
            console.log(e.message);
        });

    }

    openConfiguration = () => {
        this.props.navigation.navigate("Config");
    }

    openHistory = () => {
        this.props.navigation.navigate("History");
    }

    openMore = () => {
        this.props.navigation.navigate("More");
    }
}

export default TimerEnhance(Home)