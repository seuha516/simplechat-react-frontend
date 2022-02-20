import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import loading from 'modules/loading';
import user, { userSaga } from 'modules/user';
import chat from 'modules/chat';

const rootReducer = combineReducers({
  loading,
  user,
  chat,
});

export function* rootSaga() {
  yield all([userSaga()]);
}

export default rootReducer;
