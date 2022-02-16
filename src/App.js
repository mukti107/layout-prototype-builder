import React from 'react';
import { v4 as uuid} from 'uuid';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import layouts, {layoutGroups} from './layouts';
import { find } from 'lodash';
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
    console.log('==> dest', destination);

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
    margin-right: 200px;
`;

const Item = styled.div`
    display: flex;
    user-select: none;
    padding: 0;
    margin: 0 0 0.5rem 0;
    
    line-height: 1.5;
    border-radius: 3px;
    background: #fff;
    border: 1px
        ${(props) => (props.isDragging ? 'dashed #4099ff' : 'solid #ddd')};
    img{
        width: 100%;
    }
`;

const Handle = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    user-select: none;
    margin: -0.5rem 0.5rem -0.5rem -0.5rem;
    padding: 0.5rem;
    line-height: 1.5;
    border-radius: 3px 0 0 3px;
    background: #fff;
    border-right: 1px solid #ddd;
    color: #000;
`;

const List = styled.div`
    border: 1px
        ${(props) => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
    background: #fff;
    padding: 0.5rem 0.5rem 0;
    border-radius: 3px;
    flex: 0 0 150px;
    font-family: sans-serif;
`;

const Kiosk = styled(List)`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 200px;
`;

const Container = styled(List)`
    margin: 0.5rem 0.5rem 1.5rem;
    background: #ccc;
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

    // const items = [];
    // const setItems = () => {};

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        console.log('==> result', result);

        // dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                setItems(
                    reorder(
                        items,
                        source.index,
                        destination.index
                    )
                );
                break;
            case 'ITEMS':
                setItems(copy(find(layouts, {id: draggableId}), items, source, destination));
                break;
            default:
                setItems(
                    move(items, items, source, destination)
                );
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
                            <div>
                                <b>{layoutGroup.name}</b>
                                {layoutGroup.layouts.map((layout, index) => <Draggable
                                    key={layout.id}
                                    draggableId={layout.id}
                                    index={index}>
                                    {(draggableProvided, draggableSnapshot) => (
                                        <React.Fragment>
                                            <Item
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                isDragging={draggableSnapshot.isDragging}
                                                style={
                                                    draggableProvided.draggableProps.style
                                                }>
                                                <img alt={layout.name} src={layout.variations.light} />
                                            </Item>
                                            {draggableSnapshot.isDragging && (
                                                <Item>
                                                    <img alt={layout.name} src={layout.variations.light} />
                                                </Item>
                                            )}
                                        </React.Fragment>
                                    )}
                                </Draggable>)}
                            </div>
                        ))}
                    </Kiosk>
                )}
            </Droppable>
            <Content>
                <Droppable droppableId="page">
                    {(dropableProvided, droppableSnapshot) => (
                        <Container
                            ref={dropableProvided.innerRef}
                            isDraggingOver={droppableSnapshot.isDraggingOver}>
                            {items.length
                                ? items.map((item, index) => (
                                      <Draggable
                                          key={item.id}
                                          draggableId={item.id}
                                          index={index}>
                                          {(dragableProvided, draggableSnapshot) => (
                                              <Item
                                                  ref={dragableProvided.innerRef}
                                                  {...dragableProvided.draggableProps}
                                                  isDragging={
                                                      draggableSnapshot.isDragging
                                                  }
                                                  style={
                                                      dragableProvided.draggableProps
                                                          .style
                                                  }>
                                                  <Handle
                                                      {...dragableProvided.dragHandleProps}>
                                                      <svg
                                                          width="24"
                                                          height="24"
                                                          viewBox="0 0 24 24">
                                                          <path
                                                              fill="currentColor"
                                                              d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                          />
                                                      </svg>
                                                  </Handle>
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
