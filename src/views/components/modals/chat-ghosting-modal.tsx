import React from 'react';
import { Modal, View, ModalProps, StyleSheet, Platform } from 'react-native';
import { IconButton, TextArea, Title, PrimaryButton, Text } from '../theme';

import TouchableOpacityOnPress from '../../../models/touchable-on-press';
import LinearGradient from 'react-native-linear-gradient';
import theme from 'src/assets/styles/theme';

interface Props extends ModalProps {
    onCancel?: TouchableOpacityOnPress;
    onSuccess?: TouchableOpacityOnPress;
}

class ChatGhostingModal extends React.Component<Props> {
    state = {
        ghostMessage: 'It’s been fun chatting but I’m not interested at the moment.'
    };

    renderContent = () => {
        const { onCancel, onSuccess } = this.props;

        return (
            <LinearGradient
                colors={[theme.colors.cottonCandyBlue, theme.colors.cottonCandyPink]} 
                style={styles.modal}
            >
                <View flexDirection={"column"} flex={1}>
                    <Title style={{ fontSize: 24 }} color="#FFF">
                        {'Poof! Time to disappear!'}
                    </Title>
                    <View>
                        <Text style={{color: '#333'}}>Ghosting is pseudo-permanent. Say something nice.</Text>
                        <TextArea
                            onChangeText={(ghostMessage) => this.setState({ghostMessage})}
                            value={this.state.ghostMessage}
                            style={{ backgroundColor: 'white', minHeight: 100 }}
                        />
                    </View>
                    <View flex={1} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                        <PrimaryButton title="Submit" onPress={onSuccess} />
                        <PrimaryButton title="Cancel" onPress={onCancel} />
                    </View>
                </View>
            </LinearGradient>
        );

    }

    render() {
        const { onCancel, onSuccess, onRequestClose, ...rest } = this.props;
        return (
            <Modal
                onRequestClose={onRequestClose}
                {...rest}
            >
                <View flex={1} style={{maxHeight: 300}}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }
}

export default ChatGhostingModal;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
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
