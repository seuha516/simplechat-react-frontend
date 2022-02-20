import { createAction, handleActions } from 'redux-actions';
import { call, takeLatest } from 'redux-saga/effects';
import createRequestSaga, { createRequestActionTypes } from 'lib/createRequestSaga';
import * as userAPI from 'lib/api/user';

const SET_USER = 'user/SET_USER';
const INIT = 'user/INIT';
const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes('user/REGISTER');
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes('user/LOGIN');
const [CHECKID, CHECKID_SUCCESS, CHECKID_FAILURE] = createRequestActionTypes('user/CHECKID');
// eslint-disable-next-line no-unused-vars
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes('user/CHECK');
const [UPDATE, UPDATE_SUCCESS, UPDATE_FAILURE] = createRequestActionTypes('user/UPDATE');
const LOGOUT = 'user/LOGOUT';

export const setUser = createAction(SET_USER, (user) => user);
export const init = createAction(INIT);
export const register = createAction(REGISTER, ({ username, nickname, password }) => ({
  username,
  nickname,
  password,
}));
export const login = createAction(LOGIN, ({ username, password }) => ({
  username,
  password,
}));
export const checkid = createAction(CHECKID, ({ username }) => ({
  username,
}));
export const update = createAction(UPDATE, ({ id, user }) => ({
  id,
  user,
}));
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);

//사가
const registerSaga = createRequestSaga(REGISTER, userAPI.register);
const loginSaga = createRequestSaga(LOGIN, userAPI.login);
const checkidSaga = createRequestSaga(CHECKID, userAPI.checkid);
const checkSaga = createRequestSaga(CHECK, userAPI.check);
const updateSaga = createRequestSaga(UPDATE, userAPI.update);
function checkFailureSaga() {
  try {
    localStorage.removeItem('user');
  } catch (e) {
    console.log('localStorage is not working');
  }
}
function* logoutSaga() {
  try {
    yield call(userAPI.logout);
    localStorage.removeItem('user');
  } catch (e) {
    console.log(e);
  }
}
export function* userSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(CHECKID, checkidSaga);
  yield takeLatest(CHECK, checkSaga);
  yield takeLatest(UPDATE, updateSaga);
  yield takeLatest(CHECK_FAILURE, checkFailureSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}

const initialState = {
  user: null,
  checkid: null,
  checkPassword: null,
  checkUpdate: null,
  registerError: null,
  loginError: null,
  checkidError: null,
  updateError: null,
};
const user = handleActions(
  {
    [SET_USER]: (state, { payload: user }) => ({
      ...state,
      user,
    }),
    [INIT]: (state) => ({ ...initialState, user: state.user }),
    [REGISTER]: (state) => ({ ...initialState, user: state.user }),
    [REGISTER_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
    }),
    [REGISTER_FAILURE]: (state, { payload: registerError }) => ({
      ...state,
      registerError,
    }),
    [LOGIN]: (state) => ({ ...initialState, user: state.user }),
    [LOGIN_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
      checkPassword: true,
    }),
    [LOGIN_FAILURE]: (state, { payload: loginError }) => ({
      ...state,
      loginError,
      checkPassword: false,
    }),
    [CHECKID]: (state) => ({ ...initialState, user: state.user }),
    [CHECKID_SUCCESS]: (state, { payload: checkid }) => ({
      ...state,
      checkid,
    }),
    [CHECKID_FAILURE]: (state, { payload: checkidError }) => ({
      ...state,
      checkidError,
    }),
    [UPDATE]: (state) => ({ ...initialState, user: state.user }),
    [UPDATE_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
      checkUpdate: true,
    }),
    [UPDATE_FAILURE]: (state, { payload: updateError }) => ({
      ...state,
      updateError,
      checkUpdate: false,
    }),
    [CHECK_FAILURE]: (state) => ({
      ...state,
      user: null,
    }),
    [LOGOUT]: (state) => ({
      ...state,
      user: null,
    }),
  },
  initialState,
);
export default user;
