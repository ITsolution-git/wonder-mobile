import { all } from 'redux-saga/effects';
import { watchGetTopics } from './topics';
import { watchLoginUser, watchLogoutUser, watchGetUser, watchUpdateUser, watchRegisterUser, watchUpdateImage, watchUpdateVideo, watchDeleteProfileImageSaga } from './user';
import { watchGetNewProposal, watchRateProposal } from './proposal';
import { watchCreateAppointment, watchGetAppointments } from './appointment';
import { watchGetPartners, watchGetPartnerActivities, watchGetActivityDetails } from './partner';
import { watchGetConversation, watchGetConversations, watchSendMessage } from './conversations';
import { watchSubmitFeedback } from './feedback';

export default function* rootSaga() {
  yield all([
    watchGetTopics(),

    // User
    watchLoginUser(),
    watchGetUser(),
    watchUpdateUser(),
    watchDeleteProfileImageSaga(),
    watchUpdateImage(),
    watchUpdateVideo(),
    watchRegisterUser(),
    watchLogoutUser(),

    // Proposals
    watchGetNewProposal(),
    watchRateProposal(),

    // Appointments
    watchGetAppointments(),
    watchCreateAppointment(),

    // Partners
    watchGetPartners(),
    watchGetPartnerActivities(),
    watchGetActivityDetails(),

    // Conversation
    watchGetConversation(),
    watchGetConversations(),
    watchSendMessage(),

    // Feedback
    watchSubmitFeedback()
  ])
}