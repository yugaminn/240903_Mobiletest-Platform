// script.js

let scale = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;

// Handle mouse wheel for zoom
document.addEventListener('wheel', (event) => {
    event.preventDefault();

    if (event.deltaY > 0) {
        // Zoom out
        scale -= 0.1;
    } else {
        // Zoom in
        scale += 0.1;
    }

    scale = Math.max(0.1, Math.min(scale, 10)); // Set scale limits
    updateTransform();
});

// Handle mouse events for drag
mapImage.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX - posX;
    startY = event.clientY - posY;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        posX = event.clientX - startX;
        posY = event.clientY - startY;
        updateTransform();
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Handle touch events for drag and zoom
mapImage.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
        // Single touch for drag
        isDragging = true;
        startX = event.touches[0].clientX - posX;
        startY = event.touches[0].clientY - posY;
    } else if (event.touches.length === 2) {
        // Pinch-to-zoom
        handlePinchStart(event);
    }
});

document.addEventListener('touchmove', (event) => {
    if (isDragging && event.touches.length === 1) {
        // Drag
        posX = event.touches[0].clientX - startX;
        posY = event.touches[0].clientY - startY;
        updateTransform();
    } else if (event.touches.length === 2) {
        // Zoom with pinch
        handlePinchMove(event);
    }
});

document.addEventListener('touchend', (event) => {
    if (event.touches.length === 0) {
        isDragging = false;
    }
});

function updateTransform() {
    mapImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

// Handle pinch-to-zoom
let initialDistance = null;

function handlePinchStart(event) {
    const distance = getTouchDistance(event);
    if (distance) {
        initialDistance = distance;
    }
}

function handlePinchMove(event) {
    const distance = getTouchDistance(event);
    if (distance && initialDistance) {
        const zoomChange = distance / initialDistance;
        scale *= zoomChange;
        scale = Math.max(0.1, Math.min(scale, 10)); // Set scale limits
        updateTransform();
        initialDistance = distance;
    }
}

function getTouchDistance(event) {
    const [touch1, touch2] = event.touches;
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
