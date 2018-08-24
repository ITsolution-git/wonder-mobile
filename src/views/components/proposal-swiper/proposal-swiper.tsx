import React from 'react';
import { DeckSwiper, Card, CardItem, Body } from 'native-base';
import { Text, Title, WonderImage, SubTitle, IconButton } from '../theme';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/FontAwesome';

import LinearGradient from 'react-native-linear-gradient';
import Wonder from '../theme/wonder/wonder';
import Proposal from 'src/models/proposal';
import ProfileImage from 'src/models/profile-image';

interface Props {
  proposal: Proposal | null;
  onSwipeLeft: Function;
  onSwipeRight: Function;
  onTap?: Function;
}

class ProposalSwiper extends React.Component<Props> {

  renderProfileImage = (images?: ProfileImage[]) => {
    if (images && images.length) {
      return (
        <View style={styles.noImageContainer}>
          <WonderImage
            style={{ width: '100%', height: '100%' }}
            uri={images[0].url}
            resizeMode="cover"

          />
        </View>
      );
    } else {
      return (
        <View style={styles.noImageContainer}>
          <Icon name="user" color="#CCC" size={100} />
        </View>
      );
    }
  }

  renderCard = (proposal: Proposal) => {
    const { onTap } = this.props;
    const { candidate } = proposal;

    const onPress = () => {
      if (onTap) {
        onTap(candidate);
      }
    };

    return (
      <TouchableOpacity onPress={onPress}>
        <WonderImage
          background
          uri={candidate.images[0].url}
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
              <IconButton size={44} icon="chevron-up" onPress={onPress} primary="#FFF" secondary="transparent" />
            </View>
          </LinearGradient>
        </WonderImage>
      </TouchableOpacity>
    );
  }

  render() {
    const { proposal, onSwipeLeft, onSwipeRight } = this.props;
    const data = [proposal];
    if (proposal) {
      return (
        <DeckSwiper
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          dataSource={data}
          renderItem={this.renderCard}
        />
      );
    }
    return (
      <View style={styles.noMatchesContainer}>
        <Title style={[styles.messageText, styles.titleText]}>Looks like you&apos;re out of people...</Title>
        <Text style={styles.messageText}>Check back soon!</Text>
      </View>
    );
  }
}

export default ProposalSwiper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EEE',
    justifyContent: 'flex-end',
    height: Dimensions.get('window').height - 60
  },
  textContainer: {
    padding: 20,
    flexDirection: 'row'
  },
  noMatchesContainer: {
    padding: 20,
    flex: 1,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    // alignItems: 'center'
  },
  titleText: {
    fontSize: 24
  },
  messageText: {
    textAlign: 'center'
  },
  noImageContainer: {
    flex: 1,
    height: 300,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
