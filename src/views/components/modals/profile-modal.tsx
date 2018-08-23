import _ from 'lodash';
import React from 'react';
import { Modal, View, ModalProps, StyleSheet, Platform } from 'react-native';
import { IconButton, Text, Title, Label, SubTitle, WonderImage } from '../theme';

import moment from 'moment-timezone';
import LinearGradient from 'react-native-linear-gradient';

import Wonder from '../theme/wonder/wonder';
import Candidate from 'src/models/candidate';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';
import Topic from 'src/models/topic';

interface Props extends ModalProps {
  candidate?: Candidate | null;
  onCancel?: TouchableOpacityOnPress;
  onSuccess?: Function;
}

class ProfileModal extends React.Component<Props> {

  renderContent = () => {
    const { candidate, onCancel } = this.props;
    if (candidate) {
      return (
        <WonderImage
          background
          uri={_.get(candidate, 'images[0].url')}
          style={styles.container}
        >
          <LinearGradient
            style={styles.textContainer}
            colors={['transparent', 'rgb(22,22,22)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.3]}
          >
            <View>
              <Title style={{ fontSize: 24 }} color="#FFF">
                {[candidate.first_name, moment().diff(candidate.birthdate, 'years')].join(', ')}
              </Title>
              <SubTitle style={{ fontSize: 16 }} color="#FFF">{'Los Angelas, CA'}</SubTitle>
              <View style={{ flexDirection: 'row' }}>
                {candidate.topics && candidate.topics.map((topic: Topic) => (
                  <Wonder
                    key={topic.name}
                    topic={topic}
                    size={60}
                  />
                ))}
              </View>
              <Text color="#FFF">{candidate.occupation} - {candidate.school}</Text>
              {candidate.about && <Text color="#FFF">{candidate.about}</Text>}
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
              <IconButton size={44} icon="chevron-down" onPress={onCancel} primary="#FFF" secondary="transparent" />
            </View>
          </LinearGradient>
        </WonderImage>
      );
    }

    return null;
  }

  render() {
    const { candidate, onCancel, onSuccess, onRequestClose, ...rest } = this.props;
    return (
      <Modal
        onRequestClose={onRequestClose}
        {...rest}
      >
        <View flex={1}>
          {this.renderContent()}
        </View>
      </Modal>
    );
  }
}

export default ProfileModal;

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.select({ ios: 20, android: 0 }),
    height: 44,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EEE',
    justifyContent: 'flex-end'
  },
  textContainer: {
    padding: 20,
    flexDirection: 'row'
  },
  footer: {
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
