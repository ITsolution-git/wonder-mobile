import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp } from "react-native";
import { Text } from '.';

interface Props {
  text: string;
  color?: string;
  onPress?: any;
  style?: StyleProp<any>;
}

export default class TextButton extends React.Component<Props> {
  render() {
    const { text, onPress, style } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.txt, style]}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  txt: {

  }
});