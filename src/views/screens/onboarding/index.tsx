import React from 'react';
import { View, StyleSheet, Dimensions, Image, Platform, Text } from 'react-native';
// import { Text } from 'src/views/components/theme';
import SwipeView from 'src/views/components/swipeview';
import Assets from 'src/assets/images';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { material } from 'react-native-typography';

import { Dispatch } from 'redux';
import WonderAppState from 'src/models/wonder-app-state';
import Theme from "../../../assets/styles/theme";
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const mapState = (state: WonderAppState) => ({});
const mapDispatch = (dispatch: Dispatch) => ({});
class Onboarding extends React.Component<Props> {

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <SwipeView
          onComplete={() => navigation.navigate('Register')}
          onSkip={() => navigation.navigate('Register')}
        >
          <SwipeView.Slide
            backgroundImage={Assets.ONBOARDING_1}
          >
            <View flex={1} />
            <View style={styles.halfCircleFooterContainer}>
              <View style={styles.halfCircleFooter}>
                <View style={{height: 24, alignItems: 'center', flexDirection: 'row'}}>
                <Text
                    style={[material.body1, styles.body, {marginRight: 2, marginLeft: 0}]}
                    allowFontScaling={false}
                >
                    Welcome to
                </Text>
                    <Image
                        source={Assets.Logo.DARK}
                        resizeMode="contain"
                        style={{ width: 90, marginBottom: 3 }}
                    />
                </View>
                <Text
                    style={[material.body1, styles.body]}
                    allowFontScaling={false}
                >
                  We make it easy to connect you with people that enjoy the activities that you do.
                </Text>
              </View>
            </View>
          </SwipeView.Slide>
          <SwipeView.Slide
            backgroundImage={Assets.ONBOARDING_2}
          >
            <View flex={1} />
            <View style={styles.halfCircleFooterContainer}>
              <View style={styles.halfCircleFooter}>
                <Text
                    style={[material.body1, styles.body]}
                    allowFontScaling={false}
                >
                    {'Browse, match, and chat\nwith people nearby.'}
                </Text>
              </View>
            </View>
          </SwipeView.Slide>
          <SwipeView.Slide
            backgroundImage={Assets.ONBOARDING_3}
          >
            <View flex={1} />
            <View style={styles.halfCircleFooterContainer}>
              <View style={styles.halfCircleFooter}>
                  <Text
                      style={[material.body1, styles.body]}
                      allowFontScaling={false}
                  >
                      View and schedule activities
                  </Text>
                  <View style={{height: 24, alignItems: 'center', flexDirection: 'row'}}>
                      <Text
                          style={[material.body1, styles.body, {marginRight: 2}]}
                          allowFontScaling={false}
                      >
                          with your
                      </Text>
                      <Image
                          source={Assets.Logo.DARK}
                          resizeMode="contain"
                          style={{ width: 90, marginBottom: 3 }}
                      />
                    <Text
                        style={[material.body1, styles.body, {marginLeft: 2}]}
                        allowFontScaling={false}
                    >
                      matches!
                    </Text>
                  </View>
              </View>
            </View>
          </SwipeView.Slide>
        </SwipeView>
      </View>
    );
  }
}

export default connect(mapState, mapDispatch)(Onboarding);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 5,
  },
  body: {
    marginLeft: '15%',
    marginRight: '15%',
    textAlign: 'center',
    fontSize: Platform.select({
      ios: () => 14,
      android: () => 15,
    })(),
    lineHeight: 24,
    letterSpacing: -0.1,
    fontWeight: '400',
  },
  halfCircleFooter: {
    width: Platform.select({
        ios: () => DEVICE_WIDTH,
        android: () => DEVICE_WIDTH * 0.77,
    })(),
    borderTopLeftRadius: DEVICE_WIDTH / 1.5,
    borderTopRightRadius: DEVICE_WIDTH / 1.5,
    overflow: 'hidden',
    transform: [{scaleX: 1.3}],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    height: DEVICE_HEIGHT * 0.45,
    minHeight: 280,
    maxHeight: 360,
    paddingTop: 45,
    paddingHorizontal: 25,
    alignItems: 'center'
  },
    halfCircleFooterContainer: {
      height: DEVICE_HEIGHT * 0.45,
      minHeight: 280,
      maxHeight: 320,
      paddingTop: Platform.select({
          ios: () => 55,
          android: () => 35,
      })(),
      paddingHorizontal: 25,
      width: DEVICE_WIDTH,
      overflow: 'hidden',
      alignItems: 'center'
  }
});
