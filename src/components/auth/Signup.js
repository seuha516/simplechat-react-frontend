import React, { useEffect, useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsFillChatDotsFill } from 'react-icons/bs';
import styled from 'styled-components';

import LoadingComponent from 'components/LoadingComponent';
import { checkid, init, register } from 'modules/user';
import { setMe } from 'modules/chat';
import * as checkInformation from 'lib/checkInformation';

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
  justify-content: flex-start;
  align-items: center;
`;
const AuthText = styled(Link)`
  color: #535353;
  margin-left: 6px;
  font-size: 20px;
  font-weight: 300;
  font-family: 'Hind Siliguri', sans-serif;
  &:hover {
    color: black;
    font-weight: 400;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 15px;
  background-color: #a7a7a7ab;
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
const SignupWrapper = styled.div`
  width: 90%;
  max-width: 270px;
  display: flex;
  flex-direction: column;
  font-family: 'Nanum Gothic', sans-serif;
`;
const InputText = styled.div`
  margin: 12px 0 2px 0;
  font-size: 18px;
  cursor: default;
`;
const Input = styled.input`
  outline: none;
  width: 100%;
  height: 40px;
  font-size: 20px;
  padding: 8px 12px;
  border-radius: 10px;
  &::placeholder {
    font-size: 15px;
  }
  ${(props) => props.name === 'username' && { width: '80%' }}
`;
const CheckButton = styled.div`
  width: calc(20% - 3px);
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 3px;
  height: 40px;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  &.able {
    background-color: rgba(255, 255, 255, 1);
    pointer-events: all;
  }
  &.disable {
    background-color: #898989ed;
    pointer-events: none;
  }
  &.valid {
    background-color: #7cec6ecc;
    pointer-events: none;
  }
`;
const Warning = styled.div`
  margin: 2.5px 0 -5px 0;
  font-size: 15px;
  &.red {
    color: #ff0000;
  }
  &.green {
    color: #068f04;
  }
  &.orange {
    color: #d88115;
  }
  &.none {
    display: none;
  }
`;
const LoadingComponentWrapper = styled.div`
  height: '55px';
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0 12px 0;
`;
const SignupButton = styled.div`
  margin: 30px 0 12px 0;
  width: 100%;
  height: 55px;
  border-radius: 20px;
  border: 2px solid #848484;
  font-size: 25px;
  letter-spacing: 2px;
  font-family: 'Yanone Kaffeesatz', sans-serif;
  background-color: #c3f8ff;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color cubic-bezier(0.11, 0.82, 0.44, 0.99) 1s 0s;
  &:hover {
    background-color: #91f2ff;
  }
`;

const Signup = ({ socket }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user, registerLoading, checkidLoading } = useSelector(({ user, loading }) => ({
    user: user,
    registerLoading: loading['user/REGISTER'],
    checkidLoading: loading['user/CHECKID'],
  }));

  const [state, stateDispatch] = useReducer((state, action) => ({ ...state, [action.name]: action.value }), {
    username: '',
    validUsername: false,
    nickname: '',
    password: '',
    passwordConfirm: '',
  });
  const onChange = (e) => {
    stateDispatch(e.target);
    if (e.target.name === 'username') stateDispatch({ name: 'validUsername', value: false });
  };
  const onCheck = () => dispatch(checkid({ username: state.username }));
  const onSubmit = (e) => {
    e.preventDefault();
    if (checkInformation.canRegister(state) !== 'OK') {
      alert(checkInformation.canRegister(state));
      return;
    }
    dispatch(register(state));
  };

  useEffect(() => {
    if (user.user) {
      socket.emit('login', user.user);
      try {
        localStorage.setItem('user', JSON.stringify(user.user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    } else if (user.checkid !== null) {
      if (user.checkid === true) {
        alert(`이미 존재하는 ID입니다.`);
        stateDispatch({ name: 'validUsername', value: false });
      } else {
        stateDispatch({ name: 'validUsername', value: true });
      }
    } else if (user.registerError) {
      if (user.registerError.response) alert(user.registerError.response.data);
      else {
        console.error(user.registerError);
        alert('오류가 발생했습니다.');
      }
      stateDispatch({ name: 'validUsername', value: false });
    } else if (user.checkidError) {
      if (user.checkidError.response) alert(user.checkidError.response.data);
      else {
        console.error(user.checkidError);
        alert('오류가 발생했습니다.');
      }
      stateDispatch({ name: 'validUsername', value: false });
    }
  }, [socket, user.user, user.checkid, user.registerError, user.checkidError]);
  useEffect(() => {
    socket.on('introduce', (data) => {
      dispatch(setMe(data));
      history.push('/');
    });
    return () => socket.off();
  }, [socket, dispatch, history]);
  useEffect(() => {
    dispatch(init());
    return () => dispatch(init());
  }, [dispatch]);

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
          <AuthText to="/">← Home</AuthText>
        </AuthWrapper>
        <ContentWrapper>
          <SignupWrapper>
            <InputText>ID</InputText>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                name="username"
                value={state.username}
                onChange={onChange}
                type="text"
                placeholder="6~12자 이내 영문, 숫자"
              />
              <CheckButton className={checkInformation.checkUsername(state).button} onClick={onCheck}>
                {checkidLoading ? (
                  <LoadingComponent size={'24px'} border={'3px'} />
                ) : (
                  <AiOutlineCheck style={{ width: '16px', height: '16px' }} />
                )}
              </CheckButton>
            </span>
            <Warning className={checkInformation.checkUsername(state).color}>
              {checkInformation.checkUsername(state).warning}
            </Warning>
            <InputText>Nickname</InputText>
            <Input
              name="nickname"
              value={state.nickname}
              onChange={onChange}
              type="text"
              placeholder="2~6자 문자/숫자/기호"
            />
            <Warning className={checkInformation.checkNickname(state).color}>
              {checkInformation.checkNickname(state).warning}
            </Warning>
            <InputText>Password</InputText>
            <Input
              name="password"
              value={state.password}
              onChange={onChange}
              type="password"
              placeholder="8~20자 영문/숫자/기호"
            />
            <Warning className={checkInformation.checkPassword(state).color}>
              {checkInformation.checkPassword(state).warning}
            </Warning>
            <InputText>Confirm Password</InputText>
            <Input
              name="passwordConfirm"
              value={state.passwordConfirm}
              onChange={onChange}
              type="password"
              placeholder="8~20자 영문/숫자/기호"
            />
            <Warning className={checkInformation.checkPasswordConfirm(state).color}>
              {checkInformation.checkPasswordConfirm(state).warning}
            </Warning>
            {registerLoading ? (
              <LoadingComponentWrapper>
                <LoadingComponent size={'48px'} border={'5px'} />
              </LoadingComponentWrapper>
            ) : (
              <SignupButton onClick={onSubmit}>Sign Up</SignupButton>
            )}
          </SignupWrapper>
        </ContentWrapper>
      </Wrapper>
    </Background>
  );
};

export default Signup;
