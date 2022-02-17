import React from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import layouts, { layoutGroups } from "./layouts";
import { find } from "lodash";
import {
  LayoutItem,
  Layouts,
  LayoutWrap,
  PopFeature,
  PopOverList,
  PopOverListImg,
  PopOverListItem,
  PopOverListItemDelete,
  PopOverListLabel,
  PopOverWrap,
} from "./Elements/AppStyled";
import "./App.css";
// import console = require('console');

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (item, destination, droppableSource, droppableDestination) => {
  console.log("==> dest", destination);

  const destClone = Array.from(destination);

  destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
  return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const Content = styled.div`
  margin-left: 20px;
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
  border-radius: 3px;
  position: relative;
  background: #fff;
  border: 1px ${(props) => (props.isDragging ? "dashed #4099ff" : "solid #ddd")};
  img {
    width: 100%;
  }
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
`;

const List = styled.div`
  background: #fff;
  flex: 0 0 150px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  position: fixed;
  top: 0;
  left: -230px;
  bottom: 0;
  width: 250px;
  transition: 0.6s ease-in-out;
  background-color: black;
  color: #fff;
  z-index: 1;
  &:hover {
    left: 0;
  }
`;

const Container = styled(List)`
  min-height: 100vh;
  //   background: #ccc;
  padding: 50px;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

export default function App() {
  const [items, setItems] = React.useState([]);
  const [showLayout, setShowLayout] = React.useState(null);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    console.log("==> result", result);

    // dropped outside the list
    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        setItems(reorder(items, source.index, destination.index));
        break;
      case "ITEMS":
        setItems(
          copy(find(layouts, { id: draggableId }), items, source, destination)
        );
        break;
      default:
        setItems(move(items, items, source, destination));
        break;
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="ITEMS" isDropDisabled={true}>
        {(dropableProvided, dropableSnapshot) => (
          <Kiosk
            ref={dropableProvided.innerRef}
            isDraggingOver={dropableSnapshot.isDraggingOver}
          >
            {layoutGroups.map((layoutGroup) => (
              <LayoutWrap>
                <LayoutItem
                  type="button"
                  onClick={() => setShowLayout(layoutGroup.id)}
                >
                  {layoutGroup.name}
                </LayoutItem>
                {showLayout === layoutGroup.id ? (
                  <Layouts
                    showLayout={showLayout}
                    className={showLayout ? "fade" : ""}
                  >
                    {layoutGroup.layouts.map((layout, index) => (
                      <Draggable
                        key={layout.id}
                        draggableId={layout.id}
                        index={index}
                      >
                        {(draggableProvided, draggableSnapshot) => (
                          <React.Fragment>
                            <Item
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              style={draggableProvided.draggableProps.style}
                            >
                              <img
                                alt={layout.name}
                                src={layout.variations.light}
                              />
                            </Item>
                            {draggableSnapshot.isDragging && (
                              <Item>
                                <img
                                  alt={layout.name}
                                  src={layout.variations.light}
                                />
                              </Item>
                            )}
                          </React.Fragment>
                        )}
                      </Draggable>
                    ))}
                  </Layouts>
                ) : null}
              </LayoutWrap>
            ))}
          </Kiosk>
        )}
      </Droppable>
      <Content>
        <Droppable droppableId="page">
          {(dropableProvided, droppableSnapshot) => (
            <Container
              ref={dropableProvided.innerRef}
              isDraggingOver={droppableSnapshot.isDraggingOver}
            >
              {items.length
                ? items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(dragableProvided, draggableSnapshot) => (
                        <Item
                          onMouseOver={() => setShowLayout(null)}
                          ref={dragableProvided.innerRef}
                          {...dragableProvided.draggableProps}
                          isDragging={draggableSnapshot.isDragging}
                          style={dragableProvided.draggableProps.style}
                        >
                          <PopOverWrap>
                            <PopOverList>
                              <PopOverListItem>
                                <PopOverListImg
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <title />
                                  <path
                                    d="M21.32,10.05l-1.74-.58a8,8,0,0,0-.43-1.05L20,6.79a1,1,0,0,0-.19-1.15L18.36,4.22A1,1,0,0,0,17.21,4l-1.63.82a8,8,0,0,0-1.05-.43L14,2.68A1,1,0,0,0,13,2H11a1,1,0,0,0-.95.68L9.47,4.42a8,8,0,0,0-1.05.43L6.79,4a1,1,0,0,0-1.15.19L4.22,5.64A1,1,0,0,0,4,6.79l.82,1.63a8,8,0,0,0-.43,1.05l-1.74.58A1,1,0,0,0,2,11v2a1,1,0,0,0,.68.95l1.74.58a8,8,0,0,0,.43,1.05L4,17.21a1,1,0,0,0,.19,1.15l1.42,1.42A1,1,0,0,0,6.79,20l1.63-.82a8,8,0,0,0,1.05.43l.58,1.74A1,1,0,0,0,11,22h2a1,1,0,0,0,.95-.68l.58-1.74a8,8,0,0,0,1.05-.43l1.63.82a1,1,0,0,0,1.15-.19l1.42-1.42A1,1,0,0,0,20,17.21l-.82-1.63a8,8,0,0,0,.43-1.05L21.32,14A1,1,0,0,0,22,13V11A1,1,0,0,0,21.32,10.05ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Z"
                                    fill="#464646"
                                  />
                                </PopOverListImg>
                                <PopOverListLabel>Move</PopOverListLabel>
                              </PopOverListItem>
                              <PopOverListItemDelete>
                                <PopOverListImg
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <title />
                                  <g data-name="1" id="_1">
                                    <path d="M356.65,450H171.47a41,41,0,0,1-40.9-40.9V120.66a15,15,0,0,1,15-15h237a15,15,0,0,1,15,15V409.1A41,41,0,0,1,356.65,450ZM160.57,135.66V409.1a10.91,10.91,0,0,0,10.9,10.9H356.65a10.91,10.91,0,0,0,10.91-10.9V135.66Z" />
                                    <path d="M327.06,135.66h-126a15,15,0,0,1-15-15V93.4A44.79,44.79,0,0,1,230.8,48.67h66.52A44.79,44.79,0,0,1,342.06,93.4v27.26A15,15,0,0,1,327.06,135.66Zm-111-30h96V93.4a14.75,14.75,0,0,0-14.74-14.73H230.8A14.75,14.75,0,0,0,216.07,93.4Z" />
                                    <path d="M264.06,392.58a15,15,0,0,1-15-15V178.09a15,15,0,1,1,30,0V377.58A15,15,0,0,1,264.06,392.58Z" />
                                    <path d="M209.9,392.58a15,15,0,0,1-15-15V178.09a15,15,0,0,1,30,0V377.58A15,15,0,0,1,209.9,392.58Z" />
                                    <path d="M318.23,392.58a15,15,0,0,1-15-15V178.09a15,15,0,0,1,30,0V377.58A15,15,0,0,1,318.23,392.58Z" />
                                    <path d="M405.81,135.66H122.32a15,15,0,0,1,0-30H405.81a15,15,0,0,1,0,30Z" />
                                  </g>
                                </PopOverListImg>
                                <PopOverListLabel>Delete</PopOverListLabel>
                              </PopOverListItemDelete>
                            </PopOverList>
                            <PopOverList>
                              <Handle {...dragableProvided.dragHandleProps}>
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                  />
                                </svg>
                              </Handle>
                              <PopOverListLabel>Delete</PopOverListLabel>
                            </PopOverList>
                          </PopOverWrap>
                          {/* {JSON.stringify(item)} */}
                          <img alt={item.name} src={item.variations.light} />
                        </Item>
                      )}
                    </Draggable>
                  ))
                : !dropableProvided.placeholder && (
                    <Notice>Drop items here</Notice>
                  )}
              {dropableProvided.placeholder}
            </Container>
          )}
        </Droppable>
      </Content>
    </DragDropContext>
  );
}
