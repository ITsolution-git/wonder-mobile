import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, PrimaryButton } from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import Screen from 'src/views/components/screen';
import Images, { Logo } from 'src/assets/images';
import TextButton from 'src/views/components/theme/text-button';
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
        <View style={styles.body}>
          <View>
            <PrimaryButton
              icon="envelope-o"
              title="CREATE ACCOUNT"
              onPress={() => navigation.navigate('Register1')}
            />
            <Button
              rounded
              color="#3D90F0"
              icon="facebook"
              title="LOGIN WITH FACEBOOK"
              onPress={() => navigation.navigate('Login')}
              fullWidth
              style={{ backgroundColor: '#FFF', marginTop: 10 }}
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
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
});