const slotSize =			30;
const inventoryMaxSize = 	9;
const getInventorySize = 	function(){
								const size = Math.floor((canvas.width * 2/4)/(slotSize + 10) - 1);
								if(size > inventoryMaxSize) return inventoryMaxSize;
								else return size;
							}
const calcSlotY = 				() => canvas.height - 60 + (50 - slotSize)/2;
const calcDistBetweenSlots =  	() => (canvas.width * 2/4 - (5 + slotSize)*2)/getInventorySize();
player.inventory = {
	x:					canvas.width * 1/4,
	y:					canvas.height - 60,
	width:				canvas.width * 2/4,
	height:				50,
	slots:				getInventorySize(),
	slot:				[],
	slotY: 				calcSlotY(),
	distBetweenSlots: 	calcDistBetweenSlots(),
	cHeight: 			canvas.height,
	cWidth:				canvas.width,
	selectedSlot: 0,
	update:				function(){
							if(this.cHeight != canvas.height || this.cWidth != canvas.width){
								this.x = canvas.width * 1/4;
								this.y=	canvas.height - 60,
								this.width = canvas.width * 2/4,
								this.height = 50,
								this.slots = getInventorySize(),
								this.slotY = calcSlotY(),
								this.distBetweenSlots = calcDistBetweenSlots(),
								this.cHeight = canvas.height,
								this.cWidth = canvas.width,
								makeSlotArr();
							}
						},
	render:				function(){
							//ctx.save();
							ctx.fillStyle = "rgba(48, 48, 38, 0.850)";
							ctx.fillRect(this.x,this.y,this.width,this.height);
							this.drawSlots();
							//ctx.restore();
						},
	drawSlots:			function(){
							let currentLocation = this.x + this.distBetweenSlots;
							for(let i=0;i<this.slots;i++){
								if(i == this.selectedSlot){
									ctx.lineWidth = 2.5;
									const realSize = ctx.lineWidth/2;
									ctx.strokeStyle = "#35FFFF";
									ctx.strokeRect(currentLocation-realSize,this.slotY-realSize,slotSize + realSize*2,slotSize + realSize*2);
								}
								if(this.slot[i].stack.length > 0){
									ctx.font = '15px serif';
									ctx.fillStyle = "#FFFFFF";  /*(this.slot[i].stack[0].name == "wood")? "#000000" : "#FFFFFF"*/;
									if(itemProperties[this.slot[i].stack[0].name] != undefined)
										ctx.drawImage(itemProperties[this.slot[i].stack[0].name].dropSkin,currentLocation,this.slotY,30,30);
									ctx.fillText(this.slot[i].stack.length,currentLocation + 30 - 7.5 - 7.5*parseInt(this.slot[i].stack.length/10),this.slotY + 30 - 2);
								}
								else {
									ctx.fillStyle = "rgba(255, 255, 255, 0.350)";
									ctx.fillRect(currentLocation,this.slotY,30,30);
								}
								currentLocation += this.distBetweenSlots;
							}
						},
	push:				function(item){
							for(let i=0;i<this.slots;i++)
								if(this.slot[i].push(item)) return true;
							return false;
						},
	clear:				function(){
							const inv = player.inventory;
							for(let i=0;i<inv.slot.length;i++)
								inv.slot[i].stack.splice(0,inv.slot[i].stack.length);
						}
}
player.inventory.itemSlot = function(id = 0) {
	let me = {
		id: 		id,
		stack: 		[],
		stackSize: 	10
	}
	me.push = 			function(item){
							if(this.stack.length != 0 && this.stack[0].name != item.name) return false;
							if(this.stack.length < this.stackSize){
								this.stack.push(item);
								return true;
							}
							else return false
						}
	me.drop = 			function(bool = 0){
							if(!bool){
								for(let i=0;i<this.stack.length;i++)
									map.inventory.push(this.stack[i],player.x + player.width/2,player.y + player.height/2);
								this.stack.splice(0,this.stack.length);
							}
							else{
								if(bool > this.stack.length) bool = this.stack.length;
								for(let i=0;i<bool;i++)
									map.inventory.push(this.stack[i],player.x + player.width/2,player.y + player.height/2);
								this.stack.splice(0,bool);
							}
						}
	return me;
}
const makeSlotArr = 	function(){
							if(player.inventory.slot.length > 0)
								if(player.inventory.slots > player.inventory.slot.length){
									var missingSlots = player.inventory.slots - player.inventory.slot.length;
									for(let i=0;i<missingSlots;i++)
										player.inventory.slot.push(player.inventory.itemSlot(player.inventory.slot.length));
								}else{
									for(let i=player.inventory.slot.length-1;i>=player.inventory.slots;i--)
										player.inventory.slot[i].drop()
									player.inventory.slot.splice(player.inventory.slots,player.inventory.slot.length-player.inventory.slots);
								}
							else{
								player.inventory.slot.splice(0,player.inventory.slot.length);
								for(let i=player.inventory.slot.length;i<player.inventory.slots;i++)
									player.inventory.slot.push(player.inventory.itemSlot(i));
							}
						}
makeSlotArr();
/*
	ctx.filter = 'blur(2px)';
	ctx.font = '48px serif';
	ctx.fillStyle = "#404040"
	ctx.fillRect(0,0,50,50);
	ctx.filter = 'blur(5px)';
	ctx.fillStyle = "#696969"
	ctx.fillRect(20,20,50,50);
*/