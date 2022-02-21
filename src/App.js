import React, { useCallback, useRef } from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import layouts, { layoutGroups } from "./layouts";
import { find } from "lodash";
import {
  Kiosk,
  List,
  LayoutItem,
  Layouts,
  LayoutWrap,
  PopOverList,
  PopOverListImg,
  PopOverListItem,
  PopOverListItemDelete,
  PopOverListItemHandle,
  PopOverListLabel,
  PopOverWrap,
  ToggleBox,
  ToggleLabel,
  ExportBtn,
  BtnWrap,
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

  destClone.splice(droppableDestination.index, 0, {
    ...item,
    variant: "light",
    id: uuid(),
  });
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
  overflow: hidden;
  position: relative;
  background: #fff;
  // border: 1px ${(props) =>
    props.isDragging ? "dashed #4099ff" : "solid #ddd"};
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

function downloadTextASFile(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default function App() {
  const [items, setItems] = React.useState([]);
  const [showLayout, setShowLayout] = React.useState(null);

  const inputFile = useRef(null);
  console.log(JSON.stringify(items));

  const onFileUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        setItems(JSON.parse(e.target.result));
      } catch (e) {
        alert("Invalid file selected");
      }
    };
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const download = () =>
    items.length === 0
      ? ""
      : downloadTextASFile("text.txt", JSON.stringify(items));

  const activeLayoutGroup = find(layoutGroups, { id: showLayout });

  const handleDelete = (id) => {
    const RemoveItem = items.filter((item) => item.id !== id);
    setItems(RemoveItem);
  };

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
              </LayoutWrap>
            ))}

            <Layouts show={!!activeLayoutGroup}>
              {activeLayoutGroup &&
                activeLayoutGroup.layouts.map((layout, index) => (
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
              <BtnWrap>
                <ExportBtn type="submit" onClick={download}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-download"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </ExportBtn>
                <input
                  type="file"
                  ref={inputFile}
                  onChange={onFileUpload}
                  style={{ display: "none" }}
                />
                <ExportBtn onClick={onButtonClick}>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 44.44"
                  >
                    <defs></defs>
                    <title>Asset 64</title>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <path
                          class="cls-1"
                          d="M50.72,10.28a22.19,22.19,0,0,0-39.8,5,14.86,14.86,0,0,0,4,29.19H46.67a17.32,17.32,0,0,0,4-34.16ZM29.33,39.11H14.89a9.52,9.52,0,0,1-1.46-18.94l1.76-.27.43-1.73A16.86,16.86,0,0,1,46.71,14l.63,1.12,1.27.21A11.91,11.91,0,0,1,58.67,27.11a12.1,12.1,0,0,1-1,4.8,12,12,0,0,1-11,7.2h-12V26.86l3,3a2.67,2.67,0,0,0,3.77,0,2.68,2.68,0,0,0,0-3.78l-7.54-7.54a2.76,2.76,0,0,0-3.78,0l-7.54,7.54a2.67,2.67,0,1,0,3.77,3.78l3-3V39.11"
                        />
                      </g>
                    </g>
                  </svg>{" "}
                  Imports
                </ExportBtn>
              </BtnWrap>
              {items.length
                ? items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(dragableProvided, draggableSnapshot) => (
                        <Item
                          ref={dragableProvided.innerRef}
                          {...dragableProvided.draggableProps}
                          isDragging={draggableSnapshot.isDragging}
                          style={dragableProvided.draggableProps.style}
                        >
                          <PopOverWrap>
                            <PopOverList>
                              <PopOverListItemHandle
                                {...dragableProvided.dragHandleProps}
                              >
                                <Handle>
                                  <PopOverListImg
                                    viewBox="0 0 96 96"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <title />
                                    <path d="M94.2422,43.7578l-12-12a5.9994,5.9994,0,0,0-8.4844,8.4844L75.5156,42H54V20.4844l1.7578,1.7578a5.9994,5.9994,0,0,0,8.4844-8.4844l-12-12a5.9979,5.9979,0,0,0-8.4844,0l-12,12a5.9994,5.9994,0,0,0,8.4844,8.4844L42,20.4844V42H20.4844l1.7578-1.7578a5.9994,5.9994,0,0,0-8.4844-8.4844l-12,12a5.9979,5.9979,0,0,0,0,8.4844l12,12a5.9994,5.9994,0,1,0,8.4844-8.4844L20.4844,54H42V75.5156l-1.7578-1.7578a5.9994,5.9994,0,0,0-8.4844,8.4844l12,12a5.9979,5.9979,0,0,0,8.4844,0l12-12a5.9994,5.9994,0,0,0-8.4844-8.4844L54,75.5156V54H75.5156l-1.7578,1.7578a5.9994,5.9994,0,1,0,8.4844,8.4844l12-12A5.9979,5.9979,0,0,0,94.2422,43.7578Z" />
                                  </PopOverListImg>
                                </Handle>
                                <PopOverListLabel>Move</PopOverListLabel>
                              </PopOverListItemHandle>
                              <PopOverListItemDelete
                                onClick={() => handleDelete(item.id)}
                              >
                                <PopOverListImg
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <title />
                                  <g data-name="1" id="_1">
                                    <path
                                      d="M356.65,450H171.47a41,41,0,0,1-40.9-40.9V120.66a15,15,0,0,1,15-15h237a15,15,0,0,1,15,15V409.1A41,41,0,0,1,356.65,450ZM160.57,135.66V409.1a10.91,10.91,0,0,0,10.9,10.9H356.65a10.91,10.91,0,0,0,10.91-10.9V135.66Z"
                                      fill="#fff"
                                    />
                                    <path
                                      d="M327.06,135.66h-126a15,15,0,0,1-15-15V93.4A44.79,44.79,0,0,1,230.8,48.67h66.52A44.79,44.79,0,0,1,342.06,93.4v27.26A15,15,0,0,1,327.06,135.66Zm-111-30h96V93.4a14.75,14.75,0,0,0-14.74-14.73H230.8A14.75,14.75,0,0,0,216.07,93.4Z"
                                      fill="#fff"
                                    />
                                    <path
                                      d="M264.06,392.58a15,15,0,0,1-15-15V178.09a15,15,0,1,1,30,0V377.58A15,15,0,0,1,264.06,392.58Z"
                                      fill="#fff"
                                    />
                                    <path
                                      d="M209.9,392.58a15,15,0,0,1-15-15V178.09a15,15,0,0,1,30,0V377.58A15,15,0,0,1,209.9,392.58Z"
                                      fill="#fff"
                                    />
                                    <path
                                      d="M318.23,392.58a15,15,0,0,1-15-15V178.09a15,15,0,0,1,30,0V377.58A15,15,0,0,1,318.23,392.58Z"
                                      fill="#fff"
                                    />
                                    <path
                                      d="M405.81,135.66H122.32a15,15,0,0,1,0-30H405.81a15,15,0,0,1,0,30Z"
                                      fill="#fff"
                                    />
                                  </g>
                                </PopOverListImg>
                                <PopOverListLabel>Delete</PopOverListLabel>
                              </PopOverListItemDelete>
                              <PopOverListItem>
                                <div style={{ position: "relative" }}>
                                  <ToggleBox
                                    type="checkbox"
                                    id="switch"
                                    checked={item.variant === "dark"}
                                    onChange={({ target: { checked } }) =>
                                      setItems((items) =>
                                        items.map((_item) => {
                                          console.log(_item);
                                          if (_item.id !== item.id)
                                            return _item;
                                          return {
                                            ...item,
                                            variant: checked ? "dark" : "light",
                                          };
                                        })
                                      )
                                    }
                                  />
                                  <ToggleLabel></ToggleLabel>
                                </div>
                                <PopOverListLabel>Toggle</PopOverListLabel>
                              </PopOverListItem>
                            </PopOverList>
                          </PopOverWrap>
                          {/* {JSON.stringify(item)} */}
                          <img
                            alt={item.name}
                            src={item.variations[item.variant]}
                          />
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
