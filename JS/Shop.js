let browsing = 0;
let GUI = [];
const ListenAt = function(x,y,width,height){
	
}
const panel = function(x,y,w,h){
	let margin;
	let dist 			=	0;
	const maxDist 		= 	((x-h) - 3*40)/3;
	const desiredDist 	= 	50;
	const achievable 	= 	maxDist > desiredDist;
	if(achievable){
		margin = 40*3 + desiredDist*2;
		dist = desiredDist;
	}else if(maxDist > 20){
		maxDist /= 2;
		dist = maxDist;
		margin = maxDist;
	}else dist = maxDist;
	const me = {
		Button1:{
			x:(w-100)/2,
			y:margin,
			width: 100,
			height:40,
		},
		Button2:{
			x:(w-100)/2,
			y:margin + dist,
			width: 100,
			height: 40
		},
		Button3:{
			x:(w-100)/2,
			y:margin+dist*2,
			width: 100,
			height: 40
		}
	};
	me.render = function(){
					let Button1 = 5;
				}
	return me;
}
const drawCircle = 	function(x,y,r){
							ctx.beginPath;
							ctx.arc(x,y,r,0,2*Math.PI,false);
							ctx.fillStyle = "red";
							ctx.fill();
							ctx.endPath;
						}
const startButton = 	function(x,y,r){
							function buttonListener(e){
								if( e.which == 1){
									if(Math.floor(Math.sqrt(Math.pow((e.pageX - 9 - x),2) + Math.pow((e.pageY - 9 - y),2))) <= r)
										closeShop();
								}
							}
							for(let i=0;i<onMouseDown.length;i++) if(onMouseDown[i].name == buttonListener.name) return false;
							onMouseDown.push(buttonListener);
						}
const stopButton = 	function(){
							for(let i=0;i<onMouseDown.length;i++) 
							if(onMouseDown[i].name == "buttonListener"){
								onMouseDown.splice(i--,1);
							}
						}
const openShop = 	function(){
						if(browsing) return false;
						browsing = 1;
						if(canvas.height < 100 || canvas.width < 100) return false;
						let x = 100, y = 100, width = canvas.width - 200, height = canvas.height - 200;
						console.log("Shop oppened");
						const bt = new Image();
						bt.src = "IMG/Button.png";
						startButton(x+width,y,10);
						GUI.push({
								name: "Shop",
								//panel: panel(x,y,150,height);
								render:
									function(){
										ctx.fillStyle = "rgba(107,107,107,0.750)";
										ctx.fillRect(x,y,width,height);
										ctx.fillStyle = "rgba(123,123,123,0.850)";
										ctx.fillRect(x,y,150,height);
										ctx.drawImage(bt,x+width-10,y-10);
									},
								remove: function(){
										browsing = 0;
										stopButton();
										console.log("Shop closed");
									}
								});
						return true;
					}
const closeShop = 	function(){
						if(browsing){
							GUI.removeByName("Shop");
							return true;
						}
						return false;
					}
GUI.render =		function() {
						for(let i=0;i<GUI.length;i++){
							GUI[i].render();
						}
					}
GUI.removeByName = 	function(name){
						for(let i=0;i<GUI.length;i++){
							if(GUI[i].name == name){
								if(GUI[i].hasOwnProperty("remove")) GUI[i].remove();
								GUI.splice(i--,1);
							}
						}
					}