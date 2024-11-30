import { all, fork, put, takeLatest, call } from 'redux-saga/effects'
import axios from 'axios'
import { AnyAction } from 'redux'
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE } from '../reducers/user'
import { authUrl } from '../config/config'

axios.defaults.baseURL = authUrl

export function logInAPI(data: any): object {
  return axios.post('/login', data)
}

export function* logIn(action: AnyAction): any {
  try {
    const result = yield call(logInAPI, action.data)
    yield put({
      type: LOG_IN_SUCCESS,
    })
    axios.defaults.headers.common['x-access-token'] = result.data.data.accessToken
    localStorage.setItem('accessToken', result.data.data.accessToken)
    localStorage.setItem('refreshToken', result.data.data.refreshToken)
  } catch (err: any) {
    console.error(err)
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    })
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn)
}

export default function* userSaga() {
  yield all([fork(watchLogIn)])
}
