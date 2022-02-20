import React, { useEffect, useReducer, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BiCheckbox, BiCheckboxSquare } from 'react-icons/bi';
import { BsFillChatDotsFill } from 'react-icons/bs';
import styled from 'styled-components';

import LoadingComponent from 'components/LoadingComponent';
import { init, login, update } from 'modules/user';
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
const ProfileWrapper = styled.div`
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
const Warning = styled.div`
  margin-top: 2.5px;
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
const CheckButton = styled.div`
  margin: 60px 0 12px 0;
  width: 100%;
  height: 55px;
  border-radius: 20px;
  border: 2px solid #848484;
  font-size: 25px;
  letter-spacing: 2px;
  font-family: 'Yanone Kaffeesatz', sans-serif;
  background-color: #ffecd7;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color cubic-bezier(0.11, 0.82, 0.44, 0.99) 1s 0s;
  &:hover {
    background-color: #ffd09c;
  }
`;
const UpdateButton = styled.div`
  margin: 50px 0 12px 0;
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
const LoadingComponentWrapper1 = styled.div`
  height: '55px';
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0 12px 0;
`;
const LoadingComponentWrapper2 = styled.div`
  height: '55px';
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60px 0 12px 0;
`;
const PasswordWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Profile = ({ socket }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user, loginLoading, updateLoading } = useSelector(({ user, loading }) => ({
    user: user,
    loginLoading: loading['user/LOGIN'],
    updateLoading: loading['user/UPDATE'],
  }));

  const [pass, setPass] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [state, stateDispatch] = useReducer((state, action) => ({ ...state, [action.name]: action.value }), {
    password: '',
    nickname: user.user ? user.user.nickname : '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const onClick = () => {
    setUpdatePassword(!updatePassword);
    stateDispatch({ name: 'newPassword', value: '' });
    stateDispatch({ name: 'newPasswordConfirm', value: '' });
  };
  const onChange = (e) => stateDispatch(e.target);
  const onCheck = (e) => {
    e.preventDefault();
    if (state.password === '') alert('비밀번호를 입력해 주세요.');
    else dispatch(login({ username: user.user.username, password: state.password }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!updatePassword) {
      if (state.nickname.length >= 2 && state.nickname.length <= 6) {
        dispatch(
          update({
            id: user.user._id,
            user: { nickname: state.nickname },
          }),
        );
      } else {
        alert('닉네임을 확인해 주세요.');
      }
    } else {
      let result = checkInformation.canRegister({
        username: user.user.username,
        validUsername: true,
        nickname: state.nickname,
        password: state.newPassword,
        passwordConfirm: state.newPasswordConfirm,
      });
      if (result !== 'OK') alert(result);
      else {
        dispatch(
          update({
            id: user.user._id,
            user: { nickname: state.nickname, password: state.newPassword },
          }),
        );
      }
    }
  };

  useEffect(() => {
    if (!user.user) {
      history.push('/');
    }
  }, [history, user.user]);
  useEffect(() => {
    if (user.checkPassword) {
      setPass(true);
    } else if (user.checkUpdate) {
      socket.emit('editProfile', user.user);
      try {
        localStorage.setItem('user', JSON.stringify(user.user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    } else if (user.loginError) {
      if (user.loginError.response) alert(user.loginError.response.data);
      else {
        console.error(user.loginError);
        alert('오류가 발생했습니다.');
      }
    } else if (user.updateError) {
      if (user.updateError.response) alert(user.updateError.response.data);
      else {
        console.error(user.updateError);
        alert('오류가 발생했습니다.');
      }
    }
  }, [socket, user.user, user.checkPassword, user.checkUpdate, user.loginError, user.updateError]);
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
          <ProfileWrapper>
            {pass ? (
              <>
                <InputText>Nickname</InputText>
                <Input
                  name="nickname"
                  value={state.nickname}
                  onChange={onChange}
                  type="text"
                  placeholder="2~6자 문자/숫자/기호"
                />
                <Warning className={checkInformation.checkNickname({ nickname: state.nickname }).color}>
                  {checkInformation.checkNickname({ nickname: state.nickname }).warning}
                </Warning>
                <PasswordWrapper>
                  <div style={{ fontSize: '18px', marginRight: '3px' }}>비밀번호 변경</div>
                  {updatePassword ? (
                    <BiCheckboxSquare
                      style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                      onClick={onClick}
                    />
                  ) : (
                    <BiCheckbox
                      style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                      onClick={onClick}
                    />
                  )}
                </PasswordWrapper>
                {updatePassword && (
                  <>
                    <InputText>Password</InputText>
                    <Input
                      name="newPassword"
                      value={state.newPassword}
                      onChange={onChange}
                      type="password"
                      placeholder="8~20자 영문/숫자/기호"
                    />
                    <Warning
                      className={
                        checkInformation.checkPassword({
                          password: state.newPassword,
                        }).color
                      }
                    >
                      {
                        checkInformation.checkPassword({
                          password: state.newPassword,
                        }).warning
                      }
                    </Warning>
                    <InputText>Confirm Password</InputText>
                    <Input
                      name="newPasswordConfirm"
                      value={state.newPasswordConfirm}
                      onChange={onChange}
                      type="password"
                      placeholder="8~20자 영문/숫자/기호"
                    />
                    <Warning
                      className={
                        checkInformation.checkPasswordConfirm({
                          password: state.newPassword,
                          passwordConfirm: state.newPasswordConfirm,
                        }).color
                      }
                    >
                      {
                        checkInformation.checkPasswordConfirm({
                          password: state.newPassword,
                          passwordConfirm: state.newPasswordConfirm,
                        }).warning
                      }
                    </Warning>
                  </>
                )}
                {updateLoading ? (
                  <LoadingComponentWrapper1>
                    <LoadingComponent size={'48px'} border={'5px'} />
                  </LoadingComponentWrapper1>
                ) : (
                  <UpdateButton onClick={onSubmit}>Update</UpdateButton>
                )}
              </>
            ) : (
              <form onSubmit={onCheck}>
                <InputText style={{ marginBottom: '10px' }}>Password</InputText>
                <Input name="password" value={state.password} onChange={onChange} type="password" />
                {loginLoading ? (
                  <LoadingComponentWrapper2>
                    <LoadingComponent size={'48px'} border={'5px'} />
                  </LoadingComponentWrapper2>
                ) : (
                  <CheckButton onClick={onCheck}>Edit Profile</CheckButton>
                )}
              </form>
            )}
          </ProfileWrapper>
        </ContentWrapper>
      </Wrapper>
    </Background>
  );
};

export default Profile;
