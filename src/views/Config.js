import React from 'react';
import { View, Text, ScrollView, TextInput, Switch} from 'react-native';

import * as global from '../global';
import {IconButton} from '../components/Buttons'

class Config extends React.Component {
    state = {
        batchScan: global.getSetting().batchScan,
        delimiter: global.getSetting().delimiter,
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
            <View style={{flex: 1, backgroundColor: "white", paddingTop: global.mainTopPadding}}>
                <View style={styles.header}>
                    <IconButton onPress={this.goback}
                    style={{...styles.headerButton}}
                    name="chevron-left" size={30} color="#00FF00"
                    />
                    <Text style={{color: "white"}}>Configuration</Text>
                    <Text style={{marginLeft: "auto", marginRight: 20, color: "#00DD00", fontSize: 24}}>{global.strings.app_name_version}</Text>
                </View>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.itemContainer}>
                        <Text>Batchscan Mode</Text>
                        <Switch value={this.state.batchScan}
                        onValueChange={val => this.setBatchMode(val)}
                        style={{marginLeft: "auto", marginRight: 0}}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Text>Delimiter</Text>
                        <TextInput value={this.state.delimiter}
                        placeholder="Delimiter"
                        style={{marginLeft: "auto", marginRight: 0, borderWidth: 1, borderColor: "#AAAAAA", height: 30, width: 60, paddingVertical: 0}}
                        onChangeText={text => this.setDelimiter(text)}/>
                    </View>
                </ScrollView>
            </View>
        );
    }

    goback = () => {
        this.props.navigation.goBack();
    }

    setBatchMode = (val) => {
        this.setState({batchScan: val});
        global.setOneSetting("batchScan", val);
    }

    setDelimiter = (text) => {
        this.setState({delimiter: text});
        global.setOneSetting("delimiter", text);
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
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomColor: "#AAAAAA",
        borderBottomWidth: 1,
    },
}

export default Config;

