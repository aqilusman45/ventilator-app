import styled from 'styled-components/native';

export const Header = styled.View`
  flex: 1;
  padding-top: 50px;
  padding-bottom: 30px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: row;
  background-color: #354650;
  justify-content: space-evenly;
  align-items: center;
`;

export const ConnectionContainer = styled.View`
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-direction: column;
  padding-left: 30px;
  text-align: center;
  flex: 1;
`;

export const ConnectionLabel = styled.Text`
  color: white;
  text-align: center;
  width: 80%;
  font-size: 18px;
`;
