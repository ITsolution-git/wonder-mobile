import React from 'react';
import { View, Text, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { PrimaryButton, RoundedTextInput } from '../theme';
import theme from '../../../assets/styles/theme';
import TouchableOpacityOnPress from '../../../models/touchable-on-press';
import { IconButton, TextButton } from '../../components/theme';

interface Props {
  visible: boolean;
  onRequestClose: Function;
  getRef: Function;
  onChangeText: (text: string) => void;
  errorHint: string | undefined;
  submit: Function;
  onPress?: TouchableOpacityOnPress;
}

const ForgotPasswordModal = (props: Props) => {
  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={props.visible}
      onRequestClose={() => props.onRequestClose}
    >
      <View style={styles.container}>
        <Text style={styles.descriptionText}>Having trouble logging in?</Text>
        <Text style={styles.largeText}>We can help!</Text>
        <Text style={styles.actionText}>
          Enter your email address to contact support
        </Text>
        <RoundedTextInput
          returnKeyType='next'
          getRef={props.getRef}
          autoCapitalize='none'
          autoCorrect={false}
          icon='envelope-o'
          placeholder='Email'
          onChangeText={props.onChangeText}
          fullWidth
          errorHint={props.errorHint}
        />

        <PrimaryButton title='Send' onPress={props.submit} />
        <View style={{ marginTop: 20 }}>
          <TextButton text='Cancel' onPress={props.onRequestClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    marginTop: 60
  },
  descriptionText: {
    fontSize: 15,
    color: theme.colors.textColor,
    textAlign: 'left'
  },
  largeText: {
    fontSize: 26,
    color: theme.colors.textColor,
    textAlign: 'left'
  },
  actionText: {
    fontSize: 15,
    color: theme.colors.textColor,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30
  }
});
