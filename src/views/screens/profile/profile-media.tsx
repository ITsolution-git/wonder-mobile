import React from 'react';
import Screen from '../../components/screen';
import ShadowBox from '../../components/theme/shadow-box';
import { MediaGrid } from '../../components/theme/media-grid';
import { TextArea, PrimaryButton } from '../../components/theme';
import { View,TouchableOpacity,Text, Alert } from 'react-native';
import theme, { Device } from '../../../assets/styles/theme';
import WonderAppState from '../../../types/wonder-app-state';
import User from '../../../types/user';
import { connect } from 'react-redux';

const mapState = (state: WonderAppState) => ({
  currentUser: state.user.profile
});

interface Props {
  currentUser: User;
}

class ProfileMediaScreen extends React.Component<Props> {

 

  render() {
    const { navigation,currentUser } = this.props;
    console.log('current user ',currentUser);
    return (
      <Screen horizontalPadding={20}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ShadowBox>
            <MediaGrid
              width={Device.WIDTH - 80}
              gutter={2}
              onNewPicture={() => navigation.navigate('ProfileCamera')}
              onNewVideo={() => navigation.navigate('ProfileVideo')}              
            />
            <TextArea
              label="About Me"
              placeholder="Take this time to describe yourself, life experience, hobbies, and anything else that makes you wonderful..."
            />
            <View style={{ marginTop: 10 }}>
              <PrimaryButton title="DONE" onPress={() => navigation.goBack()} />
            </View>
          
          </ShadowBox>
        </View>
      </Screen>
    );
  }
}

export default connect(mapState)(ProfileMediaScreen);