let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;
let score = 0;

$('.restart-button').hide();

let directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"

};

let drawBorder = function(){
	ctx.fillStyle = "Gray";
	ctx.fillRect(0,0,width,blockSize);
	ctx.fillRect(0,height-blockSize,width,blockSize);
	ctx.fillRect(0,0,blockSize,height);
	ctx.fillRect(width-blockSize,0,blockSize,height)

}
let drawScore = function(){


	ctx.font = "20px Courier";
	ctx.fillStyle = "Black";
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.fillText("Score: " + score, blockSize,blockSize)


}

let Block = function(col,row){
	this.col = col;
	this.row = row;
}
drawBorder();
drawScore();

Block.prototype.drawSquare = function(color){
	ctx.fillStyle = color;
	ctx.fillRect(this.col * blockSize, this.row * blockSize, blockSize, blockSize)
}
let circle = function(x,y,radius,fillCircle){
	ctx.beginPath();
	ctx.arc(x,y,radius,0,Math.PI*2,false);
	if(fillCircle){
		ctx.fill();
	} else {
		ctx.stroke();
	}
}
Block.prototype.drawCircle = function(color){
	ctx.fillStyle = color;
	circle(this.col * blockSize + blockSize / 2, this.row * blockSize + blockSize / 2, blockSize / 2, true);
	
}

Block.prototype.equal = function(otherBlock){
	return (this.col === otherBlock.col && this.row === otherBlock.row);
}



let Snake = function(){
	this.segments = [
		new Block(7,5),
		new Block(6,5),
		new Block(5,5)
	]

	this.direction = "right";
	this.nextDirection = "right";
}

Snake.prototype.draw = function(){
	for(let i = 0; i < this.segments.length; i++){
		this.segments[i].drawSquare("blue");
	}
}
let snake =new Snake();


Snake.prototype.move = function(){
	let head = this.segments[0];
	let newHead;

	this.direction = this.nextDirection;

	if(this.direction === "down"){
		newHead = new Block(head.col,head.row + 1);
	} 
	else if(this.direction === "right"){
		newHead = new Block(head.col + 1, head.row);
	}
	else if(this.direction === "up"){
		newHead = new Block(head.col, head.row - 1)
	}
	else if(this.direction === "left"){
		newHead = new Block(head.col - 1, head.row);
	}

	if(this.checkCollision(newHead)){
		gameOver();
		return;
	}

	this.segments.unshift(newHead);

	if(newHead.equal(apple.position)){
		score++;
		apple.move();
	} else {
		this.segments.pop();
	}
}

Snake.prototype.checkCollision = function(head){
	let topCollision = (head.row === 0);
	let rightCollision = (head.col === heightInBlocks - 1);
	let leftCollision = (head.col === 0);
	let bottomCollision = (head.row === heightInBlocks - 1);

	let wallCollision = topCollision || rightCollision || leftCollision || bottomCollision;

	let selfCollision = false;

	for(let i = 0; i < this.segments.length; i++){
		if(head.equal(this.segments[i])){
			selfCollision = true;
		}
	}

	return wallCollision || selfCollision;
}



$("body").keydown(function(event){
	let direct = directions[event.keyCode];
	if(direct !== undefined){
		snake.setDirection(direct);
	}
});


Snake.prototype.setDirection = function(newDirection){
	if(this.direction === "right" && newDirection === 'left'){
		return;
	}
	else if(this.direction === "up" && newDirection === 'down'){
		return;
	}
	else if(this.direction === "left" && newDirection === 'right'){
		return;
	}
	else if(this.direction === "down" && newDirection === 'up'){
		return;
	}

	this.nextDirection = newDirection;

}

let Apple = function(){
	this.position = new Block(10,10);
}
let apple = new Apple();
Apple.prototype.draw = function(){
	this.position.drawCircle("Red");
}
Apple.prototype.move = function (){
	let randCol = Math.floor(Math.random()*(widthInBlocks-2))+1;
	let randRow = Math.floor(Math.random()*(heightInBlocks-2))+1;
	this.position = new Block(randCol,randRow)

}
let intervalId = setInterval(function () {
 ctx.clearRect(0, 0, width, height);
 drawScore();
 snake.move();
 snake.draw();
 apple.draw();
 drawBorder();
}, 100);




$('.restart-button').click(function(){
	$('.restart-button').hide();
	score = 0;
    snake = new Snake();
	apple = new Apple();
    intervalId = setInterval(function () {
	ctx.clearRect(0, 0, width, height);
	drawScore();
	snake.move();
	snake.draw();
	apple.draw();
	drawBorder();
	}, 100);
})

let gameOver = function () {
 clearInterval(intervalId);
 ctx.font = "60px Courier";
 ctx.fillStyle = "Black";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Game Over", width / 2, height / 2);
 $('.restart-button').show();

}