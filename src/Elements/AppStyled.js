import styled from "styled-components";
import Sun from "../../src/images/sun.png";

export const LayoutWrap = styled.div``;

export const Layouts = styled.div`
  position: absolute;
  transform: translateX(100%);
  top: 0;
  right: 0;
  height: 100vh;
  background: #f2f2f2;
  padding: 15px;
  transform-origin: top right;
`;

export const LayoutItem = styled.button`
  padding: 15px;
  width: 100%;
  text-align: left;
  color: #fff;
  margin: 0;
  cursor: pointer;
  border: 0;
  background-color: transparent;
`;

export const PopOverListItem = styled.li`
  list-style: none;
  border-right: 1px solid #616161;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 7px 15px;
  transition: width 0.25s linear 0s;
  cursor: pointer;
  background-color: #333;
  color: #fff;
  transition-delay: 0.25s;
  &:hover > span {
    width: 60px;
  }
  &:last-child {
    border: 0;
  }
`;

export const PopOverListItemDelete = styled(PopOverListItem)`
  // background-color: #333;
  // color: #fff;
`;

export const PopOverListItemHandle = styled(PopOverListItem)`
  background-color: #fff;
  color: #333;
  border-radius: 45px 0 0 45px;
  > div {
    border: 0;
    padding: 0;
  }
`;

export const PopOverList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
`;

export const PopOverListImg = styled.svg`
  width: 20px;
`;

export const PopOverWrap = styled.div`
  right: -150px;
  top: 50px;
  transition: 0.3s ease-in-out;
  position: absolute;
  border-radius: 45px 0 0 45px;
  background-color: #fff;
  &:hover {
    right: 0;
  }
`;

export const PopOverListLabel = styled.span`
  width: 0;
  transition: width 0.25s linear 0s;
  transition-delay: 0.25s;
  padding-left: 5px;
  overflow: hidden;
`;

export const ToggleBox = styled.input`
  height: 100%;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  position: absolute;
  z-index: 1;
  margin: 0;
  &:checked + label {
    background: #666;
  }
  &:checked + label:after {
    left: calc(100% - 5px);
    transform: translateX(-100%);
    background-color: #fff;
  }
`;
export const ToggleLabel = styled.label`
  cursor: pointer;
  width: 48px;
  height: 30px;
  background: #fff;
  display: block;
  border-radius: 100px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    background-color: #333;
    background-size: cover;
    background-repeat: no-repeat;
    display: block;
    border-radius: 90px;
    transition: 0.3s;
  }
  &:active:after {
    background-color: #fff;
  }
`;
