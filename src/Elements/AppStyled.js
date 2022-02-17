import styled from "styled-components";

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
  display: flex;
  padding: 7px 15px;
  transition: width 0.25s linear 0s;
  cursor: pointer;
  transition-delay: 0.25s;
  &:hover > span {
    width: 50px;
  }
`;

export const PopOverListItemDelete = styled(PopOverListItem)`
  background-color: #333;
  color: #fff;
  &:hover svg {
    color: #fff;
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
  right: 0;
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
