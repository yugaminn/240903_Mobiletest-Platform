document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.querySelector('.map-container');
    const mapImage = document.getElementById('mapImage');

    let scale = 1;
    let startX, startY, initialLeft, initialTop;
    let isDragging = false;
    let initialDistance = 0;

    // スケール変更反映
    const applyTransform = () => {
        mapImage.style.transform = `scale(${scale})`;
        // constrainMapPosition();
    };

    // 移動幅制限
    const constrainMapPosition = () => {
        // const containerRect = mapContainer.getBoundingClientRect();
        // const mapRect = mapImage.getBoundingClientRect();
        
        // // Calculate the boundaries
        // const maxLeft = Math.min(containerRect.width, mapRect.left);
        // const minLeft = Math.max(mapRect.left, -1*mapRect.width);
        // const maxTop = Math.min(containerRect.height, mapRect.top);
        // const minTop = Math.max(mapRect.top, -1*mapRect.height);

        // const newLeft = 0.95*Math.min(Math.abs(maxLeft), Math.abs(minLeft));
        // const newTop = 0.95*Math.min(Math.abs(maxTop), Math.abs(minTop));

        // mapImage.style.left = `${newLeft}px`;
        // mapImage.style.top = `${newTop}px`;


        let containerRect = mapContainer.getBoundingClientRect();
        let mapRect = mapImage.getBoundingClientRect();

        let maxLeft = Math.min(mapRect.left, (containerRect.left + containerRect.width));
        let minLeft = Math.max((mapRect.width + mapRect.left), containerRect.left);

        let newLeft = Math.min(Math.abs(maxLeft), Math.abs(minLeft));

        mapImage.style.left = `${newLeft}px`;

        console.log("i----------");
        console.log(mapRect.left);
        console.log(containerRect.left);
        console.log(containerRect.width);

        console.log(maxLeft);
        console.log(minLeft);
        // console.log(maxTop);
        // console.log(minTop);
        console.log(newLeft);
        // console.log(newTop);
        console.log("f----------");
    };

    // ピンチ検出
    const getDistance = (touches) => {
        if (touches.length < 2) return 0;
        const [touch1, touch2] = touches;
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    //　スクロール検出
    mapContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        const rect = mapImage.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const scaleFactor = 1 + event.deltaY * -0.01;
        scale = Math.min(Math.max(0.1, scale * scaleFactor), 4);

        // Adjust position based on scaling
        const newLeft = offsetX - offsetX * scaleFactor + parseFloat(mapImage.style.left || 0);
        const newTop = offsetY - offsetY * scaleFactor + parseFloat(mapImage.style.top || 0);
        mapImage.style.left = `${newLeft}px`;
        mapImage.style.top = `${newTop}px`;

        applyTransform();
    });

    // 押し下げ検出
    mapImage.onpointermove = function(event){
        if(event.buttons){
            this.style.left     = this.offsetLeft + event.movementX + 'px'
            this.style.top      = this.offsetTop  + event.movementY + 'px'
            this.style.position = 'absolute'
            this.draggable      = false
            this.setPointerCapture(event.pointerId);

            console.log(this.offsetLeft + event.movementX + 'px');
            console.log(this.offsetTop  + event.movementY + 'px');

            // constrainMapPosition(); 
        }
    }
    
    // タッチ検出
    mapContainer.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch' && event.isPrimary) {
            initialDistance = getDistance(event.getCoalescedEvents().slice(0, 2));
        }
    });

    // ひっぱり検出
    mapContainer.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch' && event.isPrimary && initialDistance) {
            const currentDistance = getDistance(event.getCoalescedEvents().slice(0, 2));
            if (currentDistance > 0) {
                const scaleFactor = currentDistance / initialDistance;
                scale = Math.min(Math.max(0.1, scale * scaleFactor), 4);
                applyTransform();
                initialDistance = currentDistance;
            }
        }
    });

    // 話検出
    mapContainer.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'touch') {
            initialDistance = 0;
        }
    });

    applyTransform();
});