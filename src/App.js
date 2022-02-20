import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Home from 'components/Home';
import Login from 'components/auth/Login';
import Signup from 'components/auth/Signup';
import Profile from 'components/auth/Profile';
import Room from 'components/Room';
import LoadingComponent from 'components/LoadingComponent';

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

const App = ({ socket }) => {
  const me = useSelector((store) => store.chat.me);
  if (!me)
    return (
      <Background>
        <LoadingComponent size={'100px'} border={'5px'} />
      </Background>
    );
  else
    return (
      <Switch>
        <Route path="/" exact render={() => <Home socket={socket} />} />
        <Route path="/login" exact render={() => <Login socket={socket} />} />
        <Route path="/signup" exact render={() => <Signup socket={socket} />} />
        <Route path="/profile" exact render={() => <Profile socket={socket} />} />
        <Route path="/room" render={() => <Room socket={socket} />} />
      </Switch>
    );
};

export default App;
