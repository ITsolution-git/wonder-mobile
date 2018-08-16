import React from 'react';
import Screen from '../../components/screen';
import ShadowBox from '../../components/theme/shadow-box';
import { MediaGrid } from '../../components/theme/media-grid';
import { TextArea, PrimaryButton } from '../../components/theme';
import { View } from 'react-native';
import theme, { Device } from '../../../assets/styles/theme';

class ProfileMediaScreen extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <Screen horizontalPadding={20}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ShadowBox>
            <MediaGrid
              width={Device.WIDTH - 80}
              gutter={2}
              onNewPicture={() => navigation.navigate('ProfileCamera')}
            />
            <TextArea
              label="About Me"
              placeholder="Take this time to describe yourself, life experience, hobbies, and anything else that makes you wonderful..."
              maxLength={200}
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

export default ProfileMediaScreen;