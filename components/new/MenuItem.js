import React from "react";
import { View, Text, StyleSheet, Dimensions, AsyncStorage } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withNavigation } from 'react-navigation';
import ThemeColors from '../../constants/ThemeColors';

const screen = Dimensions.get("screen");
const screenWidth = screen.width;
const smallScreen = screenWidth <= 320;


class MenuItem extends React.Component {

    constructor(props) {
        super(props);
        this.colors = ThemeColors(global.darkTheme);
        this.props = props;
        this.styles = this.getStyles();
    }

    startTest = category => {
        AsyncStorage.getItem('settings').then(data => {
            if (data) {
                if (JSON.parse(data).requestTicketNumber) {
                    this.props.navigation.navigate('Tickets', { category })
                } else {
                    this.props.navigation.navigate('TestNew', { category })
                }
            } else {
                this.props.navigation.navigate('TestNew', { category })
            }
        })
    }

    shouldComponentUpdate() {
        this.colors = ThemeColors(global.darkTheme);
        this.styles = this.getStyles();
        return true;
    }


    render() {
        return (
            <TouchableOpacity style={this.styles.item} onPress={() => this.startTest(this.props.category)} >
                <View style={{ marginTop: 15, marginLeft: 15 }}>{this.props.image}</View>
                <View style={{ zIndex: 3, width: screenWidth - 95, marginTop: 13 }}>
                    <Text style={this.styles.itemDescription}>{this.props.description}</Text>
                </View>
                <View style={{ zIndex: 2, position: 'absolute', left: screenWidth - 90 }}>
                    <Text style={this.styles.categoryLetter}>{this.props.category.substr(0, 1)}</Text>
                </View>
            </TouchableOpacity >
        );
    }

    getStyles = () => StyleSheet.create({
        item: {
            backgroundColor: this.colors.middleground,
            marginVertical: 4,
            flexDirection: "row",
            borderRadius: 10,
            height: smallScreen ? 55 : 65,
            marginHorizontal: 50,
            width: screenWidth - 30
        },
        itemDescription: {
            color: this.colors.text,
            paddingLeft: 15,
            fontSize: smallScreen ? 13 : 15,
            textAlignVertical: 'center'
        },
        categoryLetter: {
            marginTop: smallScreen ? -24 : -27,
            fontWeight: 'bold',
            fontFamily: 'monospace',
            fontSize: smallScreen ? 73 : 86,
            color: this.colors.category
        }
    })
}

export default withNavigation(MenuItem);