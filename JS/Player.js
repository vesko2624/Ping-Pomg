const speed = 200; // 1 speed at 200 ticks || 3.33 speed at 60 ticks
const realSpeed = 200/60;
const playerSrc = {
	tires: {
		normal: new Image(),
		rusty: 	new Image(),
		two:	new Image(),
		three:	new Image()
	},
	chassis: {
		armor:	new Image(), // 2.28
		normal:	new Image(),
		race: 	new Image(),
	},
	effects: {
		fire: 	new Image(),
		el:		new Image(),
	},
	weapons: {
		timings: 	[100,100,100,100,100,200],
		sleep:		[0,0,0,0,0,737],
		dmg: [25,20,10,15,35,399],
		firstClass: new Image(),
		secondClass: new Image(),
	}
}
/* ---- Tires ---- */
	playerSrc.tires.normal.src = "IMG/Player/tires/normal.png"; 
	playerSrc.tires.rusty.src = "IMG/Player/tires/rusty.png"; 
	playerSrc.tires.two.src = "IMG/Player/tires/two.png"; 
	playerSrc.tires.three.src = "IMG/Player/tires/three.png"; 
/* ---- ----- ---- */
/* ---- Chassis ---- */
	playerSrc.chassis.armor.src = "IMG/Player/chassis/armor.png"; 
	playerSrc.chassis.normal.src = "IMG/Player/chassis/normal.png";
	playerSrc.chassis.race.src = "IMG/Player/chassis/race.png";
/* ---- ------- ---- */
/* ---- Effects ---- */
	playerSrc.effects.fire.src =  "IMG/Player/effects/fi.png"
	playerSrc.effects.el.src =  "IMG/Player/effects/el.png"
/* ---- ------- ---- */
/* ---- Weapons ---- */
	playerSrc.weapons.firstClass.src = "IMG/Player/weapons/first_class.png"
	playerSrc.weapons.secondClass.src = "IMG/Player/weapons/second_class.png"
/* ---- ------- ---- */
const player = {
	color:		"#00FF00",
	x:			canvas.width/4 - 10,	// Spawn point
	y:			canvas.height/2 - 10,	// Spawn point
	width:		20,
	height:		20,
	hDirection:	0,
	vDirection:	0,
	prevent:	{
		Left:	false,
		Right:	false,
		Up:		false,
		Down:	false,
	},
	upgrades:	{
		weapon:			0,
		tireColor: 		0,
		chassisColor:	0,
		tires:			"normal",
		chassis:		"armor",
	},
	animate: 	{i:0,j:0,g:4},
	Direction:	0,
	spdX:		realSpeed.toFixed(2),
	spdY:		realSpeed.toFixed(2),
	get bounds(){
		return rect(this.x, this.y, this.width, this.height);
	},
	get getDirection(){
		return ["None","Left","LeftUp","Up","RightUp","Right","RightDown","Down","LeftDown"][this.Direction];
	},
	render:		function(){
					this.animate.render();
					this.inventory.render();
				},
	update:		function(){
					let animated = 0;
					if(this.x + this.width >= mapWidth && this.hDirection == 1) this.hDirection = 0;
					else if(this.x <= 0 && this.hDirection == -1) this.hDirection = 0;
					if(this.y + this.height >= mapHeight && this.vDirection == 1) this.vDirection = 0;
					else if(this.y <= 0 && this.vDirection == -1) this.vDirection = 0;
					map.collide(this.bounds);
					if((this.hDirection < 0 && !this.prevent.Left) || (this.hDirection > 0 && !this.prevent.Right)){
						if(!animated){
							this.animate.i++;
							animated = 1;
						}
						this.x += this.spdX * this.hDirection;
					}
					if((this.vDirection < 0 && !this.prevent.Up) || (this.vDirection > 0 && !this.prevent.Down)){
						if(!animated){
							this.animate.i++;
							animated = 1;
						}
						this.y += this.spdY * this.vDirection; // optional if
					}
					this.inventory.update();
				},
	teleport:	function(row,column){
					let maxRow,maxColumn;
				}
}
let Gillotine = 0;
player.animate.render = function(){
	const Directions = ["Up","Down","Left","Right"];
	let state = 0;
	let Direction = player.getDirection;
	// Remove LeftUp LeftDown RightUp and RightDown
	switch(Direction){
		case "None":				Direction = "Up";break;
		case "LeftUp": 				Direction = "Left";
			case "LeftDown":		Direction = "Left";break;
		case "RightUp":				Direction = "Right";
			case "RightDown":		Direction = "Right";break;
	}
	// Get the current direction index
	for(let i=0;i<Directions.length;i++) if(Direction == Directions[i]) state = i;
	// Draw chassis
	ctx.drawImage(playerSrc.chassis[player.upgrades.chassis],state*player.width,player.upgrades.chassisColor * 20,player.width,player.height, canvas.width/2, canvas.height/2, player.width, player.height);
	// protect from animation frame overflow
	if(player.animate.i > 40) player.animate.i = 0;
	if(player.upgrades.tires == "two" || player.upgrades.tires == "three")
		if(player.animate.i > 3) player.animate.i = 0;
	if(player.animate.j > 3) player.animate.j = 0;
	// Animate by the current direction
	if(state <= 1){
		let x = state*20,y;
		if(!state) y = player.animate.i;
		else y = 40 - player.animate.i;
		// Animate the tires
		if(player.upgrades.tires == "two" || player.upgrades.tires == "three"){
			if(!state) y = 60-player.animate.i * player.height;
			else y = player.animate.i * player.height;
			x = player.upgrades.tireColor * 40;
			//y = player.animate.i * player.height;
		}
		ctx.drawImage(playerSrc.tires[player.upgrades.tires],x,y,player.width,player.height,canvas.width/2,canvas.height/2,player.width,player.height);
	}
	if(state >= 2){
		let x = 0 ,y = (state-2)*player.height;
		if(!(state-2)) x =40 + player.animate.i;
		else x = 40 + 40 - player.animate.i;
		// Animate the tires
		if(player.upgrades.tires == "two" || player.upgrades.tires == "three"){
			if(!(state-2)) y = 60-player.animate.i * player.height;
			else y = player.animate.i * player.height;
			x = player.upgrades.tireColor * 40 + 20;
			//y = player.animate.i * player.height;
		}
		ctx.drawImage(playerSrc.tires[player.upgrades.tires],x,y,player.width,player.height,canvas.width/2,canvas.height/2,player.width,player.height);
	}
	// Animate Hitting
	//if(!Hitting) Breaking = 1;
	if(player.upgrades.weapon == 4){
		ctx.drawImage(playerSrc.weapons.secondClass,state*20,player.animate.j * 20, player.width,player.height,canvas.width/2,canvas.height/2,player.width,player.height);
		if(Hitting) player.animate.j++;
	}
	if(player.animate.g == 20) player.animate.g = 4;
	if(player.upgrades.weapon == 5){
		let start = 4,end = 13;
		ctx.drawImage(playerSrc.weapons.secondClass,state*20,player.animate.g*20,player.width,player.height,canvas.width/2,canvas.height/2,player.width,player.height);
		if(!Gillotine)
			Gillotine = setInterval(function(){
				player.animate.g++;
			},1000/19)
		else
			if(!Hitting)
				if(player.animate.g == 4){
					clearInterval(Gillotine)
					Gillotine = 0;
				}
	}
	else if(Breaking){
		ctx.drawImage(playerSrc.weapons.firstClass,state*20,player.upgrades.weapon * 20, player.width,player.height,canvas.width/2,canvas.height/2,player.width,player.height);
	}
}