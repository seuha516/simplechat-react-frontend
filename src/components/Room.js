import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCloseCircle, AiFillUnlock, AiFillLock } from 'react-icons/ai';
import { BiCrown } from 'react-icons/bi';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { GiQueenCrown, GiBootKick } from 'react-icons/gi';
import styled, { css } from 'styled-components';

import LoadingComponent from 'components/LoadingComponent';
import { addMessage, setMessage, setRoomInfo, setRoomMember } from 'modules/chat';

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
const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: 75px;
  font-family: 'Hammersmith One', sans-serif;
  cursor: pointer;
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
const AuthText = styled.div`
  color: #535353;
  margin: 0 6px;
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
  padding: 10px;
  background-color: #9292928f;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

const RoomInfoWrapper = styled.div`
  font-size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Nanum Myeongjo', serif;
  svg {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }
`;
const RoomTitle = styled.div`
  font-weight: 600;
  width: calc(100% - 64px);
`;

const MemberWrapper = styled.div`
  margin-top: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;
const Member = styled.div`
  background-color: white;
  margin: 0 2px 3px 2px;
  padding: 5px 0;
  border-radius: 5px;
  width: calc(25% - 4px);
  height: 26px;
  font-size: 16px;
  font-family: 'Nanum Gothic', sans-serif;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: gray;
  }

  @media all and (max-width: 495px) {
    font-size: 14px;
    margin: 0 1px 1px 1px;
  }
  @media all and (max-width: 445px) {
    font-size: 13px;
    letter-spacing: -1px;
  }
  @media all and (max-width: 385px) {
    width: calc(50% - 4px);
    font-size: 16px;
    margin: 0 2px 2px 2px;
  }
`;
const MemberContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  svg {
    position: absolute;
    color: #736a00b8;
    margin-left: -6px;
    margin-top: -11px;
    color: ${(props) => props.color};
  }
  div {
    width: 100%;
    text-align: center;
    z-index: 10;
    white-space: nowrap;
    overflow: hidden;
  }
`;
const MemberPopUp = styled.div`
  position: absolute;
  width: min(300px, calc(95% * 0.94));
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
const CloseMemberPopUpPopUpTitle = styled.div`
  font-size: 24px;
  font-family: 'Lato', sans-serif;
`;
const MemberPopUpUsername = styled.div`
  font-size: 18px;
  padding: 0 10px;
  color: #bababa;
`;
const MemberPopUpButtonWrapper = styled.div`
  width: 100%;
  height: 80px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 35px;
    height: 35px;
    margin: 0 7.5px;
    cursor: pointer;
    transition: all 0.25s linear;
    &:nth-child(1):hover {
      color: yellow;
    }
    &:nth-child(2):hover {
      color: red;
    }
  }
`;

const ChatWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffffab;
  border-radius: 5px;
  margin-top: 3px;
  padding: 5px 5px 2px 5px;
`;
const Messages = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 362px;
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

  @media all and (max-width: 385px) {
    height: 310px;
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
  margin-top: 5px;
`;
const SubmitButton = styled.div`
  width: 38px;
  height: 25px;
  margin-top: 5px;
  background: black;
  color: white;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const NoticeMessageWrapper = styled.div`
  width: 100%;
  text-align: center;
  font-size: 15px;
  font-family: 'Nanum Gothic', sans-serif;
  line-height: 17px;
  line-break: anywhere;

  padding: 2px 0;
  margin: 3px 0;
  background-color: ${(props) => props.color};
  strong {
    font-weight: 600;
  }

  -ms-user-select: text;
  -moz-user-select: -moz-text;
  -webkit-user-select: text;
  -khtml-user-select: text;
  user-select: text;
`;
const MessageWrapper = styled.div`
  margin-bottom: 5px;
  font-size: 15px;
  font-family: 'Nanum Gothic', sans-serif;
  line-height: 18px;
  width: 100%;
  line-break: anywhere;

  ${(props) =>
    props.me
      ? css`
          text-align: right;
        `
      : css`
          text-align: left;
        `}

  -ms-user-select: text;
  -moz-user-select: -moz-text;
  -webkit-user-select: text;
  -khtml-user-select: text;
  user-select: text;
`;
const MessageNickname = styled.div`
  font-size: 13px;
  ${(props) =>
    props.me
      ? css`
          margin: 2.5px 10px 0 0;
        `
      : css`
          margin: 2.5px 0 0 10px;
        `}
`;
const MessageValue = styled.div`
  font-size: 16px;
  max-width: min(80%, 340px);
  background: white;
  padding: 7.5px 10px;
  border-radius: 10px;
  display: inline-block;
  margin: 0 0 0 5px;

  ${(props) =>
    props.me
      ? css`
          margin: 0 5px 0 0;
          background-color: #fff7b5;
        `
      : css`
          margin: 0 0 0 5px;
        `}
`;

const Room = ({ socket }) => {
  const me = useSelector((store) => store.chat.me);
  if (me) return <RealRoom socket={socket} />;
  else
    return (
      <Background>
        <LoadingComponent size={'100px'} border={'5px'} />
      </Background>
    );
};

const RealRoom = ({ socket }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { me, roomInfo, roomMember, message } = useSelector(({ chat }) => ({
    me: chat.me,
    roomInfo: chat.roomInfo,
    roomMember: chat.roomMember,
    message: chat.message,
  }));

  const [pass, setPass] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [admin, setAdmin] = useState('false');
  const [memberInfoOpen, setMemberInfoOpen] = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);
  const messageRef = useRef(null);

  const onClickTitle = () => {
    let newTitle = window.prompt('설정할 방 제목을 입력해주세요.');
    if (newTitle && newTitle !== '') {
      if (newTitle.length <= 16) socket.emit('editRoomInfo', { ...roomInfo, name: newTitle });
      else alert('방 제목은 16자 이하여야 합니다.');
    }
  };
  const onClickLock = (state) => {
    if (state) {
      if (window.confirm('공개방으로 전환하시겠습니까?')) {
        socket.emit('editRoomInfo', { ...roomInfo, password: '' });
      }
    } else {
      let newPassword = window.prompt('설정할 비밀번호를 입력해주세요.');
      if (newPassword && newPassword !== '') {
        socket.emit('editRoomInfo', { ...roomInfo, password: newPassword });
      }
    }
  };
  const onClickMaximum = () => {
    let newMaximum = window.prompt('최대 인원수를 입력해주세요.');
    if (newMaximum && newMaximum !== '') {
      newMaximum = Number(newMaximum);
      if (isNaN(newMaximum)) alert('숫자를 입력해 주세요.');
      else {
        if ([2, 3, 4, 5, 6, 7, 8].includes(newMaximum)) {
          if (newMaximum < roomMember.length) alert('현재 인원보다 많아야 합니다.');
          else socket.emit('editRoomInfo', { ...roomInfo, maximum: newMaximum });
        } else alert('2 이상 8 이하만 가능합니다.');
      }
    }
  };
  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (messageInput === '') return;
    setMessageInput('');
    socket.emit('createMessage', { user: me, value: messageInput, location: location.search.substring(1) });
  };
  const makeMemberList = (list) => {
    let result = [];
    list.map((x) => {
      result.push(x);
      return x;
    });
    for (let i = 0; i < roomInfo.maximum - list.length; i++) result.push('blank');
    for (let i = 0; i < 8 - roomInfo.maximum; i++) result.push('lock');
    return result;
  };
  const onClickMember = (user) => {
    setMemberInfo(user);
    setMemberInfoOpen(true);
  };
  const giveCrown = (user) => {
    socket.emit('giveCrown', { user, code: roomInfo.code });
    setMemberInfoOpen(false);
  };
  const giveKick = (user) => {
    socket.emit('giveKick', { user, code: roomInfo.code });
    setMemberInfoOpen(false);
  };

  useEffect(() => {
    socket.emit('tryRoom', location.search.substring(1));
    socket.on('allowRoom', (data) => {
      if (data && data !== window.prompt('비밀번호를 입력하세요.')) {
        alert('비밀번호가 틀렸습니다.');
        history.push('/');
      } else {
        socket.emit('joinRoom', { user: me, code: location.search.substring(1) });
        setPass(true);
      }
    });
    socket.on('roomInfoChange', (data) => dispatch(setRoomInfo(data)));
    socket.on('roomMemberChange', (data) => {
      dispatch(setRoomMember(data));
      setAdmin(data[data.findIndex((x) => x.id === me.id)].admin);
    });
    socket.on('messageChange', (data) => {
      dispatch(addMessage(data));
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    });
    socket.on('wrongRoom', (data) => {
      alert(data);
      history.push('/');
    });
    socket.on('kicked', () => {
      history.push('/');
    });
    return () => {
      socket.emit('leaveRoom', { user: me, code: location.search.substring(1) });
      dispatch(setRoomInfo(null));
      dispatch(setRoomMember([]));
      dispatch(setMessage([]));
      socket.off();
    };
  }, [socket, dispatch, history, location.search, me]);

  return (
    <Background>
      {pass ? (
        <Wrapper>
          <TitleWrapper
            onClick={() => {
              if (window.confirm('방에서 나가시겠습니까?')) history.push('/');
            }}
          >
            <Title1>S</Title1>
            <Title2>imple</Title2>
            <Title1>C</Title1>
            <Title2>hat</Title2>
            <Icon />
          </TitleWrapper>
          <AuthWrapper>
            <AuthText
              onClick={() => {
                if (window.confirm('방에서 나가시겠습니까?')) history.push('/');
              }}
            >
              ← Home
            </AuthText>
            <div style={{ fontSize: '18px', marginRight: '6px' }}>{me.nickname}</div>
          </AuthWrapper>
          <ContentWrapper>
            <RoomInfoWrapper>
              {roomInfo &&
                (admin ? (
                  <>
                    <RoomTitle style={{ cursor: 'pointer' }} onClick={() => onClickTitle()}>
                      {roomInfo.name}
                    </RoomTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {roomInfo.password === '' ? (
                        <AiFillUnlock style={{ cursor: 'pointer' }} onClick={() => onClickLock(false)} />
                      ) : (
                        <AiFillLock style={{ cursor: 'pointer' }} onClick={() => onClickLock(true)} />
                      )}
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => onClickMaximum(true)}
                      >{`${roomMember.length} / ${roomInfo.maximum}`}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <RoomTitle>{roomInfo.name}</RoomTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {roomInfo.password === '' ? <AiFillUnlock /> : <AiFillLock />}
                      <div>{`${roomMember.length} / ${roomInfo.maximum}`}</div>
                    </div>
                  </>
                ))}
            </RoomInfoWrapper>

            <MemberWrapper>
              {roomInfo &&
                roomMember &&
                makeMemberList(roomMember).map((x, index) =>
                  x === 'lock' ? (
                    <Member key={index}>
                      <AiFillLock />
                    </Member>
                  ) : x === 'blank' ? (
                    <Member key={index} />
                  ) : (
                    <Member key={x.id} style={{ cursor: 'pointer' }} onClick={() => onClickMember(x)}>
                      <MemberContent color="#736a00">
                        {x.admin && <BiCrown />}
                        <div style={{ fontWeight: x.id === me.id ? '600' : '400' }}>{x.nickname}</div>
                      </MemberContent>
                    </Member>
                  ),
                )}
            </MemberWrapper>
            {memberInfo && (
              <MemberPopUp
                open={memberInfoOpen}
                style={{ height: admin && memberInfo.id !== me.id ? '140px' : '72px' }}
              >
                <CloseMemberPopUp>
                  <CloseMemberPopUpPopUpTitle>{memberInfo.nickname}</CloseMemberPopUpPopUpTitle>
                  <AiOutlineCloseCircle onClick={() => setMemberInfoOpen(false)} />
                </CloseMemberPopUp>
                <MemberPopUpUsername>{memberInfo.username}</MemberPopUpUsername>
                {admin && memberInfo.id !== me.id && (
                  <MemberPopUpButtonWrapper>
                    <GiQueenCrown onClick={() => giveCrown(memberInfo)} />
                    <GiBootKick onClick={() => giveKick(memberInfo)} />
                  </MemberPopUpButtonWrapper>
                )}
              </MemberPopUp>
            )}

            <ChatWrapper>
              <Messages ref={messageRef}>
                {message &&
                  message.map((x) => {
                    if (x.user === 'notice') {
                      return <NoticeMessage key={x.chatid} data={x} />;
                    } else {
                      return (
                        <MessageWrapper key={x.chatid} me={x.id === me.id}>
                          <MessageNickname me={x.id === me.id}>{x.nickname}</MessageNickname>
                          <MessageValue me={x.id === me.id}>{x.value}</MessageValue>
                        </MessageWrapper>
                      );
                    }
                  })}
              </Messages>
              <MessageInputWrapper onSubmit={onSubmitMessage}>
                <MessageInput
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                  }}
                  type="text"
                  placeholder="메시지를 입력하세요."
                />
                <SubmitButton onClick={onSubmitMessage}>입력</SubmitButton>
              </MessageInputWrapper>
            </ChatWrapper>
          </ContentWrapper>
        </Wrapper>
      ) : (
        <LoadingComponent size={'100px'} border={'5px'} />
      )}
    </Background>
  );
};

const NoticeMessage = ({ data }) => {
  if (data.type === 'enter') {
    return (
      <NoticeMessageWrapper color="#c0ff9282">
        <strong>{`${data.target.nickname}`}</strong> {`님이 들어왔습니다.`}
      </NoticeMessageWrapper>
    );
  } else if (data.type === 'leave') {
    return (
      <NoticeMessageWrapper color="#ffbfbf">
        <strong>{`${data.target.nickname}`}</strong> {`님이 나갔습니다.`}
      </NoticeMessageWrapper>
    );
  } else if (data.type === 'edit') {
    return (
      <NoticeMessageWrapper color="#bff9ff">
        <strong>{`방 설정 변경: `}</strong>{' '}
        {`${data.target.name} / ${data.target.password === '' ? '공개방' : '비밀방'} / 최대 ${data.target.maximum}인`}
      </NoticeMessageWrapper>
    );
  } else if (data.type === 'king') {
    return (
      <NoticeMessageWrapper color="lightblue">
        <strong>{`${data.target.nickname}`}</strong> {`님이 방장이 되었습니다.`}
      </NoticeMessageWrapper>
    );
  } else if (data.type === 'kick') {
    return (
      <NoticeMessageWrapper color="#ff9393">
        <strong>{`${data.target.nickname}`}</strong> {`님이 강제 퇴장되었습니다.`}
      </NoticeMessageWrapper>
    );
  }
};

export default Room;
