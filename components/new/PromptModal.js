import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { withNavigation } from 'react-navigation';
import ThemeColors from '../../constants/ThemeColors';

class PromptModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.colors = ThemeColors(global.appSettings.darkTheme);
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
            width: global.screenWidth,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            fontSize: global.smallScreen ? 18 : 22,
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
            height: global.smallScreen ? 38 : 45,
            width: global.smallScreen ? 130 : 160,
            borderRadius: 10,
            marginHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'center'
        },
        label: {
            color: this.colors.text,
            textAlign: 'center',
            fontSize: global.smallScreen ? 14 : 17
        }
    })
}

export default withNavigation(PromptModal);
