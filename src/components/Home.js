import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCloseCircle, AiFillLock } from 'react-icons/ai';
import { BiFileFind } from 'react-icons/bi';
import { BsFillChatDotsFill, BsPencil, BsPeopleFill } from 'react-icons/bs';
import { FiUserPlus } from 'react-icons/fi';
import { IoPeopleCircleOutline } from 'react-icons/io5';
import styled, { css } from 'styled-components';

import LoadingComponent from 'components/LoadingComponent';
import { logout } from 'modules/user';
import { addMessage, setMe, setMember, setMessage, setRoom } from 'modules/chat';

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  min-height: 660px;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;
const Wrapper = styled.div`
  width: 95%;
  max-width: 500px;
  height: 640px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const TitleWrapper = styled(Link)`
  display: flex;
  align-items: flex-end;
  height: 75px;
  font-family: 'Hammersmith One', sans-serif;
  @media all and (max-width: 340px) {
    letter-spacing: -1.5px;
  }
  @media all and (max-width: 300px) {
    letter-spacing: -4px;
  }
`;
const Title1 = styled.div`
  font-size: 68px;
`;
const Title2 = styled.div`
  font-size: 52px;
  margin-bottom: 4px;
`;
const Icon = styled(BsFillChatDotsFill)`
  width: 60px;
  height: 60px;
  margin: 0 0 15px 12px;
  @media all and (max-width: 400px) {
    display: none;
  }
`;

const AuthWrapper = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AuthText = styled(Link)`
  color: #535353;
  margin: 0 6px;
  font-size: 20px;
  font-weight: 300;
  font-family: 'Hind Siliguri', sans-serif;
  &:hover {
    color: black;
    font-weight: 400;
  }
`;
const Logout = styled.div`
  color: #535353;
  margin-left: 6px;
  font-size: 20px;
  font-weight: 300;
  font-family: 'Hind Siliguri', sans-serif;
  cursor: pointer;
  &:hover {
    color: black;
    font-weight: 400;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 15px;
  padding: 10px 3%;
  background-color: #d3d3d3ab;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: appear 0.3s ease-out;
  @keyframes appear {
    from {
      opacity: 0;
      margin-top: 40px;
    }
    to {
      opacity: 1;
      margin-top: 0px;
    }
  }
`;
const ButtonWrapper = styled.div`
  width: 100%;
  height: 45px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const MemberButton = styled.div`
  width: 26%;
  background-color: #a0a0a0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s linear;
  svg {
    width: 27px;
    height: 27px;
  }
  div {
    font-size: 20px;
    margin: 0 0 1.5px 7px;
  }
  &:hover {
    background-color: #bebebe;
  }
`;
const MemberPopUp = styled.div`
  position: absolute;
  width: calc(95% * 0.94);
  max-width: 270px;
  height: 429.712px;
  background-color: #000000d9;
  margin-top: 50.125px;
  color: white;
  transition: all 0.1s linear;
  ${(props) =>
    !props.open &&
    css`
      opacity: 0;
      z-index: -1;
    `}
`;
const CloseMemberPopUp = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  svg {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
`;
const MyInfoWrapper = styled.div`
  width: calc(100% - 27px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;
const MyNickname = styled.div`
  font-size: 20px;
  font-family: 'Nanum Gothic', sans-serif;
  margin-right: 7px;
  letter-spacing: -0.5px;
  white-space: nowrap;
  width: 58%;
  overflow: hidden;
`;
const MyUsername = styled.div`
  font-size: 16px;
  font-family: 'Nanum Gothic', sans-serif;
  letter-spacing: -1.2px;
  white-space: nowrap;
  width: 42%;
  overflow: hidden;
`;
const OtherWrapper = styled.div`
  padding: 10px;
  height: calc(100% - 54px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: black;
    border-radius: 10px;
    background-clip: padding-box;
    border: 2px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background-color: grey;
    border-radius: 10px;
    box-shadow: inset 0px 0px 5px white;
  }
`;
const OtherInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  & + & {
    margin-top: 7.5px;
  }
`;
const OtherNickname = styled.div`
  font-size: 18px;
  font-family: 'Nanum Gothic', sans-serif;
  margin-right: 7px;
  letter-spacing: -0.5px;
`;
const OtherUsername = styled.div`
  color: #c3c3c3;
  font-size: 15px;
  font-family: 'Nanum Gothic', sans-serif;
  letter-spacing: -1px;
`;

const FastMatchButton = styled.div`
  width: 35%;
  background-color: #82aae7;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s linear;
  svg {
    width: 27px;
    height: 27px;
  }
  div {
    font-size: 20px;
    font-family: 'Nanum Gothic', sans-serif;
    margin: 0 5px 0 5px;
  }
  &:hover {
    background-color: #639ffb;
  }
  @media all and (max-width: 405px) {
    svg {
      display: none;
    }
    div {
      margin: 0;
    }
  }
  @media all and (max-width: 350px) {
    div {
      font-size: 18px;
    }
  }
`;

const CreateRoomButton = styled.div`
  width: 35%;
  background-color: #87da96;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s linear;
  svg {
    width: 27px;
    height: 27px;
  }
  div {
    font-size: 20px;
    font-family: 'Nanum Gothic', sans-serif;
    margin: 0 8px 0 0;
  }
  &:hover {
    background-color: #51d86a;
  }
  @media all and (max-width: 405px) {
    svg {
      display: none;
    }
    div {
      margin: 0;
    }
  }
  @media all and (max-width: 350px) {
    div {
      font-size: 18px;
    }
  }
`;
const CreateRoomPopUp = styled.div`
  position: absolute;
  width: min(300px, calc(95% * 0.94));
  height: 350px;
  background-color: #000000d9;
  margin-top: 89.981px;
  left: calc(50% - min(150px, calc(95% * 0.47)));
  color: white;
  transition: all 0.1s linear;
  ${(props) =>
    !props.open &&
    css`
      opacity: 0;
      z-index: -1;
    `}
`;
const CloseCreateRoomPopUp = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  svg {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
`;
const CloseCreateRoomPopUpTitle = styled.div`
  font-size: 24px;
  font-family: 'Lato', sans-serif;
`;
const CreateRoomWrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 306px;
  font-family: 'Nanum Gothic', sans-serif;
`;
const CreateRoomInputText = styled.div`
  margin: 0 0 3px 3px;
  font-size: 16px;
  cursor: default;
`;
const CreateRoomInput = styled.input`
  outline: none;
  width: 100%;
  height: 40px;
  font-size: 20px;
  padding: 8px 12px;
  margin-bottom: 10px;
  border-radius: 10px;
  letter-spacing: -0.5px;
  &::placeholder {
    font-size: 15px;
  }
  ${(props) => props.name === 'username' && { width: '80%' }}
`;
const SelectPeople = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 5px;
`;
const Number = styled.div`
  font-size: 32px;
  font-family: 'Do Hyeon', sans-serif;
  cursor: pointer;
  ${(props) =>
    props.now &&
    css`
      color: #ff8b8b;
    `}
`;
const CreateButton = styled.div`
  margin: 16px 0 6px 0;
  width: 100%;
  height: 55px;
  border-radius: 15px;
  border: 2px solid #0000008a;
  font-size: 25px;
  letter-spacing: 2px;
  font-family: 'Yanone Kaffeesatz', sans-serif;
  background-color: #000000;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s linear;
  &:hover {
    background-color: #284051;
  }
`;

const RoomWrapper = styled.div`
  width: 100%;
  height: 279px;
  margin-bottom: 6px;
  padding: 0 3px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: black;
    border-radius: 10px;
    background-clip: padding-box;
    border: 2px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background-color: grey;
    border-radius: 10px;
    box-shadow: inset 0px 0px 5px white;
  }
`;
const Room = styled.div`
  width: calc(50% - 10px);
  height: 73px;
  margin: 5px 5px 3px 5px;
  padding: 3px;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 1px 1px #000000a6;
  border-radius: 8px;
  cursor: pointer;
  transition: margin 0.15s linear;
  background-color: ${(props) => (props.full ? '#00000085' : props.color)};
  &:hover {
    margin: 3px 7px 5px 3px;
  }
  @media all and (max-width: 395px) {
    width: 100%;
  }
`;
const RoomTitle = styled.div`
  margin-bottom: 3px;
  font-size: 20px;
  font-family: 'Nanum Gothic', sans-serif;
  line-height: 22px;
  height: 43.2px;
`;
const RoomInfo = styled.div`
  height: 20.8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg {
    width: 18px;
    height: 18px;
    margin-right: 3px;
  }
`;
const LockIcon = styled(AiFillLock)`
  ${(props) =>
    props.password === '' &&
    css`
      visibility: hidden;
    `}
`;
const People = styled.div`
  font-size: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatWrapper = styled.div`
  width: 100%;
  height: 140px;
  display: flex;
  flex-direction: column;
  background-color: #cdcdcd8f;
  border-radius: 5px;
  padding: 5px 5px 2px 5px;
`;
const Messages = styled.div`
  height: 109px;
  padding-bottom: 3px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: black;
    border-radius: 10px;
    background-clip: padding-box;
    border: 2px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background-color: grey;
    border-radius: 10px;
    box-shadow: inset 0px 0px 5px white;
  }
`;
const MessageInputWrapper = styled.form`
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Nanum Gothic', sans-serif;
`;
const MessageInput = styled.input`
  width: calc(100% - 40px);
  height: 25px;
  padding: 0 4px;
`;
const SubmitButton = styled.div`
  width: 38px;
  height: 25px;
  background: black;
  color: white;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const MessageWrapper = styled.div`
  font-size: 15px;
  font-family: 'Nanum Gothic', sans-serif;
  line-height: 17px;
  line-break: anywhere;
  strong {
    font-weight: 600;
    ${(props) =>
      props.id === 'true' &&
      css`
        color: #007f04;
      `}
  }

  -ms-user-select: text;
  -moz-user-select: -moz-text;
  -webkit-user-select: text;
  -khtml-user-select: text;
  user-select: text;
`;

const Home = ({ socket }) => {
  const me = useSelector((store) => store.chat.me);
  if (me) return <RealHome socket={socket} />;
  else
    return (
      <Background>
        <LoadingComponent size={'100px'} border={'5px'} />
      </Background>
    );
};

const RealHome = ({ socket }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);
  const { member, me, room, message } = useSelector(({ chat }) => ({
    member: chat.member,
    me: chat.me,
    room: chat.room,
    message: chat.message,
  }));

  const [memberListOpen, setMemberListOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [roomInfo, roomInfoDispatch] = useReducer((state, action) => ({ ...state, [action.name]: action.value }), {
    name: '',
    password: '',
    maximum: 4,
  });
  const messageRef = useRef(null);

  const onFastMatch = () => {
    let possibleRoom = [];
    room.map((x) => {
      if (x.password === '' && x.member.length < x.maximum) possibleRoom.push(x.code);
      return x;
    });
    if (possibleRoom.length === 0) {
      alert('입장 가능한 방이 없습니다.');
    } else {
      let index = Math.floor(Math.random() * possibleRoom.length);
      history.push(`/room?${possibleRoom[index]}`);
    }
  };
  const onChangeCreateRoom = (e) => roomInfoDispatch(e.target);
  const onCreate = () => {
    if (roomInfo.name === '') alert('방 제목을 입력해 주세요.');
    else if (roomInfo.name.length > 16) alert('방 제목은 16자 이하여야 합니다.');
    else socket.emit('createRoom', roomInfo);
  };
  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (messageInput === '') return;
    setMessageInput('');
    socket.emit('createMessage', { user: me, value: messageInput, location: 'lobby' });
  };
  const onClickRoom = (room) => {
    if (room.member.length >= room.maximum) {
      alert('방이 꽉 찼습니다.');
      return;
    }
    history.push(`/room?${room.code}`);
  };

  useEffect(() => {
    socket.emit('renderHome');
    socket.emit('joinRoom', { user: me, code: 'lobby' });
    socket.on('introduce', (data) => dispatch(setMe(data)));
    socket.on('memberChange', (data) => dispatch(setMember(data)));
    socket.on('roomChange', (data) => dispatch(setRoom(data)));
    socket.on('inviteRoom', (data) => history.push(`/room?${data}`));
    socket.on('messageChange', (data) => {
      dispatch(addMessage(data));
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    });
    return () => {
      dispatch(setMessage([]));
      dispatch(setMember([]));
      dispatch(setRoom([]));
      socket.emit('leaveRoom', { user: me, code: 'lobby' });
      socket.off();
    };
  }, [socket, dispatch, history, me]);

  return (
    <Background>
      <Wrapper>
        <TitleWrapper to="/">
          <Title1>S</Title1>
          <Title2>imple</Title2>
          <Title1>C</Title1>
          <Title2>hat</Title2>
          <Icon />
        </TitleWrapper>
        <AuthWrapper>
          {user ? (
            <>
              <Logout
                onClick={() => {
                  if (window.confirm('정말 로그아웃하시겠습니까?')) {
                    dispatch(logout());
                    socket.emit('logout');
                  }
                }}
              >
                Logout
              </Logout>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: '18px', marginRight: '6px' }}>{me.nickname}</div>
                <Link to="/profile">
                  <BsPencil style={{ width: '20px', height: '20px' }} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AuthText to="/login">Login</AuthText>
                <AuthText to="/signup">SignUp</AuthText>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: '18px', marginRight: '6px' }}>{me.nickname}</div>
              </div>
            </>
          )}
        </AuthWrapper>
        <ContentWrapper>
          <ButtonWrapper>
            <MemberButton
              onClick={() => {
                setMemberListOpen(!memberListOpen);
                setCreateRoomOpen(false);
              }}
            >
              <BsPeopleFill />
              <div>{member && member.length}</div>
            </MemberButton>
            <MemberPopUp open={memberListOpen}>
              <CloseMemberPopUp>
                <MyInfoWrapper>
                  <MyNickname>{me.nickname}</MyNickname>
                  <MyUsername>{me.username}</MyUsername>
                </MyInfoWrapper>
                <AiOutlineCloseCircle onClick={() => setMemberListOpen(false)} />
              </CloseMemberPopUp>
              <OtherWrapper>
                {member &&
                  member.map((x) =>
                    x.id === me.id ? null : (
                      <OtherInfoWrapper key={x.id}>
                        <OtherNickname>{x.nickname}</OtherNickname>
                        <OtherUsername>{x.username}</OtherUsername>
                      </OtherInfoWrapper>
                    ),
                  )}
              </OtherWrapper>
            </MemberPopUp>
            <FastMatchButton onClick={onFastMatch}>
              <div>빠른 입장</div>
              <BiFileFind />
            </FastMatchButton>
            <CreateRoomButton
              onClick={() => {
                setMemberListOpen(false);
                setCreateRoomOpen(!createRoomOpen);
                roomInfoDispatch({ name: 'name', value: '' });
                roomInfoDispatch({ name: 'password', value: '' });
                roomInfoDispatch({ name: 'maximum', value: 4 });
              }}
            >
              <div>방 만들기</div>
              <FiUserPlus />
            </CreateRoomButton>
            <CreateRoomPopUp open={createRoomOpen}>
              <CloseCreateRoomPopUp>
                <CloseCreateRoomPopUpTitle>Create Room</CloseCreateRoomPopUpTitle>
                <AiOutlineCloseCircle onClick={() => setCreateRoomOpen(false)} />
              </CloseCreateRoomPopUp>
              <CreateRoomWrapper>
                <CreateRoomInputText>Room Name</CreateRoomInputText>
                <CreateRoomInput
                  name="name"
                  value={roomInfo.name}
                  onChange={onChangeCreateRoom}
                  type="text"
                  placeholder="16자 이하"
                />
                <CreateRoomInputText>Password</CreateRoomInputText>
                <CreateRoomInput
                  name="password"
                  value={roomInfo.password}
                  onChange={onChangeCreateRoom}
                  type="text"
                  placeholder="암호를 설정하려면 입력"
                />
                <CreateRoomInputText>Max People</CreateRoomInputText>
                <SelectPeople>
                  {[2, 3, 4, 5, 6, 7, 8].map((x) => (
                    <Number
                      key={x}
                      now={x === roomInfo.maximum}
                      onClick={() => roomInfoDispatch({ name: 'maximum', value: x })}
                    >
                      {x}
                    </Number>
                  ))}
                </SelectPeople>
                <CreateButton onClick={onCreate}>Create</CreateButton>
              </CreateRoomWrapper>
            </CreateRoomPopUp>
          </ButtonWrapper>

          <RoomWrapper>
            {room &&
              room.map((x) => (
                <Room key={x.code} color={x.color} full={x.member.length >= x.maximum} onClick={() => onClickRoom(x)}>
                  <RoomTitle>{x.name}</RoomTitle>
                  <RoomInfo>
                    <LockIcon password={x.password} />
                    <People>
                      <IoPeopleCircleOutline />
                      {`${x.member.length} / ${x.maximum}`}
                    </People>
                  </RoomInfo>
                </Room>
              ))}
          </RoomWrapper>

          <ChatWrapper>
            <Messages ref={messageRef}>
              {message &&
                message.map((x) => (
                  <MessageWrapper key={x.chatid} id={String(x.id === me.id)}>
                    <strong>{`${x.nickname}:`}</strong> {`${x.value}`}
                  </MessageWrapper>
                ))}
            </Messages>
            <MessageInputWrapper onSubmit={onSubmitMessage}>
              <MessageInput
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                type="text"
                placeholder="메시지를 입력하세요."
              ></MessageInput>
              <SubmitButton onClick={onSubmitMessage}>입력</SubmitButton>
            </MessageInputWrapper>
          </ChatWrapper>
        </ContentWrapper>
      </Wrapper>
    </Background>
  );
};

export default Home;
