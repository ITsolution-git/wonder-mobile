import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, PrimaryButton } from '../../components/theme';
import theme from '../../../assets/styles/theme';
import Screen from '../../components/screen';
import Images, { Logo } from '../../../assets/images';
import TextButton from '../../components/theme/text-button';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

export default class Welcome extends React.Component<Props> {

  render() {
    const { navigation } = this.props;
    return (
      <Screen
        backgroundImage={Images.WELCOME}
      >
        <View flex={1} style={styles.header}>
          <Image style={{ width: '80%' }} source={Logo.DARK} resizeMode="contain" />
        </View>
        <View flex={1} style={styles.body}>
          <View style={{ width: '100%' }}>
            <PrimaryButton
              icon="envelope-o"
              title="CREATE ACCOUNT"
              onPress={() => navigation.navigate('Register1')}
              fullWidth
            />
          </View>
          <View style={{ marginTop: 10, width: '100%' }}>
            <Button
              rounded
              color="#3D90F0"
              icon="facebook"
              title="LOGIN WITH FACEBOOK"
              onPress={() => navigation.navigate('Login')}
              fullWidth
              style={{ backgroundColor: '#FFF' }}
            />
          </View>
          <View style={{ marginTop: 25 }}>
            <Text>Already have an account?</Text>
            <TextButton
              style={{ textAlign: 'center', color: theme.colors.primary }}
              text="Sign In"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
});