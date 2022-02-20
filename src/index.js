import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import io from 'socket.io-client';

import rootReducer, { rootSaga } from 'modules';
import { setUser, check } from 'modules/user';
import { setMe } from 'modules/chat';

import 'index.css';
import App from 'App';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
function loadUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    store.dispatch(setUser(user));
    store.dispatch(check());
  } catch (e) {
    console.log('localStorage is not working.', e);
  }
}
sagaMiddleware.run(rootSaga);
loadUser();
document.getElementById('root').setAttribute('spellcheck', 'false');

const socket = io.connect(`${process.env.REACT_APP_API_URL}`);
socket.emit('init', store.getState().user ? store.getState().user.user : null);
socket.on('introduce', (data) => store.dispatch(setMe(data)));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App socket={socket} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
