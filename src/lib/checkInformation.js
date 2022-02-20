const usernameFilter = /^[0-9a-zA-Z]+$/;
const passwordFilter = /^[0-9a-zA-Z!@#$%^&*()_+|<>?:{}]+$/;

export const checkUsername = ({ username, validUsername }) => {
  const validText = usernameFilter.test(username);
  const validLength = username.length >= 6 && username.length <= 12;
  let button, color, warning;
  if (username.length === 0) {
    button = 'disable';
    color = 'none';
    warning = 'none';
  } else if (!validText) {
    button = 'disable';
    color = 'red';
    warning = '* 영문과 숫자만 사용해야 합니다.';
  } else if (!validLength) {
    button = 'disable';
    color = 'red';
    warning = '* 6~12 글자여야 합니다.';
  } else if (!validUsername) {
    button = 'able';
    color = 'orange';
    warning = 'ID 중복 체크가 필요합니다.';
  } else {
    button = 'valid';
    color = 'green';
    warning = 'OK';
  }
  return {
    button,
    color,
    warning,
  };
};
export const checkNickname = ({ nickname }) => {
  const validLength = nickname.length >= 2 && nickname.length <= 6;
  let color, warning;
  if (nickname.length === 0) {
    color = 'none';
    warning = 'none';
  } else if (!validLength) {
    color = 'red';
    warning = '* 2~6 글자여야 합니다.';
  } else {
    color = 'green';
    warning = 'OK';
  }
  return {
    color,
    warning,
  };
};
export const checkPassword = ({ password }) => {
  const validText = passwordFilter.test(password);
  const validLength = password.length >= 8 && password.length <= 20;
  let color, warning;
  if (password.length === 0) {
    color = 'none';
    warning = 'none';
  } else if (!validText) {
    color = 'red';
    warning = '* 영문, 숫자, 기호만 사용해야 합니다.';
  } else if (!validLength) {
    color = 'red';
    warning = '* 8~20 글자여야 합니다.';
  } else {
    color = 'green';
    warning = 'OK';
  }
  return {
    color,
    warning,
  };
};
export const checkPasswordConfirm = ({ password, passwordConfirm }) => {
  const validConfirm = password === passwordConfirm;
  let color, warning;
  if (passwordConfirm.length === 0) {
    color = 'none';
    warning = 'none';
  } else if (!validConfirm) {
    color = 'red';
    warning = '* 비밀번호가 일치하지 않습니다.';
  } else {
    color = 'green';
    warning = 'OK';
  }
  return {
    color,
    warning,
  };
};
export const canRegister = (state) => {
  if (checkUsername(state).color !== 'green') {
    return 'ID를 확인해 주세요.';
  } else if (checkNickname(state).color !== 'green') {
    return '닉네임을 확인해 주세요.';
  } else if (checkPassword(state).color !== 'green') {
    return '비밀번호를 확인해 주세요.';
  } else if (checkPasswordConfirm(state).color !== 'green') {
    return '비밀번호를 확인해 주세요.';
  } else {
    return 'OK';
  }
};
