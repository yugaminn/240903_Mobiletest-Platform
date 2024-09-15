let scale = 1;
let isDragging = false;

mapImage.onpointermove = function(event){
    if(event.buttons){
        this.style.left     = this.offsetLeft + event.movementX + 'px'
        this.style.top      = this.offsetTop  + event.movementY + 'px'
        this.style.position = 'absolute'
        this.draggable      = false
        // this.setPointerCapture(event.pointerId)
    }
}

mapArea.addEventListener('wheel', (event) => {
    event.preventDefault();
    const scaleFactor = 1 + event.deltaY * -0.01;
    scale = Math.min(Math.max(1, scale * scaleFactor), 4);

    mapImage.style.transform = `scale(${scale})`;
}, {passive: false });

document.getElementById("map_reset").addEventListener("click", mapButtonClick);
function mapButtonClick() {
    mapImage.style.transform = `scale(1)`;
    mapImage.style.left     = '0px';
    mapImage.style.top     = '0px';
}