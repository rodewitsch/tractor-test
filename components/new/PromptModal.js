import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { withNavigation } from 'react-navigation';
import ThemeColors from '../../constants/ThemeColors';

const screen = Dimensions.get("screen");
const screenWidth = screen.width;
const smallScreen = screenWidth <= 320;


class PromptModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.colors = ThemeColors(global.darkTheme);
        this.styles = this.getStyles();
    }

    render() {
        return (
            <View style={this.styles.container}>
                <Text style={this.styles.title}>{this.props.title}</Text>
                <View style={this.styles.buttonsArea}>
                    <TouchableOpacity onPress={this.props.cancel} style={this.styles.button}>
                        <Text style={this.styles.label}>{this.props.cancelButton}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.success} style={this.styles.button}>
                        <Text style={this.styles.label}>{this.props.successButton}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    getStyles = () => StyleSheet.create({
        container: {
            backgroundColor: this.colors.background,
            height: '100%',
            width: screenWidth,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            fontSize: smallScreen ? 18 : 22,
            color: this.colors.text,
            textAlign: 'center'
        },
        buttonsArea: {
            backgroundColor: this.colors.background,
            display: 'flex',
            flexDirection: 'row',
            marginTop: 25
        },
        button: {
            display: 'flex',
            backgroundColor: this.colors.middleground,
            height: smallScreen ? 38 : 45,
            width: smallScreen ? 130 : 160,
            borderRadius: 10,
            marginHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'center'
        },
        label: {
            color: this.colors.text,
            textAlign: 'center',
            fontSize: smallScreen ? 14 : 17
        }
    })
}

export default withNavigation(PromptModal);
