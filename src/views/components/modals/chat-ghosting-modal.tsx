import React from 'react';
import { Modal, View, ModalProps, StyleSheet, Platform } from 'react-native';
import { IconButton, TextArea, Title, PrimaryButton } from '../theme';

import TouchableOpacityOnPress from '../../../models/touchable-on-press';
import LinearGradient from 'react-native-linear-gradient';

interface Props extends ModalProps {
    onCancel?: TouchableOpacityOnPress;
    onSuccess?: Function;
}

class ChatGhostingModal extends React.Component<Props> {
    state = {
        ghostMessage: 'It’s been fun chatting but I’m not interested at the moment.'
    }

    renderContent = () => {
        const { onCancel, onSuccess } = this.props;

        return (
            <LinearGradient
                style={styles.textContainer}
                colors={['transparent', 'rgb(22,22,22)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.3]}
            >
                <View flex={1}>
                    <Title style={{ fontSize: 24 }} color="#FFF">
                        {'Poof!'}
                    </Title>
                    <View style={{ flexDirection: 'row' }}>
                        <TextArea
                            onChangeText={(ghostMessage) => this.setState({ghostMessage})}
                            value = {this.state.ghostMessage} 
                            style={{ minHeight: 100 }}
                            />
                    </View>
                </View>
                <View height={48}>
                <View flex={1}>
                        <PrimaryButton title="Submit" onPress={onSuccess} />
                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                    <IconButton size={44} icon="chevron-down" onPress={onCancel} primary="#FFF" secondary="transparent" />
                </View>
                </View>
            </LinearGradient>
        )

    }

    render() {
        const { onCancel, onSuccess, onRequestClose, ...rest } = this.props;
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
};


export default ChatGhostingModal;

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