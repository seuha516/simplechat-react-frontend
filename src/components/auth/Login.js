import React, { useEffect, useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillChatDotsFill } from 'react-icons/bs';
import styled from 'styled-components';

import LoadingComponent from 'components/LoadingComponent';
import { init, login } from 'modules/user';
import { setMe } from 'modules/chat';

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
const LoginWrapper = styled.div`
  width: 90%;
  max-width: 270px;
  display: flex;
  flex-direction: column;
  font-family: 'Nanum Gothic', sans-serif;
`;
const InputText = styled.div`
  margin: 20px 0 5px 0;
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
`;
const LoadingComponentWrapper = styled.div`
  height: '64px';
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 70px 0 20px 0;
`;
const LoginButton = styled.div`
  margin: 70px 0 20px 0;
  width: 100%;
  height: 64px;
  border-radius: 20px;
  border: 2px solid #848484;
  font-size: 30px;
  letter-spacing: 2px;
  font-family: 'Yanone Kaffeesatz', sans-serif;
  background-color: #fffde1;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color cubic-bezier(0.11, 0.82, 0.44, 0.99) 1s 0s;
  &:hover {
    background-color: #e2dc85;
  }
`;

const Login = ({ socket }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user, loading } = useSelector(({ user, loading }) => ({
    user: user,
    loading: loading['user/LOGIN'],
  }));

  const [state, stateDispatch] = useReducer((state, action) => ({ ...state, [action.name]: action.value }), {
    username: '',
    password: '',
  });
  const onChange = (e) => stateDispatch(e.target);
  const onSubmit = (e) => {
    e.preventDefault();
    if (state.username === '') alert('ID를 입력해주세요.');
    else if (state.password === '') alert('비밀번호를 입력해주세요.');
    else dispatch(login(state));
  };

  useEffect(() => {
    if (user.user) {
      socket.emit('login', user.user);
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
    }
  }, [socket, user.user, user.loginError]);
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
          <AuthText to="/signup">Sign up →</AuthText>
        </AuthWrapper>
        <ContentWrapper>
          <LoginWrapper>
            <InputText>ID</InputText>
            <form onSubmit={onSubmit}>
              <Input name="username" value={state.username} onChange={onChange} type="text" />
            </form>
            <InputText>Password</InputText>
            <form onSubmit={onSubmit}>
              <Input name="password" value={state.password} onChange={onChange} type="password" />
            </form>
            {loading ? (
              <LoadingComponentWrapper>
                <LoadingComponent size={'58px'} border={'5px'} />
              </LoadingComponentWrapper>
            ) : (
              <LoginButton onClick={onSubmit}>Log in</LoginButton>
            )}
          </LoginWrapper>
        </ContentWrapper>
      </Wrapper>
    </Background>
  );
};

export default Login;
