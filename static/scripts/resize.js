const rightResizer = document.getElementById('horizontalDragRight');
const leftResizer = document.getElementById('horizontalDragLeft');

const leftSide = document.getElementById('left');
const center = document.getElementById('center');
const rightSide = document.getElementById('right');

// The current position of mouse for the right side
let rightX = 0;
let rightY = 0;

let leftX = 0;
let leftY = 0;

// Width of centerRight side
let centerWidth = 0;

// ? event handelers for the right hand side
// 
// 

const mouseDownHandlerRight = function(e) {
    console.log("rightside")
    // Get the current mouse position
    rightX = e.clientX;
    rightY = e.clientY;
    centerWidth = center.getBoundingClientRect().width;

    console.log(centerWidth)

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandlerRight);
    document.addEventListener('mouseup', mouseUpHandlerRight);
};

const mouseMoveHandlerRight = function(e) {
    // How far the mouse has been moved
    // console.log(`${e.clientX}, ${window.innerWidth}`)
    const dx = e.clientX - rightX;
    // const dy = e.clientY - rightY;

    if (e.clientX > window.innerWidth) return;

    const newcenterWidth = (centerWidth + dx) * 100 / rightResizer.parentNode.getBoundingClientRect().width;
    // console.log(`${newcenterWidth}`)
    center.style.width = `${newcenterWidth}%`;

    rightResizer.style.cursor = 'col-resize';

    center.style.userSelect = 'none';
    center.style.pointerEvents = 'none';

    rightSide.style.userSelect = 'none';
    rightSide.style.pointerEvents = 'none';
};

const mouseUpHandlerRight = function() {
    rightResizer.style.removeProperty('cursor');

    center.style.removeProperty('user-select');
    center.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandlerRight);
    document.removeEventListener('mouseup', mouseUpHandlerRight);
};

// Attach the handler
rightResizer.addEventListener('mousedown', mouseDownHandlerRight);

// ? event handelers for the Left hand side
// 
// 

const mouseDownHandlerLeft = function(e) {
    console.log("leftside")
    // Get the current mouse position
    leftX = e.clientX;
    leftY = e.clientY;
    
    leftWidth = left.getBoundingClientRect().width;
    centerWidth = center.getBoundingClientRect().width;

    console.log(leftWidth)

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandlerLeft);
    document.addEventListener('mouseup', mouseUpHandlerLeft);
};

const mouseMoveHandlerLeft = function(e) {
    // How far the mouse has been moved
    // console.log(`${e.clientX}, ${window.innerWidth}`)
    const dx = e.clientX - leftX;
    // const dy = e.clientY - leftY;

    if (e.clientX > window.innerWidth) return;

    const newLeftWidth = (leftWidth + dx) * 100 / leftResizer.parentNode.getBoundingClientRect().width;

    // console.log(`${newcenterWidth}`)
    left.style.width = `${newLeftWidth}%`;

    // console.log(center.style.width)
    // left.style.width = `${newLeftWidth}%`;

    leftResizer.style.cursor = 'col-resize';

    center.style.userSelect = 'none';
    center.style.pointerEvents = 'none';

    rightSide.style.userSelect = 'none';
    rightSide.style.pointerEvents = 'none';
};

const mouseUpHandlerLeft = function() {
    leftResizer.style.removeProperty('cursor');

    center.style.removeProperty('user-select');
    center.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandlerLeft);
    document.removeEventListener('mouseup', mouseUpHandlerLeft);
};

// Attach the handler
leftResizer.addEventListener('mousedown', mouseDownHandlerLeft);