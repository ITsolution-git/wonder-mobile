import { all } from "redux-saga/effects";
import { watchGetTopics } from "./topics";
import {
  watchLoginUser,
  watchLogoutUser,
  watchGetUser,
  watchForgotPassword,
  watchUpdateUser,
  watchRegisterUser,
  watchUpdateImage,
  watchUpdateVideo,
  watchDeleteProfileImageSaga,
  watchDeleteProfileVideoSaga
} from "./user";
import { watchGetNewProposal, watchRateProposal } from "./proposal";
import { watchCreateAppointment, watchGetAppointments } from "./appointment";
import {
  watchGetPartners,
  watchGetPartnerActivities,
  watchGetActivityDetails
} from "./partner";
import {
  watchGetConversation,
  watchGetConversations,
  watchSendMessage,
  watchGhostContact
} from "./conversations";
import { watchSubmitFeedback } from "./feedback";

export default function* rootSaga() {
  yield all([
    watchGetTopics(),

    // User
    watchLoginUser(),
    watchGetUser(),
    watchUpdateUser(),
    watchDeleteProfileImageSaga(),
    watchDeleteProfileVideoSaga(),
    watchUpdateImage(),
    watchUpdateVideo(),
    watchRegisterUser(),
    watchLogoutUser(),
    watchForgotPassword(),

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
    watchGhostContact(),

    // Feedback
    watchSubmitFeedback()
  ]);
}
