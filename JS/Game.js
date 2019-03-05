const canvas 		= document.getElementById("ctx")
const ctx 			= canvas.getContext("2d");
const 	mapWidth 	= 1000,
		mapHeight 	= 1000;
const 	tileHeight 	= 40,
		tileWidth 	= 40;
let ticks			= 60;
let fps				= 60;
let debug			= 0;
const itemIds = {
					"wood": 	1,
					"stone": 	2,
					"leaves":	3,
				};
const itemProperties = {
	"wood": 	{
					sheetSkin: new Image(),
					dropSkin: new Image(),
					health:10 * 100
				},
	"stone": 	{
					sheetSkin: new Image(),
					dropSkin:	new Image(),
					health: 20 * 100
				},
	"leaves": 	{sheetSkin: new Image(), dropSkin:	new Image()}
}
itemProperties["wood"].dropSkin.src		= "IMG/Items/woodDrop.png";
itemProperties["stone"].dropSkin.src	= "IMG/Items/stoneDrop.png";
itemProperties["wood"].sheetSkin.src	= "IMG/Items/tree/rings.png";
itemProperties["stone"].sheetSkin.src	= "IMG/Items/stoneSheet.png";
itemProperties["leaves"].sheetSkin.src	= "IMG/Items/tree/crown.png";
itemProperties["leaves"].dropSkin.src	= "IMG/Items/leavesDrop.png";
Object.freeze(itemIds);
const item = function(name){ // State : idle, hand | Position: inventory, map | Possession: Player, object
	me = 	{
				id:			itemIds[name],
				name:		name
				/*state:		state,
				possession:	possession,
				position:	position*/
			}
	return me;
}

let makeMap = 	function(){
					let tempMap = [];
					for(let i=0;i < mapWidth/tileWidth;i++){
						let row = [];
						for(let j=0;j<mapHeight/tileHeight;j++)
							row.push(1);
						tempMap.push(row);
					}
					return tempMap;
				}
const map = makeMap();
map.skin = new Image();
map.skin.src = "IMG/Background.png";
map.collide = 	function(rect){
					if(rect.x + rect.width > mapWidth) 		player.x = mapWidth - rect.width;
					else if(rect.x < 0) 					player.x = 0;
					if(rect.y + rect.height > mapHeight) 	player.y = mapHeight - rect.height;
					else if(rect.y < 0) 					player.y = 0;
					rect = player.bounds;
					const diagDiviser = 2;
					const spdX = Math.floor(player.spdX);
					const LB = this.valid({x:rect.x - spdX, y:rect.y + rect.height/2,name:"LB"});
					const RB = this.valid({x:rect.x + rect.width + spdX, y:rect.y + rect.height/2,name:"RB"});
					const UB = this.valid({x:rect.x + rect.width/2, y:rect.y - spdX,name:"UB"});
					const DB = this.valid({x:rect.x + rect.width/2, y:rect.y + rect.height + spdX,name:"DB"});
					const LUB = this.valid({x:rect.x, y:rect.y + spdX,name:"LUB"});
					const LDB = this.valid({x:rect.x, y:rect.y + rect.height - spdX,name:"LDB"});
					const RUB = this.valid({x:rect.x + rect.width, y:rect.y + spdX,name:"RUB"});
					const RDB = this.valid({x:rect.x + rect.width, y:rect.y + rect.height - spdX,name:"RDB"});
					
					const ULB = this.valid({x:rect.x + spdX, y: rect.y,name:"ULB"});
					const URB = this.valid({x:rect.x + rect.width - spdX,y:rect.y,name:"URB"});
					const DLB = this.valid({x:rect.x + spdX,y:rect.y + rect.height-1,name:"DLB"});
					const DRB = this.valid({x:rect.x + rect.width - spdX,y:rect.y + rect.height-1,name:"DRB"});
					player.prevent.Left 	= (LB || LUB || LDB);
					//if(player.prevent.Left) player.x = Math.floor(player.x / tileWidth) * tileWidth + tileWidth - 1;
					player.prevent.Right	= (RB || RUB || RDB);
					//if(player.prevent.Right) player.x = Math.floor((player.x + player.width) / tileWidth) * tileWidth - tileWidth + 12;
					player.prevent.Up		= (UB || ULB || URB);
					//if(player.prevent.Up) player.y = Math.floor(player.y / tileHeight) * tileHeight + tileHeight - 1;
					player.prevent.Down		= (DB || DLB || DRB);
					//if(player.prevent.Down) player.y = Math.floor((player.y + player.height) / tileHeight) * tileHeight - tileHeight + 12;
					if(debug){
						console.log(LB + " " + LUB + " " + LDB);
						console.log(RB + " " + RUB + " " + RDB);
						console.log(UB + " " + ULB + " " + URB);
						console.log(DB + " " + DLB + " " + DRB);
						debug = false;
					}
				}
map.valid = 	function(pos){
					const x = Math.floor(pos.x/tileWidth);
					const y = Math.floor(pos.y/tileHeight);
					try{
						if(map[y][x] == 0) return true;
					}catch(Error){
						return false;
					}
					return false;
				}
map.inventory = {
	itemHeight: 20,
	itemWidth: 20,
	size:	0,
	stack:	[],
	Group:	[],
	render:			function(){
						for(let i=0;i<this.Group.length;i++){
							if(this.Group[i].length < 1){
								this.Group.splice(i,1);
								this.Group.reArrange();
								continue;
							}
							if(	this.Group[i].x + this.itemWidth < player.x - canvas.width/2	||
								this.Group[i].x > player.x + player.width + canvas.width/2		||
								this.Group[i].y + this.itemHeight < player.y - canvas.height/2	||
								this.Group[i].y > player.y + player.height + canvas.height/2) continue;
							if(itemProperties[this.Group[i][0].name] != undefined)
								ctx.drawImage(itemProperties[this.Group[i][0].name].dropSkin,this.Group[i].x + canvas.width/2 - player.x,this.Group[i].y + canvas.height/2 - player.y,this.itemWidth,this.itemHeight);
						}
					},
	update:			function(){
						this.Group.update();
						for(let i=0;i<this.Group.length;i++){
							if(this.Group[i].length < 1){
								this.Group.splice(i,1);
								this.Group.reArrange();
								continue;
							}
							itemBounds = rect(this.Group[i].x,this.Group[i].y,this.itemWidth,this.itemHeight);
							if(itemBounds.collide(player.bounds) && this.Group[i].cd == 0){
								if(player.inventory.push(item(this.Group[i][0].name))) this.pop(i);
							}
						}
					},
	push:			function(item,x,y,count = 1){
						x = Math.floor(x),y = Math.floor(y);
						for(let i=0;i<count;i++){
							const tempItem = {
								id: 0,
								groupId: 0,
								name: item.name,
								itemId: item.id,
							}
							let j = 0;
							if(this.Group.length == 0){
								this.Group.push([]);
								this.Group[0].push(tempItem);
								this.Group[0].cd = ticks;
							}
							else{
								for(;j<this.Group.length;j++) if(this.Group[j].x == x && this.Group[j].y == y && this.Group[j][0].name == tempItem.name) break;
								if(j >= this.Group.length || this.Group.length == 0) this.Group.push([]);
								this.Group[j].push(tempItem);
								this.Group[j].cd = ticks;
							}
							this.Group[j].x = x; this.Group[j].y = y;
							tempItem.groupId = j;
							tempItem.id = this.Group[j].length;
							if(this.Group[j].id != this.Group.length - 1) this.Group[j].id = this.Group.length - 1;
						}
					},
	reArrange:		function(groupId = 0){
						if(groupId == 0){
							for(let i=0;i<this.Group.length;i++){
								if(this.Group[i].id != i) this.Group[i].id = i;
								for(let j=0;j<this.Group[i].length;j++){
									this.Group[i][j].id = j;
									this.Group[i][j].groupId = i;
								}
							}
						}else for(let j=0;j<this.Group[groupId].length;j++){
							console.log(this.Group[groupId][j].id + " " + j);
							this.Group[groupId][j].id = j;
						};
					},
	pop:			function(groupId){
						if(this.Group.length < 1) return new Error("There are no items left on the map.");
						if(this.Group.length < groupId) return new Error("Group not found.");
						else
							this.removeN(groupId,this.Group[groupId].length - 1,1)
					},
	removeN:		function(groupId,i,n){
						let ReArr = false;
						if(this.Group.length < 1) return new Error("There are no items left on the map.");
						if(i + n != this.Group[groupId].length) ReArr = true;
						this.Group[groupId].splice(i,n);
						if(ReArr) this.reArrange(groupId);
					},
	removeByGroupId:function(groupId){
							if(this.Group.length < 1) return new Error("No groups.");
							if(this.Group.length <= groupId) return new Error("Group with id: " + groupId + " was not found");
							this.removeN(groupId,0,this.Group[groupId].length);
						},
	removeGroup:	function(group){
						if(!group.hasOwnProperty("id") && !group.hasOwnProperty("gropId")) return new Error("Group not found.");
						else if(group.length == undefined) group = group.groupId;
						else if(group.length && group.hasOwnProperty("id")) group = group.id;
						this.removeN(group,0,this.Group[group].length);
						return true;
					},
	removeByItemId:	function(itemId){
						let arr = []
						if(this.Group.length < 1) return new Error("There are no items left on the map.");
						for(let i=0;i<this.Group.length;i++)
							if(this.Group[i][0].itemId == itemId){
								this.Group.splice(i,1);
								this.Group.reArrange();
								i--;
							}
					},
	removeByName:	function(name){
						this.removeByItemId(itemIds[name]);
					},
	clear:			function(){
						return this.Group.splice(0,this.Group.length);
					}
}
map.inventory.Group.reArrange = 	function(){
									const inv = map.inventory;
									for(let i=0;i<inv.Group.length;i++){
										if(inv.Group[i].length < 1){
											inv.Group.splice(i,1);
											inv.Group.reArrange();
											i--;
											continue;
										}
										//console.log(inv.Group);
										if(inv.Group[i][0].groupId != i)
											for(let j=0;j<inv.Group[i].length;j++) inv.Group[i][j].groupId = i;
										inv.Group[i].id = i;
									}
								}
map.inventory.Group.update = 	function(){
									const me = map.inventory.Group
									for(let i=0;i<me.length;i++){
										if(me[i].cd > 0) me[i].cd--;
									}
								}