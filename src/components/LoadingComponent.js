import React from "react";
import styled from "styled-components";

const Loading = styled.div`
  border-style: solid;
  border-color: black;
  border-top-color: white;
  border-right-color: white;
  border-radius: 100%;
  animation: spin 1s infinite linear;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const LoadingComponent = ({ size, border }) => {
  return <Loading style={{ width: size, height: size, borderWidth: border }} />;
};

export default LoadingComponent;
