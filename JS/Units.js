let objects = [];
const rect = function(x,y,w,h){
		const me = 			{
								x:			x,
								y:			y,
								width:		w,
								height:		h
							}
		me.collide = 		function(rect2){
								if (rect2.x+rect2.width < x || x+w < rect2.x || rect2.y+rect2.height < y || y+h < rect2.y)
									return false;
								else return true;
							}
		return me;
	}
const getDistance = 	function(rect1,rect2){
							let x1 = rect1.x + rect1.width/2,
								x2 = rect2.x + rect2.width/2;
							let y1 = rect1.y + rect1.height/2,
								y2 = rect2.y + rect2.height/2;
							return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
						}
const start = new Image();
start.src = "IMG/start.png";
let unit = function(type, x, y, width, height, hp = 0, spawnPoint = 0){
	let me = 			{
							type:		type,
							hp:			((hp == 0)? itemProperties[type].health : hp),
							x:			x + ((x%tileWidth>=tileWidth/2)?tileWidth-x%tileWidth : -(x%tileWidth)),
							y:			y + ((y%tileHeight>=tileHeight/2)?tileHeight-y%tileHeight : -(y%tileHeight)),
							width:	 	((width%tileWidth>tileWidth/2)? (width + (tileWidth - width%tileWidth)) : (width - width%tileWidth)),
							height: 	((height%tileHeight>tileHeight/2)? (height + (tileHeight - height%tileHeight)) : (height - height%tileHeight)),
							drawX: 		x + ((x%tileWidth>=tileWidth/2)?tileWidth-x%tileWidth : -(x%tileWidth)) + canvas.width/2 - player.x,
							drawY: 		y + ((y%tileHeight>=tileHeight/2)?tileHeight-y%tileHeight : -(y%tileHeight)) + canvas.height/2 - player.y,
							index:		unit.index++,
							spawnPoint:	spawnPoint,
							get bounds(){
								return rect(this.x, this.y,this.width,this.height);
							}
						}
	me.setWidth = 		function(width){ // 1 + 5 > 4
							width = width + ((me.x + width < 0)? me.x + width : ((me.x + width > mapWidth)? mapWidth - me.x - width : 0));
							me.width = ((width%tileWidth>tileWidth/2)? (width + (tileWidth - width%tileWidth)) : (width - width%tileWidth));
						}
	me.setHeight = 		function(height){
							height = height + ((me.y + height < 0)? me.y + height : ((me.y + height > mapHeight)? mapHeight - me.y - height : 0));
							me.height = ((height%tileHeight>tileHeight/2)? (height + (tileHeight - height%tileHeight)) : (height - height%tileHeight));
						}
	if(me.x + me.width > mapWidth){
		me.setWidth(mapWidth - me.x);
		width = mapWidth - me.x;
	}
	if(me.x + me.width < 0){
		me.setWidth(me.width - (me.x + me.width));
		width = me.width - (me.x + me.width);
	}
	if(me.y + me.height > mapHeight){
		me.setHeight(mapHeight - me.y);
		height = mapHeight - me.y;
	}
	if(me.y + me.height < 0){
		me.setHeight(me.height - (me.y + me.height));
		height = me.height - (me.y + me.height);
	}
	//console.log("Object Created at(" + me.x + ", " + me.y + ") with size(" + me.width + ", " + me.height + ") (" + width + ", " + height + ") ");
	me.drawOnMap = 		function(bool = 0){
							const x = me.x;
							const y = me.y;
							let startX = Math.floor(x/tileWidth), endX = Math.floor(startX + me.width/tileWidth);
							let startY = Math.floor(y/tileHeight), endY = Math.floor(startY + me.height/tileHeight);
							if(startX > endX){
								const temp = startX;
								startX = endX;
								endX = temp;
								delete temp;
							}
							if(startY > endY) {
								const temp = startY;
								startY = endY;
								endY = temp;
								delete temp;
							}
							for(var i = startY;i<endY;i++)
								for(var j = startX;j<endX;j++){
									map[i][j]=parseInt(bool);
								}
						}
	me.clearOnMap = 	function(){
							me.drawOnMap(1);
						}
	me.drawOnMap();
	me.render =			function(){
							if(this.spawnPoint == "spawn") ctx.drawImage(start,0,0,this.width,this.height,me.drawX,me.drawY,this.width,this.height);
							else{
								ctx.drawImage(itemProperties[me.type].sheetSkin,0,0,30,30,me.drawX,me.drawY,this.width,this.height);
								if(this.type == "wood" && getDistance(player.bounds,this.bounds) > 60){
									ctx.drawImage(itemProperties["leaves"].sheetSkin,0,0,100,100,me.drawX - 31, me.drawY - 31, 100,100);
								}
								else ctx.drawImage(itemProperties["leaves"].sheetSkin,100,0,100,100,me.drawX - 31, me.drawY - 31, 100,100);
							}
						}
	me.update =			function(){
							me.drawX = x + ((x%tileWidth>=tileWidth/2)?tileWidth-x%tileWidth : -(x%tileWidth)) + canvas.width/2 - player.x;
							me.drawY = y + ((y%tileHeight>=tileHeight/2)?tileHeight-y%tileHeight : -(y%tileHeight)) + canvas.height/2 - player.y;
							me.setWidth(width);
							me.setHeight(height);
							if(this.hp >= -(playerSrc.weapons.dmg[player.upgrades.weapon]) && this.hp <= 0) me.destroy();
						}
	me.collide =		function(rect){
							return me.bounds.collide(rect);
						}
	me.resize =			function(w,h){
							me.clearOnMap();
							width = w;height = h; // Because of the dummy update of width and height by the passed variables in the object creation
							me.setWidth(width);
							me.setHeight(height);
							me.drawOnMap();
						}
	me.remove = 		function(){
							objects.remove(me);
						}
	me.destroy = 		function(){
							const S = this.width * this.height;
							const Reward = S/400;
							for(let i=0;i<Reward;i++) map.inventory.push(item(this.type),this.x + this.width/2,this.y + this.height/2);
							if(this.type == "wood")
								for(let i=0;i<Reward/2;i++) map.inventory.push(item("leaves"),this.x + this.width/2,this.y + this.height/2);
							me.remove();
						}
	me.clear =			function(){
							me.clearOnMap();
						}
	return me;
}
unit.index = 0;
objects.getByPossition = function(rect){
							for(let i=0;i<objects.length;i++){
								if(rect.collide(objects[i].bounds)) return i;
							}
						}
objects.reArrange =		function(){
							for(let i=0;i<objects.length;i++)
								objects[i].index = i;
							unit.index = objects.length;
							objects.drawOnMap();
						}
objects.add =			function(unit){
							objects.push(unit);
							objects.drawOnMap();
						}
objects.remove =		function(obj, calledByOtherFunction = false){
							if(objects.length < 1) return new Error("There are no objects left");
							if(obj.length == undefined){
								if(obj.index != undefined) objects.removeN(obj.index,1,true);
							}
							else{
								console.log(obj.length);
								if(obj != objects)
									for(let i=0;i<obj.length;i++)
										objects.removeN(obj[i].index, 1, true);
								else
									objects.removeN(objects[0].index,objects.length,true);
							}
							if(!calledByOtherFunction) objects.reArrange();
						}
objects.removeN =		function(i,n,calledByOtherFunction = false){
							if(objects.length < 1) return new Error("There are no objects left");
							if(i > objects.length - 1 || i + n> objects.length) return new Error(objects + " " + i + " Doest not exists.");
							console.log(i + " " + n);
							for(let j=i;j<i+n;j++) objects[j].clear();
							objects.splice(i,n);
							objects.reArrange();
						}
objects.removeLast =	function(){
							if(objects.length < 1) return new Error("There are no objects left");
							objects[objects.length-1].clear();
							objects.pop();
							unit.index--;
						}
objects.removeByIndex = function(index){
							objects.remove(objects[index]);
						}
objects.update =		function(){
							for(let i=0;i<objects.length;i++)
								objects[i].update();
						}
objects.render =		function(){
							for(let i=0;i<objects.length;i++){
								if(	objects[i].x + objects[i].width < player.x - player.width/2 - canvas.width/2	||
									objects[i].x > player.x + player.width/2 + canvas.width/2		||
									objects[i].y + objects[i].height < player.y - player.height/2 - canvas.height/2	||
									objects[i].y > player.y + player.height/2 + canvas.height/2) continue;
								objects[i].render();
							}
						}
objects.drawOnMap =		function(){
							for(let i=0;i<objects.length;i++)
								objects[i].drawOnMap();
						}
objects.clearOnMap =	function(){
							for(let i=0;i<objects.length;i++)
								objects[i].clearOnMap();
						}