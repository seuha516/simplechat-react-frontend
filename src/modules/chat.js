import { createAction, handleActions } from 'redux-actions';

const SET_ME = 'chat/SET_ME';
const SET_MEMBER = 'chat/SET_MEMBER';
const SET_ROOM = 'chat/SET_ROOM';
const SET_ROOM_INFO = 'chat/SET_ROOM_INFO';
const SET_ROOM_MEMBER = 'chat/SET_ROOM_MEMBER';
const SET_MESSAGE = 'chat/SET_MESSAGE';
const ADD_MESSAGE = 'chat/ADD_MESSAGE';

export const setMe = createAction(SET_ME, (me) => me);
export const setMember = createAction(SET_MEMBER, (member) => member);
export const setRoom = createAction(SET_ROOM, (room) => room);
export const setRoomInfo = createAction(SET_ROOM_INFO, (roomInfo) => roomInfo);
export const setRoomMember = createAction(SET_ROOM_MEMBER, (roomMember) => roomMember);
export const setMessage = createAction(SET_MESSAGE, (message) => message);
export const addMessage = createAction(ADD_MESSAGE, (message) => message);

const initialState = {
  me: null,
  member: [],
  room: [],
  roomInfo: null,
  roomMember: [],
  message: [],
};
const chat = handleActions(
  {
    [SET_ME]: (state, { payload: me }) => ({
      ...state,
      me,
    }),
    [SET_MEMBER]: (state, { payload: member }) => ({
      ...state,
      member,
    }),
    [SET_ROOM]: (state, { payload: room }) => ({
      ...state,
      room,
    }),
    [SET_ROOM_INFO]: (state, { payload: roomInfo }) => ({
      ...state,
      roomInfo,
    }),
    [SET_ROOM_MEMBER]: (state, { payload: roomMember }) => ({
      ...state,
      roomMember,
    }),
    [SET_MESSAGE]: (state, { payload: message }) => ({
      ...state,
      message,
    }),
    [ADD_MESSAGE]: (state, { payload: message }) => ({
      ...state,
      message: state.message.concat(message),
    }),
  },
  initialState,
);
export default chat;
