import React from 'react';
import { DeckSwiper, Card, CardItem, Body } from 'native-base';
import { Text, Title, WonderImage } from '../theme';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Proposal from '../../../types/proposal';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileImage from '../../../types/profile-image';

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
        <Card>
          <CardItem cardBody>
            {this.renderProfileImage(candidate.images)}
          </CardItem>
          <CardItem header>
            <Body>
              <Title>{[candidate.first_name, moment().diff(candidate.birthdate, 'years')].join(', ')}</Title>
              <Text>{candidate.location}</Text>
              <Text>{candidate.topics.map(topic => topic.name).join(', ')}</Text>
            </Body>
          </CardItem>
        </Card>
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
