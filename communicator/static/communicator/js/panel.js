$(document).ready(function () {
    const canvas = document.getElementById("panel");
    const context = canvas.getContext("2d");
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    let coordinatesHistory = []
    let dCoordinates = {'x': 0, 'y': 0}

    $('#panel').on('coordinates', function (event) {
        let newCoordinates = event.detail;
        if (coordinatesHistory.length < 2){
            coordinatesHistory.push(newCoordinates);
        } else {
            coordinatesHistory[0] = coordinatesHistory[1];
            coordinatesHistory[1] = newCoordinates;
            dCoordinates.x = (newCoordinates.x - coordinatesHistory[0].x)*10000;
            dCoordinates.y = (newCoordinates.y - coordinatesHistory[0].y)*10000;
        }
    })

    function Button(name, width, plusX){
        this.plusX = plusX;
        this.width = width;
        this.path = undefined;
        this.selected = false;
        this.name = name
        this.timer = null;
    }

    Button.prototype.drawButton = function (){
        this.path = new Path2D()
        this.path.rect(25 + this.plusX,25,this.width,this.width)
        this.path.closePath()

//draw your shape data to the context
        if (this.selected){
            context.fillStyle = "rgba(154,152,152,0.5)";
        } else {
            context.fillStyle = "rgba(225,225,225,0.5)";
        }
        context.fill(this.path);
        context.lineWidth = 3;
        context.strokeStyle = "#245488FF";
        context.stroke(this.path);
    }
    Button.prototype.deleteSelection = function () {
        this.timer = null;
        this.selected = false;
    }
    Button.prototype.handleSelection = function (){
        const nowTime = new Date();
        if (!this.selected){
            this.selected = true;
            this.timer = new Date();
        } else if (nowTime.getSeconds() - this.timer.getSeconds() > 3){
            let downEvent = new CustomEvent(this.name);
            canvas.dispatchEvent(downEvent);
            this.deleteSelection();
        }
    }
    function Cursor (x, y){
        this.x=x;
        this.y=y;
        this.r=5
    }
    Cursor.prototype.drawCursor = function (){
        context.beginPath();
        context.fillStyle = '#000000';
        context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        context.fill();
        context.closePath();
    };
    Cursor.prototype.moveCursor = function (dX, dY){
        this.x+=dX;
        this.y+=dY;
        if (this.x+dX-this.r<=0 || this.x+dX+this.r>=canvas.width){
            this.x-=dX;
        }
        if (this.y+dY - this.r<=0 || this.y+dY+this.r>=canvas.height){
            this.y-=dY;
        }
    }
    let c = new Cursor(110, 50);
    const button1 = new Button('button1', canvas.width/3.5,  0);
    const button2 = new Button('button2', canvas.width/3.5,  canvas.width/3);
    const button3 = new Button('button3', canvas.width/3.5,  2*canvas.width/3);

    function drawPanel(){
        button1.drawButton();
        button2.drawButton();
        button3.drawButton();
        c.drawCursor();
    }

    function choiceEvent(){
        if (context.isPointInPath(button1.path, c.x, c.y)){
            button1.handleSelection();
        } else {
            button1.deleteSelection();
        }
        if (context.isPointInPath(button2.path, c.x, c.y)){
            button2.handleSelection();
        } else {
            button2.deleteSelection();
        }
        if (context.isPointInPath(button3.path, c.x, c.y)){
            button3.handleSelection();
        } else {
            button3.deleteSelection();
        }
    }

    function panelLoop(){
        context.clearRect(0,0, canvas.width, canvas.height);
        console.log(canvas.height, canvas.width)
        drawPanel();
        choiceEvent();
        c.moveCursor(dCoordinates.x, dCoordinates.y);
        requestAnimationFrame(panelLoop);
    }
    panelLoop();
});
