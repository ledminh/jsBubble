const container = document.querySelector(".container");
const engine = getEngine(300, 10, 40, container);

engine.run();




function getEngine(numBubbles, radiusMin, radiusMax, userDefinedContainer) {
    const bubblesArr = [];
    const timeInterval = 2, spaceInterval = 2;
    let runAgainAt = -1;

    const container = userDefinedContainer? userDefinedContainer : document.body;
    let containerBox = container.getBoundingClientRect();
    
    const isTouchBottom = (top, radius) => top + radius*2 >= containerBox.height;
    const isTouchRoof = (top) => top <= 0;
    const isTouchLeftWall = (left) => left <= 0; 
    const isTouchRightWall = (left, radius) => left + radius*2 >= containerBox.width;
    
    const isOutsideRight = (left, radius) => left + radius*2 >= containerBox.width;
    const isOutsideBottom = (top, radius) => top + radius*2 >= containerBox.height;


    const randNumBetween = (a, b) => Math.random()*(b - a) + a;
    
    
    const createBubbleElem = (b) => {
        const bubble = document.createElement('div');
        bubble.classList.add("bubble");

        bubble.style.top = b.top + "px";
        bubble.style.left = b.left + "px";

        bubble.style.width = b.radius*2 + "px";
        bubble.style.height = b.radius*2 + "px";

        bubble.style.backgroundColor = `rgb(${b.color.red}, ${b.color.green}, ${b.color.blue})`
        
        return bubble;
    }

    const createBubble = () => {
        const radius = randNumBetween(radiusMin, radiusMax);

        return {
            top: randNumBetween(0, containerBox.height - radius*2),
            left: randNumBetween(0, containerBox.width - radius*2),
            radius: radius,
            direction: randNumBetween(0, 2*Math.PI),
            color: {
                red: randNumBetween(0, 255),
                green: randNumBetween(0,255),
                blue: randNumBetween(0,255)
            }
        }


    }

    const populateBubblesArrWithData = (num) => Array(num).fill(0).forEach(() => bubblesArr.push(createBubble()));

    function update() {
        bubblesArr.forEach(bubble => {
            if(isTouchBottom(bubble.top, bubble.radius) || isTouchRoof(bubble.top)){   
                bubble.direction = 2*Math.PI - bubble.direction;
            }
            else if(isTouchLeftWall(bubble.left) || isTouchRightWall(bubble.left, bubble.radius)) {
                bubble.direction = Math.PI - bubble.direction;
            }
        
            

            bubble.top = bubble.top + Math.sin(bubble.direction)*spaceInterval;
            bubble.left = bubble.left + Math.cos(bubble.direction)*spaceInterval;
        });
    }

    function render() {
        bubblesArr.forEach(bubble => {
            bubble.element.style.top = bubble.top + "px";
            bubble.element.style.left = bubble.left + "px";
        });
    }

    function animate() {
        if(Date.now() > runAgainAt) {
            update();
            render();
        }

        requestAnimationFrame(animate);
    }

    function onResize(e) {
        containerBox = container.getBoundingClientRect();

        bubblesArr.forEach((bubble) => {
            if(isOutsideRight(bubble.left, bubble.radius)){
                bubble.left = containerBox.width - bubble.radius*2;
            }
            else if(isOutsideBottom(bubble.top, bubble.radius)){
                bubble.top = containerBox.height - bubble.radius*2;
            }
        });
    }


    /***************************
     *  PUBLIC
     */
    function run() {
        populateBubblesArrWithData(numBubbles);

        container.style.backgroundColor = "black";
        container.style.position = "relative";
        container.style.overflow = "hidden";

        //Add element to bubblesArr and to body
        bubblesArr.forEach(bubble => {
            bubble.element = createBubbleElem(bubble);
            container.appendChild(bubble.element);

        })

        window.addEventListener('resize', onResize);
        
        runAgainAt = Date.now() + timeInterval;
        requestAnimationFrame(animate);
    
    }
    



    return {
        run
    }




}


