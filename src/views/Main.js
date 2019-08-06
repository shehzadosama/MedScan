import React from 'react';
import { View, FlatList, Text, Alert, Button, Dimensions } from 'react-native';
import { IconButton } from '../components/Buttons'
import * as global from '../global'

const { height, width } = Dimensions.get('window');

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
    openConfiguration = () => {
        this.props.navigation.navigate("Config");
    }

    openHistory = () => {
        this.props.navigation.navigate("History");
    }

    openMore = () => {
        this.props.navigation.navigate("More");
    }
    render() {
        return (

            <View style={styles.mainCont}>
                <Text style={{ color: 'red', fontSize: 20, marginBottom: 40 }}>MedMovel v.1.01b</Text>
                <View
                    style={styles.btnCont}>
                    <Button
                        onPress={() => { }}
                        title="Med Dia Feliz"
                        // color="#841584"
                        color="black"
                        accessibilityLabel="Learn more about this purple button"
                        transparent
                    >
                    </Button>
                </View>
                <View
                    style={styles.btnCont}>
                    <Button
                        onPress={() => { }}
                        title="Check-in"
                        color="#841584"
                        color="black"
                        accessibilityLabel="Learn more about this purple button">
                    </Button>
                </View>
                <View
                    style={styles.btnCont}>
                    <Button
                        onPress={() => { this.props.navigation.navigate("Home"); }}
                        title="Medscanner"
                        color="#841584"
                        color="black"
                        accessibilityLabel="Learn more about this purple button">

                    </Button>
                </View>
                <View
                    style={styles.btnCont}>
                    <Button
                        onPress={() => { }}
                        title="Linha Foneclube"
                        color="#841584"
                        color="black"
                        accessibilityLabel="Learn more about this purple button">

                    </Button>
                </View>

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
        )
    }
}

export default Main;

const styles = {
    mainCont:
    {
        backgroundColor: 'black',
        height: height * 0.98,
        width,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        borderColor: 'white'
    },
    btnCont: {
        height: height * 0.10,
        width: width * 0.40,
        marginTop: 10,
        borderWidth: 2,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },


    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
        width: "100%",
        // marginTop: "auto",
        // marginTop:20,
        position: 'absolute',
        bottom: 5,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
}