import React from "react";
import { View } from "react-native";
import { Text } from "src/views/components/theme";

const AgendaDayItem = ({ text }) => (
  <View
    style={{
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 15,
      minHeight: 100,
      maxHeight: 600,
      marginTop: 15
    }}
  >
    <Text>{text}</Text>
  </View>
);

export default AgendaDayItem;
