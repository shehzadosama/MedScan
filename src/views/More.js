import React from 'react';
import { View, Text, TextInput} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';

import * as global from '../global'
import {IconButton} from '../components/Buttons'

class More extends React.Component {
    code = '';
    state = {
        generatedCode: false,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {        
    }

    componentWillUnmount() {
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#666666", paddingTop: global.mainTopPadding}}>
                <View style={styles.header}>
                    <IconButton onPress={this.goback}
                    style={{...styles.headerButton}}
                    name="chevron-left" size={30} color="#00FF00"
                    />
                    <Text style={{color: "white", fontSize: 16}}>BarCode Generator</Text>
                    <IconButton onPress={this.share}
                    style={{marginLeft: "auto", marginRight: 0, ...styles.headerButton}}
                    name="share-alt" size={30} color="#00FF00"
                    />
                </View>
                <TextInput
                placeholder="Type text and press Enter"
                onChangeText={text => {this.code = text}}
                returnKeyType= 'done'
                onSubmitEditing={this.generateCode}
                style={{backgroundColor: "white", height: 40}}
                />
                <View style={styles.qrcodeContainer}>
                    {
                        this.state.generatedCode?
                        <QRCode
                        value={this.code}
                        getRef={(c) => (this.QRSvg = c)}
                        size={130}
                        color='black'
                        backgroundColor='white'/>
                        : null
                    }
                </View>
            </View>
        );
    }

    generateCode = (e) => {
        if (this.code == '') return;
        this.setState({generatedCode: true});
    }

    share = () => {
        this.QRSvg && this.QRSvg.toDataURL(async (data) => {
            let shareImageBase64 = {
                title: "Barcode Generated",
                url: "data:image/png;base64," + data,
                subject: "Share Barcode" //  for email
            };

            try {
                await Share.open(shareImageBase64);
            } catch (error) {
            //   alert(error.message);
            }
        });
    }

    goback = () => {
        this.props.navigation.goBack();
    }
}

const styles = {
    header: {
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        width: "100%",
        backgroundColor: "black",
    },
    headerButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center"
    },
    qrcodeContainer: {
        alignItems: 'center',
        justifyContent: "center",
        flex: 1,
    }

}

export default More;

