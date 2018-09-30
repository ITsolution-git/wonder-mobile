import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import theme from "src/assets/styles/theme";

type Props = { active: boolean; text: string; onPress: () => void };

export const StateButton = (props: Props) => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={{
        padding: 4,
        backgroundColor: props.active ? theme.colors.primary : "#fff",
        borderRadius: 40,
        width: 80,
        borderWidth: 1,
        borderColor: props.active ? "#fff" : theme.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        margin: 4
      }}
    >
      <Text style={{ color: props.active ? "#fff" : theme.colors.primary }}>
        {props.text}
      </Text>
    </TouchableHighlight>
  );
};

export default StateButton;
