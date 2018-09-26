import React from "react";
import { View } from "react-native";
import { Text } from "src/views/components/theme";

export interface AgendaDayItemProps {
  date?: Date;
  text: string;
}
const AgendaDayItem: React.SFC<AgendaDayItemProps> = ({ date, text }) => (
  <View
    style={{
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 15,
      padding: 15,
      marginTop: 10,
      marginBottom: 5,
      minHeight: 50,
      elevation: 2
    }}
  >
    <Text>
      {text === null
        ? "Event" + " at " + date
        : text + " at " + date}
    </Text>
  </View>
);

export default AgendaDayItem;
