import { withNavigation } from "react-navigation";
import React from "react";
import { View, TouchableOpacity, Text, Switch, StyleSheet } from "react-native";
import ThemeColors from '../../constants/ThemeColors';
import gs from '../../styles/global';

class SettingsItem extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.colors = ThemeColors(global.appSettings.darkTheme);
        this.styles = this.getStyles();
    }

    shouldComponentUpdate = () => {
        this.colors = ThemeColors(global.appSettings.darkTheme);
        this.styles = this.getStyles();
        return true;
    }

    render = () => (
        <View style={{ ...gs.flexRow, justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={this.props.onPress} style={{ width: '85%' }}>
                <Text style={this.styles.settingLabel}>{this.props.title}</Text>
            </TouchableOpacity>
            <Switch
                style={this.styles.checkbox}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={this.props.value ? "#579DD0" : "#f4f3f4"}
                onValueChange={this.props.onPress}
                value={this.props.value}
            />
        </View>
    )


    getStyles = () => StyleSheet.create({
        settingLabel: {
            color: this.colors.text,
            fontSize: global.smallScreen ? 13 : 15,
            marginTop: 15
        },
        checkbox: {
            marginTop: 15,
            marginRight: 5
        }
    });
}

export default withNavigation(SettingsItem);