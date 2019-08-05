import React from 'react'

import {
    Image, Text, StyleSheet, TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

export class TextButton extends React.Component {
    constructor(props) {
        super(props);
    }

    // Initialize the states

    componentDidMount() {
    }

    render() {

        return (
            <TouchableOpacity
            disabled={this.props.disabled}
            style={[TextButtonStyles.container, this.props.style]}
            onPress={this.props.onPress}>
                <Text style={{paddingBottom: 0, ...this.props.textStyle}}>{this.props.text}</Text>
            </TouchableOpacity>
        );
    }
};

export class IconButton extends React.Component {
    constructor(props) {
        super(props);
    }

    // Initialize the states

    componentDidMount() {
    }

    render() {

        return (
            <TouchableOpacity
            disabled={this.props.disabled}
            style={[TextButtonStyles.container, this.props.style]}
            onPress={this.props.onPress}>
                <Icon name={this.props.name} size={this.props.size} color={this.props.color}/>
            </TouchableOpacity>
        );
    }
};

const TextButtonStyles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center"
    },
});

