let onMouseDown = [];
const keys = {
	Left:	false,
	Right:	false,
	Up:		false,
	Down:	false,
	move:	function(direction,bool = true){
				switch(direction){
					case "Left":
						this.Left = bool;
						if(bool) player.hDirection = -1;
						else{
							if(!this.Right) player.hDirection = 0;
							else this.move("Right");
						}
						break;
					case "Right":
						this.Right = bool;
						if(bool) player.hDirection = 1;
						else{
							if(!this.Left) player.hDirection = 0;
							else this.move("Left");
						}
						break;
					case "Up":
						this.Up = bool;
						if(bool) player.vDirection = -1;
						else{
							if(!this.Down) player.vDirection = 0;
							else this.move("Down");
						}
						break;
					case "Down":
						this.Down = bool;
						if(bool) player.vDirection = 1;
						else{
							if(!this.Up) player.vDirection = 0;
							else this.move("Up");
						}
						break;
				}
			},
	stop:	function(){
				this.move("Left",false);
				this.move("Right",false);
				this.move("Up",false);
				this.move("Down",false);
			}
}
let E,Q;
function eFunc(){
	player.inventory.selectedSlot++;
	if(player.inventory.selectedSlot + 1 > player.inventory.slots)
		player.inventory.selectedSlot = 0;
}
function qFunc(){
	player.inventory.selectedSlot--;
	if(player.inventory.selectedSlot < 0)
		player.inventory.selectedSlot = player.inventory.slots - 1;
}
const setDirection = function(){
						let Direction = 0;
						if(player.hDirection == -1) Direction = 1;
						else 
							if(player.hDirection == 1) Direction = 5;
						if(player.vDirection == -1){
							if(Direction == 0) Direction = 3;
							else{
								if(Direction == 5) Direction--;
									else if(Direction == 1) Direction++;
							}
						}
						else{
							if(player.vDirection == 1){
								if(Direction == 0) Direction = 7;
								else{
									if(Direction == 5) Direction++;
										else Direction = 8;
								}
							}
						}
						player.Direction = Direction;
					}
let Hitting = 0, Breaking = 1, Sleep = 0, SleepTimeout = 0;
function PauseHit(){
	Sleep = 1;
	let playerBounds = rect(player.bounds.x - player.spdX,player.bounds.y - player.spdY,player.bounds.width + player.spdX * 2,player.bounds.height + player.spdY * 2);
	objPos = objects.getByPossition(playerBounds);
	Breaking = !Breaking;
	if(objPos == undefined || objects[objPos].hp <= 0){
		clearInterval(Hitting);
		Hitting = 0;
		Sleep = 0;
		Breaking = 1;
	}
	else {
		console.log("	Breaking... ");
		objects[objPos].hp-= playerSrc.weapons.dmg[player.upgrades.weapon];
	}
	SleepTimeout = 0;
}
const Listen = function(){
	document.body.onkeydown = function(e){
		e.preventDefault();
		//Do sth ...
		if(e.keyCode >= 49 && e.keyCode <= 49 + player.inventory.slots - 1) player.inventory.selectedSlot = e.keyCode - 49;
		if(e.key.slice(0,5) == "Arrow"){
			keys.move(e.key.slice(5,e.key.length));
			setDirection();
		}
		switch(e.keyCode){ // @ TODO Fix diagonal walk breaking
			case 32: //Space
				const Direction = (player.Direction - 1)/2;
				const Directions = ["Left","Up","Right","Down"];
				/*const Diagonals = ["UpLeft","UpRight","DownLeft","DownRight"];
				const x = player.x + ((Direction == 2)? player.width + 3 : ((Direction == 0)? -3 : 0));
				const y = player.y + ((Direction == 3)? player.height + 3 : ((Direction == 1)? -3 : 0));*/
				if(player.prevent[Directions[Direction]]){
					if(!Hitting){
						Hitting = setInterval(	function(){
													if(Sleep){
														if(!SleepTimeout){
															SleepTimeout = setTimeout(PauseHit,playerSrc.weapons.sleep[player.upgrades.weapon]);
														}
													}
													else PauseHit();
												},playerSrc.weapons.timings[player.upgrades.weapon]); // Consider changing the timing speed
					}
				}
				else{
					//When there are no objects around
					clearInterval(Hitting);
					Sleep = 0;
					Hitting = 0;
					Breaking = 1;
				}
				break;
			case 66: // B
				if(!browsing) openShop();
				else closeShop();
				break;
			case 69: // E
				// @TODO
				break;
			case 71: // G
				player.inventory.slot[player.inventory.selectedSlot].drop((e.ctrlKey? 0 : 1));
				break;
			case 81: // Q 1000/10 good enough for the Loop]
				// @TODO
				break;
		}
		
	}
	document.body.onkeyup = function(e){
		e.preventDefault();
		//Do sth ...
		if(e.key.slice(0,5) == "Arrow"){
			keys.move(e.key.slice(5,e.key.length),false);
			if(player.hDirection || player.vDirection) setDirection();
		}
		switch(e.keyCode){
			case 32:
				clearInterval(Hitting);
				Sleep = 0;
				Hitting = 0;
				SleepTimeout = 0;
				Breaking = 1;
				break;
			case 69: // E
				// @TODO
				break;
			case 81: // Q
				// @TODO
				break;
		}
	}
	document.body.onmousedown = function(e){
		e.preventDefault();
		for(let i=0;i<onMouseDown.length;i++)
			onMouseDown[i](e);
	}
	document.body.onblur = function(){
		keys.stop();
		
	}
	document.getElementById('ctx').oncontextmenu = function(e){
		e.preventDefault();
	}
}