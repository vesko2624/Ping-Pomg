let currentTime = Date.now(),
	currentTime1 = Date.now(),
	tempFps = 0, tempTicks = 0;
const camera = {
	render:			function(){
						ctx.clearRect(0,0,canvas.width,canvas.height);
						ctx.drawImage(map.skin,0,0,mapWidth,mapHeight,canvas.width/2 - player.x,canvas.height/2 - player.y,mapWidth,mapHeight);
					},
}
const statistics = {
	updateFps: 		function(){
						tempFps++;
						if(Date.now() - currentTime > 1000){
							currentTime = Date.now();
							fps = tempFps;
							tempFps = 0;
						}
					},
	updateTicks:	function(){
						tempTicks++;
						if(Date.now() - currentTime1 > 1000){
							currentTime1 = Date.now();
							ticks = tempTicks;
							tempTicks = 0;
						}
					},
	renderFps:		function(){
						ctx.font = "15px serif";
						ctx.fillStyle = "#000000"
						const string = "FPS: " + fps;
						ctx.fillText(string, canvas.width - string.length * 7.5, 7.5 + 3.75) // height = 3/4 fontSize | width = fontSize / 2
					},
	renderTicks:	function(){
						ctx.font = "15px serif";
						ctx.fillStyle = "#000000"
						const string = "TPS: " + ticks;
						ctx.fillText(string, 0, 7.5 + 3.75) // height = 3/4 fontSize | width = fontSize / 2
					},
	update:			function(){
						this.updateFps();
						this.updateTicks();
					},
	render:			function(){
						this.renderFps();
						this.renderTicks();
					},
}