import React from 'react';
import { View, FlatList, Text, Alert} from 'react-native';
import Share from 'react-native-share';
import Spinner from 'react-native-loading-spinner-overlay';
import Permissions from 'react-native-permissions'

import * as global from '../global';
import {IconButton} from '../components/Buttons'

class History extends React.Component {
    recordedCodeList = [];
    mounted = false;

    constructor(props) {
        super(props);
        this.state = {
            refresh: 0,
            loading: false,
        }

        this.recordedCodeList = global.getBarcodes().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        this.mounted && this.setState({refresh: this.state.refresh + 1});
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    share = async () => {
        if (this.recordedCodeList.length == 0) return;

        let message = this.recordedCodeList.length + ' Barcode(s) are scanned.\n';
        for (var i=0; i<this.recordedCodeList.length; i++) {
            message += Object.values(this.recordedCodeList[i]).join(global.getSetting().delimiter);
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

    _getLocation = () => {
        return new Promise(function(resolve, reject) {
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

    requestPermission= async (perm) => {
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

    shareLocation = () => {
        this.setState({loading: true});

        this.requestPermission('location').then(isPermitted => {
            if (isPermitted) {
                this._getLocation().then(async location => {
                    this.setState({loading: false});
                    if (!location) {
                        return;
                    }
        
                    try {
                        let message = {Lat: location.coords.latitude, Lon: location.coords.longitude}
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
                this.setState({loading: false});
                alert("Location Permission is not granted");
            }

        }).catch((e) => {
            console.log(e.message);
        });

    }

    deleteAll = () => {
        if (this.recordedCodeList.length == 0) return;

        Alert.alert(
            'Confirm Delete',
            'Are you sure to delete history?',
            [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
                  global.setBarcodes([]);
                  this.recordedCodeList = [];
                  this.setState({refresh: this.state.refresh + 1});
              }},
            ],
            {cancelable: false},
        );
    }

    _keyExtractor = (item, index) => index.toString()

    renderListItem = ({item, index}) => (
        <View style={styles.itemContainer}>
            <View style={styles.horizontal}>
                <Text style={{fontSize: 20}}>{item.code}</Text>
                <Text style={{fontSize: 10, marginLeft: "auto"}}>{item.detectionCount} time(s)</Text>
            </View>
            <View style={styles.horizontal}>
                {/* <Text>{item.latitude},{item.longitude}</Text> */}
                <Text style={{marginLeft: "auto", fontSize: 10}}>{item.timestamp}</Text>
            </View>
        </View>
    )

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white", paddingTop: global.mainTopPadding}}>
                <View style={styles.header}>
                    <IconButton onPress={this.goback}
                    style={{...styles.headerButton}}
                    name="chevron-left" size={30} color="#00FF00"
                    />

                    <Text style={{color: "white"}}>History ({this.recordedCodeList.length})</Text>
                    <IconButton onPress={this.share}
                    style={{marginLeft: "auto", marginRight: 0, ...styles.headerButton}}
                    name="share-alt" size={30} color="#00FF00"
                    />
                    <IconButton onPress={this.shareLocation}
                    style={styles.headerButton}
                    name="location-arrow" size={30} color="#00FF00"
                    />
                    <IconButton onPress={this.deleteAll}
                    style={styles.headerButton}
                    name="trash" size={30} color="#00FF00"
                    />
                </View>
                <FlatList
                    data={this.recordedCodeList}
                    extraData={this.state.refresh}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderListItem}
                />
                <Spinner visible={this.state.loading} overlayColor="#000000B2" style={{width: 40, height: 40, resizeMode: 'contain'}}/>
            </View>
        );
    }

    goback = () => {
        this.props.navigation.goBack();
    }

}

const styles = {
    overlayView: {
        position: "absolute", width: "100%", height: "100%"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        width: "100%",
        backgroundColor: "black"
    },
    headerButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center"
    },
    itemContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderBottomColor: "#AAAAAA",
        borderBottomWidth: 1,
    },
    horizontal: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%'
    }

}

export default History;

