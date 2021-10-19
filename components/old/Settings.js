import React from "react";
import { StyleSheet, Text, View, Switch, AsyncStorage } from "react-native";

export class Settings extends React.Component {
  state = {
    requestTicketNumber: false,
    requestAppExit: false,
    requestExamExit: true,
  };

  componentDidMount() {
    AsyncStorage.getItem("settings").then((data) =>
      this.setState(JSON.parse(data))
    );
  }

  componentDidUpdate() {
    AsyncStorage.setItem("settings", JSON.stringify(this.state));
  }

  render() {
    return (
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>
          Настройки
        </Text>

        <View style={styles.checkItem}>
          <Switch
            style={styles.checkbox}
            onValueChange={() =>
              this.setState((prevState) => ({
                requestTicketNumber: !prevState.requestTicketNumber,
              }))
            }
            value={this.state.requestTicketNumber}
          />
          <Text style={{ marginTop: 5, fontSize: 16 }}>
            Выбор номера билета
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Switch
            style={styles.checkbox}
            onValueChange={() =>
              this.setState((prevState) => ({
                requestExamExit: !prevState.requestExamExit,
              }))
            }
            value={this.state.requestExamExit}
          />
          <Text style={{ marginTop: 5, fontSize: 16 }}>
            Запрашивать подтверждение при выходе из экзамена
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Switch
            style={styles.checkbox}
            onValueChange={() =>
              this.setState((prevState) => ({
                requestAppExit: !prevState.requestAppExit,
              }))
            }
            value={this.state.requestAppExit}
          />
          <Text style={{ marginTop: 5, fontSize: 16 }}>
            Запрашивать подтверждение при выходе из приложения
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Switch
            style={styles.checkbox}
            onValueChange={() =>
              this.setState((prevState) => ({ oldStyle: !prevState.oldStyle }))
            }
            value={this.state.oldStyle}
          />
          <Text style={{ marginTop: 5, fontSize: 16 }}>Старый дизайн</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 6,
    marginRight: 5,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 15,
    width: 240,
    marginLeft: -40,
    height: 40,
  },
});
