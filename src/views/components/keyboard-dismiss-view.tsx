import React, { ReactChildren } from 'react';
import { Keyboard, TouchableWithoutFeedback, View, StyleProp, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  children: any;
}

export class KeyboardDismissView extends React.Component<Props> {
  render() {
    const { children, style } = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
