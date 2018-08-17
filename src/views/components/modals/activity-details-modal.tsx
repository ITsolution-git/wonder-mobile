import React from 'react';
import { Modal, View, ModalProps, StyleSheet, Image } from 'react-native';
import { Title, Text, PrimaryButton, SmallText, SubTitle } from '../theme';
import ActivityDetails from '../../../types/activity-details';
import TouchableOpacityOnPress from '../../../types/touchable-on-press';
import PricingIndicator from '../pricing-indicator';
import RatingIndicator from '../rating-indicator';

interface ActivityDetailsModalProps extends ModalProps {
  details: ActivityDetails | null;
  onCancel: Function;
  onConfirm: TouchableOpacityOnPress;
}

class ActivityDetailsModal extends React.Component<ActivityDetailsModalProps> {

  renderHeaderImage = (images: string[]) => {
    if (images && images.length && images[0]) {
      return (
        <View>
          <Image source={{ uri: images[0] }} style={styles.headerImage} />
        </View>
      );
    }
  }

  renderDetails = () => {
    const { details, onConfirm } = this.props;
    if (details) {
      const {
        name,
        location,
        hours,
        rating,
        review_count,
        price_level,
        images
      } = details;

      return (
        <View style={styles.modal}>
          <View style={styles.container}>
            {this.renderHeaderImage(images)}
            <View style={styles.body}>
              <View style={styles.row}>
                <View>
                  <Title>{name}</Title>
                  <SmallText>{location.join(' ')}</SmallText>
                  <PricingIndicator rating={price_level} />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <RatingIndicator
                    rating={rating}
                  />
                  <SmallText>({review_count} Reviews)</SmallText>
                </View>
              </View>

            </View>
            <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
              <PrimaryButton title="Invite" onPress={onConfirm} />
            </View>
          </View>
        </View>
      );
    }
  }
  render() {
    const { onConfirm, details, ...rest } = this.props;

    return (
      <Modal
        animationType="slide"
        visible={!!details}
        transparent
        {...rest}
      >
        {this.renderDetails()}
      </Modal>
    );
  }
}

export default ActivityDetailsModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.4,
    elevation: 5
  },
  headerImage: {
    width: '100%',
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  body: {
    padding: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
