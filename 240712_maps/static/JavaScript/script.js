let scale = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;

const mapImage = document.getElementById('mapImage');

document.addEventListener('wheel', (event) => {
    event.preventDefault();

    if (event.deltaY > 0) {
        // Zoom out
        scale -= 0.1;
    } else {
        // Zoom in
        scale += 0.1;
    }

    scale = Math.max(1, Math.min(scale, 3)); // Set scale limits
    updateTransform();
});

mapImage.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX - posX;
    startY = event.clientY - posY;
    console.log(startX);
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        posX = event.clientX - startX;
        posY = event.clientY - startY;
        updateTransform();
        console.log(posX);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    console.log("end");
});

function updateTransform() {
    mapImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}