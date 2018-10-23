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
  watchDeleteProfileVideoSaga,
  watchDeactivateAccount
} from "./user";
import { watchGetNewProposal, watchRateProposal } from "./proposal";
import { watchCreateAppointment, watchGetAppointments } from "./appointment";
import {
  watchGetPartners,
  watchGetPartnerActivities,
  watchGetActivityDetails,
  watchBlockUser
} from "./partner";
import {
  watchGetConversation,
  watchGetConversations,
  watchSendMessage,
  watchGhostContact
} from "./conversations";
import { watchSubmitFeedback } from "./feedback";
import { watchGetAttendances } from "./attendance";

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
    watchDeactivateAccount(),

    // Proposals
    watchGetNewProposal(),
    watchRateProposal(),

    // Appointments
    watchGetAppointments(),
    watchCreateAppointment(),

    // Attendances
    watchGetAttendances(),

    // Partners
    watchGetPartners(),
    watchGetPartnerActivities(),
    watchGetActivityDetails(),
    watchBlockUser(),

    // Conversation
    watchGetConversation(),
    watchGetConversations(),
    watchSendMessage(),
    watchGhostContact(),

    // Feedback
    watchSubmitFeedback()
  ]);
}
