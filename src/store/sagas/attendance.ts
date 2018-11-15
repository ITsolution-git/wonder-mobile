import { select, call, put, takeEvery } from "redux-saga/effects";
import { createAction, Action } from "redux-actions";
import api from "../../services/api";
import { getAppointments } from "./appointment";
import { persistAttendances } from "../reducers/wonder";
import WonderAppState from "../../models/wonder-app-state";
import { handleAxiosError } from "./utils";
import Attendance from "src/models/attendance";

export const GET_ATTENDANCES = "GET_ATTENDANCES";
export const getAttendances = createAction(GET_ATTENDANCES);
export function* getAttendancesSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Attendance[] } = yield call(
      api,
      {
        method: "GET",
        url: "/attendances"
      },
      state.user
    );

    yield put(persistAttendances(data));
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchGetAttendances() {
  yield takeEvery(GET_ATTENDANCES, getAttendancesSaga);
}

export const DELETE_ATTENDANCE = "DELETE_ATTENDANCE";
export const deleteAttendance = createAction(DELETE_ATTENDANCE);
export function* deleteAttendanceSaga(action: Action<any>) {
  try {
    const state: WonderAppState = yield select();

    const { data }: { data: Attendance[] } = yield call(
      api,
      {
        method: "DELETE",
        url: `/attendances/${action.payload.attendanceId}`
      },
      state.user
    );

    yield put(getAttendances());
  } catch (error) {
    handleAxiosError(error);
  }
}

export function* watchDeleteAttendance() {
  yield takeEvery(DELETE_ATTENDANCE, deleteAttendanceSaga);
}
