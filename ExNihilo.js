/*### Ex Nihilo PE v5.0 ####
##### Ex Nihilo PE is Ported to Minecraft Pocket Edition by Darkserver ####
##### Ex Nihilo is a mod for Minecraft on Pc made by Erasmus_Crowley ######
*/

/*##### TODO #####*/
/*	Crucibles
	Sieve
	Hammers - new defaultDestroyTime array -.-
	Planting Seeds
	Silkworms and infectedLeaves
	Recipes
	Slime Texture
	Make Slime Barrel randomly spawn slime
	Make Water Barrels randomly create moss stone 
	Make Witch Water barrels randomly create mycelium
	New sieve textures
	
*/

/* Custom Functions */
/* removes said amount from players carried item */
Player.removeFromCarriedItem = function(amount){
	if(Level.getGameMode() !== 1){ //not creative
		if(Player.getCarriedItemCount()>=2)Entity.setCarriedItem(Player.getEntity(),Player.getCarriedItem(),Player.getCarriedItemCount()-amount,Player.getCarriedItemData());
		if(Player.getCarriedItemCount()<=1)Entity.setCarriedItem(Player.getEntity(),0,0,0);
	}
};

/* return true if player is sneaking */
Player.isSneaking = function(){return Entity.isSneaking(Player.getEntity());};

/* total distance traveled over time */
ModPE.calcVelX = function(x1, x2, time){return (x2 - x1) / time;};
ModPE.calcVelY = function(y1, y2, time){return (y2 - y1) / time;};
ModPE.calcVelZ = function(z1, z2, time){return (z2 - z1) / time;};

/* save a file to world directory */
ModPE.saveFile = function(filename, content) {
	try {
		java.io.File(android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/").mkdirs();
		var newFile = new java.io.File(android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/", filename);
		newFile.createNewFile();
		var outWrite = new java.io.OutputStreamWriter(new java.io.FileOutputStream(newFile));
		outWrite.append(content);
		outWrite.close();
	} catch (err) {
		print(err);
	}
};

/* load a file from world directory */
ModPE.loadFile = function(filename) {
	var content = "";
	if (java.io.File( android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/" + filename).exists()) {
		var file = new java.io.File(android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/" + filename),
			fos = new java.io.FileInputStream(file),
			str = new java.lang.StringBuilder(),
			ch;
		while ((ch = fos.read()) != -1) {
			str.append(java.lang.Character(ch));
		}
		content = String(str.toString());
		fos.close();
	}
	return content;
};

var ExNihilo = {}; //Mod namespace
ExNihilo.barrels = []; //{x, y, z, compostAmount}

/* ExNihilo Tile Ids */
ExNihilo.tile = {};
ExNihilo.tile.barrel = 212;
ExNihilo.tile.stoneBarrel = 213;
ExNihilo.tile.dust = 214;
ExNihilo.tile.ironDust = 215;
ExNihilo.tile.goldDust = 216;
ExNihilo.tile.ironGravel = 217;
ExNihilo.tile.goldGravel = 218;
ExNihilo.tile.ironSand = 219;
ExNihilo.tile.goldSand = 220;
ExNihilo.tile.sieve = 221;
ExNihilo.tile.crucible = 222;
ExNihilo.tile.beeTrap = 223;
ExNihilo.tile.enderGravel = 224;
ExNihilo.tile.netherGravel = 225;
ExNihilo.tile.witchWater = 226;
ExNihilo.tile.infestedLeaves = 227;
ExNihilo.tile.barrelContents = 250;
ExNihilo.tile.sieveContents = 251;
ExNihilo.tile.crucibleContents = 252;

/* ExNihilo Item Ids */
ExNihilo.item = {};
/* Weapons */
ExNihilo.item.stone = 500;
ExNihilo.item.hammerWood = 501;
ExNihilo.item.hammerStone = 502;
ExNihilo.item.hammerIron = 503;
ExNihilo.item.hammerGold = 504;
ExNihilo.item.hammerDiamond = 505;
ExNihilo.item.crook = 506;
ExNihilo.item.crookBone = 507;

/* Seeds */
ExNihilo.item.seedGrass = 508;
ExNihilo.item.seedSugarcane = 509;
ExNihilo.item.seedPotato = 510;
ExNihilo.item.seedCarrot = 511;
ExNihilo.item.seedOak = 512;
ExNihilo.item.seedBirch = 513;
ExNihilo.item.seedSpruce = 514;
ExNihilo.item.seedJungle = 515;
ExNihilo.item.seedAcacia = 516;
ExNihilo.item.seedCactus = 517;
ExNihilo.item.seedSpores = 518;

/* Materials */
ExNihilo.item.ironBroken = 519;
ExNihilo.item.goldBroken = 520;
ExNihilo.item.ironBrokenEnd = 521;
ExNihilo.item.goldBrokenEnd = 522;
ExNihilo.item.ironBrokenNether = 523;
ExNihilo.item.goldBrokenNether = 524;
ExNihilo.item.ironCrushed = 525;
ExNihilo.item.goldCrushed = 526;
ExNihilo.item.ironPowdered = 527;
ExNihilo.item.goldPowdered = 528;

/* Misc */
ExNihilo.item.silkMesh = 529;
ExNihilo.item.witchWaterBucket = 530;
ExNihilo.item.porcelainBall = 531;
ExNihilo.item.barrelOak = 532;
ExNihilo.item.barrelSpruce = 533;
ExNihilo.item.barrelBirch = 534;
ExNihilo.item.barrelJungle= 535;
ExNihilo.item.barrelAcacia = 536;
ExNihilo.item.barrelDarkOak = 537;
ExNihilo.item.barrelStone = 538;
ExNihilo.item.iceShard = 539;
ExNihilo.item.doll = 540;
ExNihilo.item.dollBlaze = 541;
ExNihilo.item.dollEnder = 542;
ExNihilo.item.silkworm = 543;
ExNihilo.item.cookedSilkworm = 544;
ExNihilo.item.unfiredCrucible = 545;
ExNihilo.item.firedCrucible = 546;
ExNihilo.item.sieveOak = 547;

//blocks that have events, doors, crafting tables, beds...
ExNihilo.interactiveBlocks = [26, 54, 58, 61, 62, 64, 69, 77, 92, 93, 94, 96, 107, 116, 117, 143, 145, 183, 184, 185, 186, 187, ExNihilo.tile.barrel, ExNihilo.tile.barrelContents, ExNihilo.tile.crucible, ExNihilo.tile.sieve, ExNihilo.tile.sieveContents, ExNihilo.tile.crucibleContents, ExNihilo.tile.stoneBarrel];

/* ExNihilo Hooks */

/* attackHook */
ExNihilo.attackHook = function(attacker, victim){
	//do crook here, set the vel of a hostile away from player (based on yaw)
	//pull animal towards player, very simple...
};

/* chatHook - probably wont need this */
ExNihilo.chatHook = function(str){};

/* procCmd - probably wont need this */
ExNihilo.procCmd = function(cmd){};

/* destroyBlock */
ExNihilo.destroyBlock = function(x, y, z, side){
	//destroy the barrel
	if( Level.getTile(x, y, z) == ExNihilo.tile.barrel){
		if( ExNihilo.getBarrelType(x, y, z) == "water" ) Level.setTile(x, y, z, 8, 0);
		if( ExNihilo.getBarrelType(x, y, z) == "lava" ) Level.setTile(x, y, z, 10, 0);
		ExNihilo.emptyBarrel(x, y, z);
		ExNihilo.removeBarrel(x, y, z);
	}
};

/* eatHook - probably wont need this */
ExNihilo.eatHook = function(hearts, saturationRatio){};

/* entityAddedHook - probably wont need this */
ExNihilo.entityAddedHook = function(entity){};

/* entityRemovedHook - probably wont need this */
ExNihilo.entityRemovedHook = function(entity){};

/* explodeHook - probably wont need this */
ExNihilo.explodeHook = function(entity, x, y, z, power, onFire){};

/* serverMessageReceiveHook - probably wont need this */
ExNihilo.serverMessageReceiveHook = function(str){};

/*chatReceiveHook - probably wont need this */
ExNihilo.chatReceiveHook = function(str, sender){};

/* leaveGame */
ExNihilo.leaveGame = function(){
	//save the barrels
	ExNihilo.saveBarrels();
};

/* deathHook - probably wont need this */
ExNihilo.deathHook = function(attacker, victim){};

/* selectLevelHook - probably wont need this */
ExNihilo.selectLevelHook = function(){};

/* newLevel */
ExNihilo.newLevel = function(){
	//load barrels
	ExNihilo.loadBarrels();
	//creative items
	Player.addItemCreativeInv(ExNihilo.item.barrelOak, 5, 0);
	Player.addItemCreativeInv(ExNihilo.item.barrelBirch, 5, 0);
	Player.addItemCreativeInv(ExNihilo.item.barrelSpruce, 5, 0);
	Player.addItemCreativeInv(ExNihilo.item.barrelJungle, 5, 0);
	Player.addItemCreativeInv(ExNihilo.item.barrelAcacia, 5, 0);
	Player.addItemCreativeInv(ExNihilo.item.barrelDarkOak, 5, 0);
	Player.addItemCreativeInv(ExNihilo.item.barrelStone, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.dust, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.netherGravel, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.enderGravel, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.goldDust, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.ironDust, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.goldGravel, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.ironGravel, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.goldSand, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.ironSand, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.sieve, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.beeTrap, 5, 0);
	Player.addItemCreativeInv(ExNihilo.tile.beeTrap, 5, 1);
};

/* startDestroyBlock - probably wont need this */
ExNihilo.startDestroyBlock = function(x, y, z, side){};

/* modTick */
ExNihilo.modTick = function(){
	//make barrels drip
	if(Math.round(Math.random()*1) == 1 && ExNihilo.barrels.length > 0 ) {
		ExNihilo.dripFromBarrel();
	}
	//make barrels burn
	if(Math.round(Math.random()*64) == 32 && ExNihilo.barrels.length > 0 ) {
		ExNihilo.burnBarrel();
	}
	//make compost turn to dirt
	if(Math.round(Math.random()*64) == 32 && ExNihilo.barrels.length > 0 ) {
		ExNihilo.turnCompostToDirt();
	}
	//fill barrels with water if it is raining
	//requires beta and doesn't work...
	if(Math.round(Math.random()*64) == 32 && ExNihilo.barrels.length > 0 && Level.getRainLevel() > 0.0) {
		ExNihilo.fillEmptyBarrelWithRain();
	}
};

/* useItem */
ExNihilo.useItem = function(x, y, z, itemId, blockId, side, itemDamage, blockDamage){
	//barrel event
	if( blockId == ExNihilo.tile.barrel || blockId == ExNihilo.tile.stoneBarrel ) {
		if(!Player.isSneaking()) {
			preventDefault();
			ExNihilo.barrelEvent(x, y, z, itemId, itemDamage);
		}
	}
	//barrel event
	if( blockId == ExNihilo.tile.barrelContents ) {
		if(!Player.isSneaking()) {
			preventDefault();
			ExNihilo.barrelEvent(x, y - 1, z, itemId, itemDamage);
		}
	}
	//placing barrels
	if(itemId == ExNihilo.item.barrelStone){
		if( ExNihilo.interactiveBlocks.indexOf(blockId)==-1 || ExNihilo.interactiveBlocks.indexOf(blockId)>=0 && Player.isSneaking()){ //if the player can place the block
			if(ExNihilo.placeBarrel(ExNihilo.tile.stoneBarrel, 0, x, y, z, side)){
				if(Level.getGameMode() == 0){
					Player.removeFromCarriedItem(1);
				}
			}
		}
	}
	if(itemId == ExNihilo.item.barrelOak || itemId == ExNihilo.item.barrelSpruce || itemId == ExNihilo.item.barrelBirch || itemId == ExNihilo.item.barrelJungle || itemId == ExNihilo.item.barrelAcacia || itemId == ExNihilo.item.barrelDarkOak ){ //if the player is holding a barrel item
		if( ExNihilo.interactiveBlocks.indexOf(blockId)==-1 || ExNihilo.interactiveBlocks.indexOf(blockId)>=0 && Player.isSneaking()){ //if the player can place the block
			var dataToSet;
			switch(itemId){
				case ExNihilo.item.barrelOak: dataToSet = 0; break;
				case ExNihilo.item.barrelSpruce: dataToSet = 1; break;
				case ExNihilo.item.barrelBirch: dataToSet = 2; break;
				case ExNihilo.item.barrelJungle: dataToSet = 3; break;
				case ExNihilo.item.barrelAcacia: dataToSet = 4; break;
				case ExNihilo.item.barrelDarkOak: dataToSet = 5; break;
			}
			if(ExNihilo.placeBarrel(ExNihilo.tile.barrel, dataToSet, x, y, z, side)){
				if(Level.getGameMode() == 0){
					Player.removeFromCarriedItem(1);
				}
			}
		}
	}
	//placing blocks
	if( itemId == ExNihilo.tile.dust || itemId == ExNihilo.tile.ironDust || itemId == ExNihilo.tile.ironGravel || itemId == ExNihilo.tile.ironSand || itemId == ExNihilo.tile.goldDust || itemId == ExNihilo.tile.goldGravel || itemId == ExNihilo.tile.goldSand || itemId == ExNihilo.tile.netherGravel || itemId == ExNihilo.tile.enderGravel || itemId == ExNihilo.tile.beeTrap ){
		if( ExNihilo.interactiveBlocks.indexOf(blockId)==-1 || ExNihilo.interactiveBlocks.indexOf(blockId)>=0 && Player.isSneaking()) ExNihilo.placeBlock(itemId, itemDamage, x, y, z, side);
	}
};

/* ExNihilo barrel functions */

/* when a barrel is tapped by the player */
ExNihilo.barrelEvent = function(x, y, z, itemId, itemData){
	if( itemId == 325 && itemData == 0) { //empty bucket
		if( ExNihilo.getBarrelType(x, y, z) == "water" ) { //take water out of barrel
			ExNihilo.emptyBarrel(x, y, z);
			Player.removeFromCarriedItem(1);
			Player.addItemInventory(325, 1, 8);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "lava" ) { //take lava out of barrel
			ExNihilo.emptyBarrel(x, y, z);
			Player.removeFromCarriedItem(1);
			Player.addItemInventory(325, 1, 10);
		}
	}
	else if( itemId == 325 && itemData == 1 ){ //milk bucket
		if( ExNihilo.getBarrelType(x, y, z) == "water" ) {
			ExNihilo.setBarrelType(x, y, z, "slime");
			Player.removeFromCarriedItem(1);
			Player.addItemInventory(325, 1, 0);
		}
	}
	else if( itemId == 325 && itemData == 8 ) { //water bucket
		if( ExNihilo.isBarrelEmpty(x, y, z) ) { //put water in barrel
			ExNihilo.setBarrelType(x, y, z, "water");
			Player.removeFromCarriedItem(1);
			Player.addItemInventory(325, 1, 0);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "lava" ) { //turn lava to obsidian
			ExNihilo.setBarrelType(x, y, z, "obsidian");
			Player.removeFromCarriedItem(1);
			Player.addItemInventory(325, 1, 0);
		}
	}
	else if( itemId == 325 && itemData == 10 ) { //lava bucket
		if( ExNihilo.isBarrelEmpty(x, y, z) ) { //put lava in barrel
			ExNihilo.setBarrelType(x, y, z, "lava");
			Player.removeFromCarriedItem(1);
			Player.addItemInventory(325, 1, 0);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "water" ) { //turn water to stone
			ExNihilo.setBarrelType(x, y, z, "stone");
			Player.removeFromCarriedItem(1);
			Player.addItemInventory(325, 1, 0);
		}
	}
	else if( itemId == ExNihilo.tile.dust && ExNihilo.getBarrelType(x, y, z) == "water" ) { //dust
		ExNihilo.setBarrelType(x, y, z, "clay");
		Player.removeFromCarriedItem(1);
	}
	else if( itemId == 282 && ExNihilo.getBarrelType(x, y, z) == "water" ) { //mushroom stew
		ExNihilo.setBarrelType(x, y, z, "witchwater");
		Player.removeFromCarriedItem(1);
		Player.addItemInventory( 281, 1, 0);
	}
	else if( itemId == 12 && ExNihilo.getBarrelType(x, y, z) == "water" ) { //sand
		ExNihilo.setBarrelType(x, y, z, "clay");
		Player.removeFromCarriedItem(1);
	}
	else if( itemId == 331 && ExNihilo.getBarrelType(x, y, z) == "lava") { //redstone dust
		ExNihilo.setBarrelType(x, y, z, "netherrack");
		Player.removeFromCarriedItem(1);
	}
	else if( itemId == 348 && ExNihilo.getBarrelType(x, y, z) == "lava") { //glowstone dust
		ExNihilo.setBarrelType(x, y, z, "endstone");
		Player.removeFromCarriedItem(1);
	}
	else if( itemId == ExNihilo.item.dollBlaze && ExNihilo.getBarrelType(x, y, z) == "lava" ) {
		Player.removeFromCarriedItem(1);
		ExNihilo.emptyBarrel(x, y, z);
		Level.spawnMob(x, y, z, EntityType.BLAZE);
	}
	else {
		if( ExNihilo.getBarrelType(x, y, z) == "clay" ){
			ExNihilo.emptyBarrel(x, y, z);
			Level.dropItem(x + 0.5, y + 1.0, z + 0.5, 0.0, 82, 1, 0);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "obsidian" ){
			ExNihilo.emptyBarrel(x, y, z);
			Level.dropItem(x + 0.5, y + 1.0, z + 0.5, 0.0, 49, 1, 0);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "stone" ){
			ExNihilo.emptyBarrel(x, y, z);
			Level.dropItem(x + 0.5, y + 1.0, z + 0.5, 0.0, 1, 1, 0);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "dirt" ){
			ExNihilo.emptyBarrel(x, y, z);
			Level.dropItem(x + 0.5, y + 1.0, z + 0.5, 0.0, 3, 1, 0);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "soulsand" ){
			ExNihilo.emptyBarrel(x, y, z);
			Level.dropItem(x + 0.5, y + 1.0, z + 0.5, 0.0, 88, 1, 0);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "netherrack" ){
			ExNihilo.emptyBarrel(x, y, z);
			Level.dropItem(x + 0.5, y + 1.0, z + 0.5, 0.0, 87, 1, 0);
		}
		else if( ExNihilo.getBarrelType(x, y, z) == "endstone" ){
			ExNihilo.emptyBarrel(x, y, z);
			Level.dropItem(x + 0.5, y + 1.0, z + 0.5, 0.0, 121, 1, 0);
		}
	}
};

/* fill an empty barrel if its raining - doesn't work :( */
ExNihilo.fillEmptyBarrelWithRain = function(){
	//picks a random barrel - trying to mimic Tile::tick with randomness
	var i = Math.round( Math.random() * (ExNihilo.barrels.length - 1) );
	var b = ExNihilo.barrels[i];
	if( ExNihilo.isBarrelEmpty(b.x, b.y, b.z) ){ //if it is empty
		//set it to water
		ExNihilo.setBarrelType(b.x, b.y, b.z, "water");
	}
};

/* places a barrel, returns true if it has and pushes the coords to an array */
ExNihilo.placeBarrel = function(id, data, x, y, z, side){
	switch(side){
		case 0: {
			if(Level.getTile(x, y - 1, z) == 0){
				Level.setTile(x, y - 1, z, id, data);
				ExNihilo.barrels.push({x:x, y:y - 1, z:z, compostAmount:0.00});
				clientMessage(x + ", " + y-1 + ", " + z );
				return true;
			}} break;
		case 1: { 
			if(Level.getTile(x, y + 1, z) == 0){
				Level.setTile(x, y + 1, z, id, data);
				ExNihilo.barrels.push({x:x, y:y + 1, z:z, compostAmount:0.00});
				return true;
			}} break;
		case 2: {
			if(Level.getTile(x, y, z - 1) == 0){
				Level.setTile(x, y, z - 1, id, data);
				ExNihilo.barrels.push({x:x, y:y, z:z - 1, compostAmount:0.00});
				return true;
			}} break;
		case 3: {
			if(Level.getTile(x, y, z + 1) == 0){
				Level.setTile(x, y, z + 1, id, data);
				ExNihilo.barrels.push({x:x, y:y, z:z + 1, compostAmount:0.00});
				return true;
			}} break;
		case 4: {
			if(Level.getTile(x - 1, y, z) == 0){
				Level.setTile(x - 1, y, z, id, data);
				ExNihilo.barrels.push({x:x - 1, y:y, z:z, compostAmount:0.00});
				return true;
			}} break;
		case 5: {
			if(Level.getTile(x + 1, y, z) == 0){
				Level.setTile(x + 1, y, z, id, data);
				ExNihilo.barrels.push({x:x + 1, y:y, z:z, compostAmount:0.00});
				return true;
			}} break;
	}
};

/* save barrels - getting weird NaN bug ? */
ExNihilo.saveBarrels = function(){
	var saveStr = "";
	for(var i=0;i<ExNihilo.barrels.length;i++){
		var b = ExNihilo.barrels[i];
		var barr = [b.x, b.y, b.z, b.compostAmount];
		if(b.x !== "NaN") saveStr += barr.join(",") + "\n";
	}
	ModPE.saveFile("barrels.dat", saveStr);
};

/* load barrels - getting weird NaN bug ? */
ExNihilo.loadBarrels = function(){
	var content = ModPE.loadFile("barrels.dat");
	var lines = content.split("\n");
	for(var i=0;i<lines.length;i++){
		var par = lines[i].split(",");
		var x = parseInt(par[0]);
		var y = parseInt(par[1]);
		var z = parseInt(par[2]);
		var cA = parseFloat(par[3]);
		if(par[0] !== "NaN") ExNihilo.barrels.push({x:x, y:y, z:z, compostAmount:cA});
	}
};

/* remove barrels from barrel array */
ExNihilo.removeBarrel = function(x, y, z){
	for(var i in ExNihilo.barrels){
		var b = ExNihilo.barrels[i];
		if(b.x == x && b.y == y && b.z == z){
			ExNihilo.barrels.splice(i, 1);
		}
	}
};

/* returns a string based on barrelContents data */
ExNihilo.getBarrelType = function(x, y, z){
	var tile = Level.getTile(x, y + 1, z);
	var data = Level.getData(x, y + 1, z);
	if(tile == ExNihilo.tile.barrelContents){
		switch(data){
			case 0:
				return "water";
				break;
			case 1:
				return "lava";
				break;
			case 2:
				return "compost";
				break;
			case 3:
				return "dirt";
				break;
			case 4:
				return "obsidian";
				break;
			case 5:
				return "clay";
				break;
			case 6:
				return "endstone";
				break;
			case 7:
				return "stone";
				break;
			case 8:
				return "netherrack";
				break;
			case 9:
				return "soulsand";
				break;
			case 10:
				return "slime";
				break;
			case 11:
				return "witchWater";
				break;
		}
	}
};

/* gets the compost amount of a barrel */
ExNihilo.getBarrelCompostAmount = function(x, y, z){
	for(var i in ExNihilo.barrels){
		var b = ExNihilo.barrels[i];
		if(b.x == x && b.y == y && b.z == z){
			return b.compostAmount;
		}
	}
};

/* sets the barrelContents type of a barrel */
ExNihilo.setBarrelType = function(x, y, z, type){
	var tile = Level.getTile(x, y + 1, z);
	var data = Level.getData(x, y + 1, z);
	switch(type){
		case "water":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 0);
			break;
		case "lava":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 1);
			break;
		case "compost":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 2);
			break;
		case "dirt":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 3);
			break;
		case "obsidian":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 4);
			break;
		case "clay":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 5);
			break;
		case "endstone":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 6);
			break;
		case "stone":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 7);
			break;
		case "netherrack":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 8);
			break;
		case "soulsand":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 9);
			break;
		case "slime":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 10);
			break;
		case "witchWater":
			Level.setTile(x, y + 1, z, ExNihilo.tile.barrelContents, 11);
			break;
	}
};

/* set a barrels compost amount - !!! has to be a compost barrel !!! */
ExNihilo.setBarrelCompostAmount = function(x, y, z, amount) {
	for(var i in ExNihilo.barrels) {
		var b = ExNihilo.barrels[i];
		if( b.x == x && b.y == y && b.z == z) {
			b.compostAmount = amount;
		}
	}
};

/* add compost */
ExNihilo.addBarrelCompostAmount = function(x, y, z, amount) {
	for(var i in ExNihilo.barrels) {
		var b = ExNihilo.barrels[i];
		if( b.x == x && b.y == y && b.z == z) {
			b.compostAmount += amount;
		}
	}
};

/* removes compost */
ExNihilo.removeBarrelCompostAmount = function(x, y, z, amount) {
	for(var i in ExNihilo.barrels) {
		var b = ExNihilo.barrels[i];
		if( b.x == x && b.y == y && b.z == z) {
			b.compostAmount -= amount;
		}
	}
};

/* turn the compost to dirt */
ExNihilo.turnCompostToDirt = function(){
	var i = Math.round( Math.random() * (ExNihilo.barrels.length - 1) );
	var b = ExNihilo.barrels[i];
	if( ExNihilo.getBarrelType( b.x, b.y, b.z ) == "compost" ) {
		if( ExNihilo.getBarrelCompostAmount( b.x, b.y, b.z ) >= 1 ) {
			//set it to 0 ~ yes it may be more than 1 but it would cause problems
			ExNihilo.setBarrelCompostAmount( b.x, b.y, b.z, 0.00 );
			//set it to dirt
			ExNihilo.setBarrelType( b.x, b.y, b.z, "dirt" );
		}
	}
};

/* returns true if the barrel is empty */
ExNihilo.isBarrelEmpty = function(x, y, z){
	tile = Level.getTile(x, y + 1, z);
	if(tile == 0){
		return true;
	} else {
		return false;
	}
};

/* make water | lava | slime barrels drip */
ExNihilo.dripFromBarrel = function(){
	var i = Math.round( Math.random() * (ExNihilo.barrels.length - 1) );
	var b = ExNihilo.barrels[i];
	if( ExNihilo.getBarrelType(b.x, b.y, b.z) == "water" && ExNihilo.isWoodBarrel(b.x, b.y, b.z) ){
		Level.addParticle( ParticleType.dripWater, (Math.random()*1) + b.x, b.y, (Math.random()*1) + b.z, 0.0, ModPE.calcVelY(b.y - 0.2, b.y - 1, 20), 0.0, 1);
	}
	if( ExNihilo.getBarrelType(b.x, b.y, b.z) == "lava" && ExNihilo.isWoodBarrel(b.x, b.y, b.z) ){
		Level.addParticle( ParticleType.dripLava, (Math.random()*1) + b.x, b.y, (Math.random()*1) + b.z, 0.0, ModPE.calcVelY(b.y, b.y - 1, 20), 0.0, 1);
	}
	if( ExNihilo.getBarrelType(b.x, b.y, b.z) == "slime" && ExNihilo.isWoodBarrel(b.x, b.y, b.z) ){
		Level.addParticle( ParticleType.slime, (Math.random()*1) + b.x, b.y, (Math.random()*1) + b.z, 0.0, ModPE.calcVelY(b.y, b.y - 1, 20), 0.0, 1);
	}
};

/* make wooden barrels with lava burn, I need to tweak smokes vel */
ExNihilo.burnBarrel = function(){
	var i = Math.round( Math.random() * (ExNihilo.barrels.length - 1) );
	var b = ExNihilo.barrels[i];
	if( ExNihilo.getBarrelType(b.x, b.y, b.z) == "lava" && ExNihilo.isWoodBarrel(b.x, b.y, b.z) ){
		//empty it first
		ExNihilo.emptyBarrel(b.x, b.y, b.z);
		//remove it
		ExNihilo.removeBarrel(b.x, b.y, b.z);
		//set the tile to air
		Level.setTile(b.x, b.y, b.z, 0);
		//play a fizz sound
		Level.playSound(b.x, b.y, b.z, "random.fizz", 1.0, Math.random());
		//add smoke
		for(var i=0;i<Math.round(Math.random()*20);i++){
			Level.addParticle( ParticleType.smoke, (Math.random()*1) + b.x, (Math.random()*1) + b.y, (Math.random()*1) + b.z, Math.random(), Math.random(), Math.random(), 100);
		}
		//randomly set a fire?
		if( Math.round(Math.random()*4) == 3 ){
			Level.setTile(b.x, b.y, b.z, 51, 0);
		}
	}
};

/* returns true if its a wooded barrel, else false (stone barrel) */
ExNihilo.isWoodBarrel = function(x, y, z){
	if( Level.getTile(x, y, z) == ExNihilo.tile.barrel ){
		return true;
	} else {
		return false;
	}
};

/* emptys a barrel, barrelContents and compostAmount */
ExNihilo.emptyBarrel = function(x, y, z){
	tile = Level.getTile(x, y + 1, z);
	if(tile == ExNihilo.tile.barrelContents){
		Level.setTile(x, y + 1, z, 0);
		for(var i in ExNihilo.barrels){
			var b = ExNihilo.barrels[i];
			if(b.x == x && b.y == y && b.z == z){
				b.compostAmount = 0.00;
			}
		}
	}
};

/* other funtions */
/* if the block at said coord is exposed to the sky */
//dont know if this works?
ExNihilo.isExposedToSky = function(x, y, z){
	for(var i=y;i<127;i++){
		if( Level.getTile(x, i, z) == 0 ){
			continue;
		} else {
			break;
		}
	}
	if(i>=127){
		return true;
	} else {
		return false;
	}
};

/* places a block, returns true if it has placed the block */
ExNihilo.placeBlock = function(id, data, x, y, z, side){
	switch(side){
		case 0:
			if(Level.getTile(x, y - 1, z) == 0){
				Level.setTile(x, y - 1, z, id, data);
				return true;
			} break;
		case 1: 
			if(Level.getTile(x, y + 1, z) == 0){
				Level.setTile(x, y + 1, z, id, data);
				return true;
			} break;
		case 2: 
			if(Level.getTile(x, y, z - 1) == 0){
				Level.setTile(x, y, z - 1, id, data);
				return true;
			} break;
		case 3: 
			if(Level.getTile(x, y, z + 1) == 0){
				Level.setTile(x, y, z + 1, id, data);
				return true;
			} break;
		case 4: 
			if(Level.getTile(x - 1, y, z) == 0){
				Level.setTile(x - 1, y, z, id, data);
				return true;
			} break;
		case 5: 
			if(Level.getTile(x + 1, y, z) == 0){
				Level.setTile(x + 1, y, z, id, data);
				return true;
			} break;
	}
};

/* Blocks */

/* Barrel */
Block.defineBlock(ExNihilo.tile.barrel, "barrel", [
["planks", 0],["barrel", 0],["planks", 0],["planks", 0],["planks", 0],["planks", 0],
["planks", 1],["barrel", 1],["planks", 1],["planks", 1],["planks", 1],["planks", 1],
["planks", 2],["barrel", 2],["planks", 2],["planks", 2],["planks", 2],["planks", 2],
["planks", 3],["barrel", 3],["planks", 3],["planks", 3],["planks", 3],["planks", 3],
["planks", 4],["barrel", 4],["planks", 4],["planks", 4],["planks", 4],["planks", 4],
["planks", 5],["barrel", 5],["planks", 5],["planks", 5],["planks", 5],["planks", 5]], 5, false, 0);
Block.setDestroyTime(ExNihilo.tile.barrel, 2.0);
//Block.setExplosionResistance(ExNihilo.tile.barrel, 0.0);
Block.setLightOpacity(ExNihilo.tile.barrel, 0);
Block.setRenderLayer(ExNihilo.tile.barrel, 4);
Block.setShape(ExNihilo.tile.barrel, 1/16, 0.5/16, 1/16, 15/16, 16/16, 15/16);
Item.setCategory(ExNihilo.tile.barrel, ItemCategory.DECORATION, 0);

/* Stone Barrel */
Block.defineBlock(ExNihilo.tile.stoneBarrel, "barrel", [["stone_slab", 0],["barrel", 6],["stone_slab", 0],["stone_slab", 0],["stone_slab", 0],["stone_slab", 0]], 1, false, 0);
Block.setDestroyTime(ExNihilo.tile.stoneBarrel, 4.0);
//Block.setExplosionResistance(ExNihilo.tile.stoneBarrel, 0.0);
Block.setLightOpacity(ExNihilo.tile.stoneBarrel, 0);
Block.setRenderLayer(ExNihilo.tile.stoneBarrel, 4);
Block.setShape(ExNihilo.tile.stoneBarrel, 1/16, 0.5/16, 1/16, 15/16, 16/16, 15/16);
Item.setCategory(ExNihilo.tile.stoneBarrel, ItemCategory.DECORATION, 0);

/* Bee trap */
Block.defineBlock(ExNihilo.tile.beeTrap, "beetrap", [
["beeTrapTop", 0],["beeTrapTop",0],["beeTrapSide",0],["beeTrapSide",0],["beeTrapSide",0],["beeTrapSide",0],
["beeTrapTop", 1],["beeTrapTop",1],["beeTrapSide",1],["beeTrapSide",1],["beeTrapSide",1],["beeTrapSide",1]
], 2, true, 0);
Block.setDestroyTime(ExNihilo.tile.beeTrap, 0.8);
//Block.setExplosionResistance(ExNihilo.tile.beeTrap, 0.0);
Block.setLightOpacity(ExNihilo.tile.beeTrap, 10);
Item.setCategory(ExNihilo.tile.beeTrap, ItemCategory.MATERIAL, 0);

/* dust */
Block.defineBlock(ExNihilo.tile.dust, "dust", ["dust", 0], 12, true, 0);
Block.setDestroyTime(ExNihilo.tile.dust, 0.4);
//Block.setExplosionResistance(ExNihilo.tile.dust, 0.0);
Block.setLightOpacity(ExNihilo.tile.dust, 10);
Item.setCategory(ExNihilo.tile.dust, ItemCategory.MATERIAL, 0);

/* endgravel */
Block.defineBlock(ExNihilo.tile.enderGravel, "endGravel", ["endGravel", 0], 13, true, 0);
Block.setDestroyTime(ExNihilo.tile.enderGravel, 0.6);
Block.setLightOpacity(ExNihilo.tile.enderGravel, 10);
Item.setCategory(ExNihilo.tile.enderGravel, ItemCategory.MATERIAL, 0);

/* nethergravel */
Block.defineBlock(ExNihilo.tile.netherGravel, "netherGravel", ["netherGravel", 0], 13, true, 0);
Block.setDestroyTime(ExNihilo.tile.netherGravel, 0.6);
Block.setLightOpacity(ExNihilo.tile.netherGravel, 10);
Item.setCategory(ExNihilo.tile.netherGravel, ItemCategory.MATERIAL, 0);

/* iron dust */
Block.defineBlock(ExNihilo.tile.ironDust, "ironDust", ["ironDust", 0], 12, true, 0);
Block.setDestroyTime(ExNihilo.tile.ironDust, 0.4);
//Block.setExplosionResistance(ExNihilo.tile.ironDust, 0.0);
Block.setLightOpacity(ExNihilo.tile.ironDust, 10);
Item.setCategory(ExNihilo.tile.dust, ItemCategory.MATERIAL, 0);

/* gold dust */
Block.defineBlock(ExNihilo.tile.goldDust, "goldDust", ["goldDust", 0], 12, true, 0);
Block.setDestroyTime(ExNihilo.tile.goldDust, 0.4);
//Block.setExplosionResistance(ExNihilo.tile.goldDust, 0.0);
Block.setLightOpacity(ExNihilo.tile.goldDust, 10);

/* iron gravel */
Block.defineBlock(ExNihilo.tile.ironGravel, "ironGravel", ["ironGravel", 0], 12, true, 0);
Block.setDestroyTime(ExNihilo.tile.ironGravel, 0.4);
//Block.setExplosionResistance(ExNihilo.tile.ironGravel, 0.0);
Block.setLightOpacity(ExNihilo.tile.ironGravel, 10);

/* gold gravel */
Block.defineBlock(ExNihilo.tile.goldGravel, "goldGravel", ["goldGravel", 0], 12, true, 0);
Block.setDestroyTime(ExNihilo.tile.goldGravel, 0.4);
//Block.setExplosionResistance(ExNihilo.tile.goldGravel, 0.0);
Block.setLightOpacity(ExNihilo.tile.goldGravel, 10);

/* iron sand */
Block.defineBlock(ExNihilo.tile.ironSand, "ironSand", ["ironSand", 0], 12, true, 0);
Block.setDestroyTime(ExNihilo.tile.ironSand, 0.4);
//Block.setExplosionResistance(ExNihilo.tile.ironSand, 0.0);
Block.setLightOpacity(ExNihilo.tile.ironSand, 10);

/* gold sand */
Block.defineBlock(ExNihilo.tile.goldSand, "goldSand", ["goldSand", 0], 12, true, 0);
Block.setDestroyTime(ExNihilo.tile.goldSand, 0.4);
//Block.setExplosionResistance(ExNihilo.tile.goldSand, 0.0);
Block.setLightOpacity(ExNihilo.tile.goldSand, 10);

/* infested leaves */
Block.defineBlock(ExNihilo.tile.infestedLeaves, "infestedLeaves", ["leaves",0], 18, false, 0);
Block.setDestroyTime(ExNihilo.tile.infestedLeaves, 0.4);
Block.setRenderLayer(ExNihilo.tile.infestedLeaves, 4);
Block.setLightOpacity(ExNihilo.tile.infestedLeaves, 1);
//colors are from data 0 - 7
//only data 7 should drop silk
//we can animaye the color changes like I did the barrel dripping
Block.setColor(ExNihilo.tile.infestedLeaves, [0x7ac347, 0x8fd45f, 0xa0db75, 0xbbeb98, 0xd1f0ba, 0xeafcdc, 0xf6ffef, 0xffffff]);

/* sieve */
/* No fancy saving here, I made another block for the dust and such
all we need to do is a few setTiles, getTiles, and dropItems.
Try to match the raritys from PC
*/
Block.defineBlock(ExNihilo.tile.sieve, "sieve", [
["test", 0],["sieveTop", 0],["sieveSide", 0],["sieveSide", 0],["sieveSide", 0],["sieveSide", 0],
], 5, false, 0);
Block.setDestroyTime(ExNihilo.tile.sieve, 2.0);
//Block.setExplosionResistance(ExNihilo.tile.sieve, 0.0);
Block.setRenderLayer(ExNihilo.tile.sieve, 4);
Block.setLightOpacity(ExNihilo.tile.sieve, 0);

/* crucible */
//same thing here as infectedLeaves. We will save the position
//get if there is a torch below it, get if the crucible content is cobble, 
//then set it to lava
Block.defineBlock(ExNihilo.tile.crucible, "crucible", [
["cauldron_inner", 0],["cauldron_top", 0],["cauldron_side", 0],["cauldron_side", 0],["cauldron_side", 0],["cauldron_side", 0]
], 1, false, 0);
Block.setDestroyTime(ExNihilo.tile.crucible, 2.0);
Block.setExplosionResistance(ExNihilo.tile.crucible, 0.0);
Block.setRenderLayer(ExNihilo.tile.crucible, 4);
Block.setLightOpacity(ExNihilo.tile.crucible, 0);
Block.setShape(ExNihilo.tile.crucible, 1/16, 3/16, 1/16, 15/16, 16/16, 15/16);
Item.setCategory(ExNihilo.tile.crucible, ItemCategory.DECORATION, 0);

/* barrel contents */
Block.defineBlock(ExNihilo.tile.barrelContents, "barrelContents", [
["flowing_water",0],["flowing_water",0],["flowing_water",0],["flowing_water",0],["flowing_water",0],["flowing_water",0],
["flowing_lava",0],["flowing_lava",0],["flowing_lava",0],["flowing_lava",0],["flowing_lava",0],["flowing_lava",0],
["compost", 0],["compost", 0],["compost", 0],["compost", 0],["compost", 0],["compost", 0],
["dirt", 0],["dirt", 0],["dirt", 0],["dirt", 0],["dirt", 0],["dirt", 0],
["obsidian",0],["obsidian",0],["obsidian",0],["obsidian",0],["obsidian",0],["obsidian",0],
["clay",0],["clay",0],["clay",0],["clay",0],["clay",0],["clay",0],
["end_stone",0],["end_stone",0],["end_stone",0],["end_stone",0],["end_stone",0],["end_stone",0],
["stone",0],["stone",0],["stone",0],["stone",0],["stone",0],["stone",0],
["netherrack",0],["netherrack",0],["netherrack",0],["netherrack",0],["netherrack",0],["netherrack",0],
["soul_sand",0],["soul_sand",0],["soul_sand",0],["soul_sand",0],["soul_sand",0],["soul_sand",0]
["wool",5],["wool",5],["wool",5],["wool",5],["wool",5],["wool",5],
["witchWater",0],["witchWater",0],["witchWater",0],["witchWater",0],["witchWater",0],["witchWater",0],
], 0, false, 0);
Block.setDestroyTime(ExNihilo.tile.barrelContents, -1);
Block.setExplosionResistance(ExNihilo.tile.barrelContents, 48000);
Block.setLightOpacity(ExNihilo.tile.barrelContents, 0);
Block.setShape(ExNihilo.tile.barrelContents, 2/16, -15/16, 2/16, 14/16, -3/16, 14/16);
var colors = [0xffffff, 0xffffff, 0x008700, 0xffffff];
Block.setColor(ExNihilo.tile.barrelContents, colors);

/* Items */
ModPE.setItem(ExNihilo.item.stone, "stone",0,"stone",16);
ModPE.setItem(ExNihilo.item.seedGrass, "grassSeed",0,"seed_grass",64);
ModPE.setItem(ExNihilo.item.seedSugarcane, "seedSugarcane",0,"seed_sugarcane",64);
ModPE.setItem(ExNihilo.item.seedPotato, "seedPotato",0,"seed_potato",64);
ModPE.setItem(ExNihilo.item.seedCarrot, "seedCarrot",0,"seed_carrot",64);
ModPE.setItem(ExNihilo.item.seedOak, "seedOak",0,"seed_oak",64);
ModPE.setItem(ExNihilo.item.seedBirch, "seedBirch",0,"seed_birch",64);
ModPE.setItem(ExNihilo.item.seedSpruce, "seedSpruce",0,"seed_spruce",64);
ModPE.setItem(ExNihilo.item.ironBroken, "ironGravel",0,"gravel_iron",16);
ModPE.setItem(ExNihilo.item.goldBroken, "goldGravel",0,"gravel_gold",16);
ModPE.setItem(ExNihilo.item.ironCrushed, "ironSand",0,"sand_iron",16);
ModPE.setItem(ExNihilo.item.goldCrushed, "goldSand",0,"sand_gold",16);
ModPE.setItem(ExNihilo.item.seedCactus, "seedCactus",0,"seed_cactus",64);
ModPE.setItem(ExNihilo.item.seedJungle, "seedJungle",0,"seed_jungle",64);
ModPE.setItem(ExNihilo.item.seedSpores, "spores",0,"spores",64);
ModPE.setItem(ExNihilo.item.ironPowdered, "ironDust",0,"dust_iron",16);
ModPE.setItem(ExNihilo.item.goldPowdered, "goldDust",0,"dust_gold",16);
ModPE.setItem(ExNihilo.item.hammerWood, "hammer",0,"woodhammer",1);
ModPE.setItem(ExNihilo.item.hammerStone, "hammer",1,"stonehammer",1);
ModPE.setItem(ExNihilo.item.hammerIron, "hammer",2,"ironhammer",1);
ModPE.setItem(ExNihilo.item.hammerGold, "hammer",3,"goldhammer",1);
ModPE.setItem(ExNihilo.item.hammerDiamond, "hammer",4,"diamondhammer",1);
ModPE.setItem(ExNihilo.item.crook, "crook",0,"crook",1);
ModPE.setItem(ExNihilo.item.crookBone, "crook",1,"crook_bone",1);
ModPE.setItem(ExNihilo.item.silkMesh, "mesh",0,"silk_mesh",16);
ModPE.setItem(ExNihilo.item.witchWaterBucket, "witchWater",0,"witch_water",1);
ModPE.setItem(ExNihilo.item.seedAcacia, "seedAcacia",0,"seed_acacia",64);
ModPE.setItem(ExNihilo.item.porcelainBall, "porcelainBall",0,"porcelain",64);
ModPE.setItem(ExNihilo.item.barrelOak,"oakBarrel",0,"oakBarrel",64);
ModPE.setItem(ExNihilo.item.barrelSpruce,"spruceBarrel",0,"spruceBarrel",64);
ModPE.setItem(ExNihilo.item.barrelBirch,"birchBarrel",0,"birchBarrel",64);
ModPE.setItem(ExNihilo.item.barrelJungle,"jungleBarrel",0,"jungleBarrel",64);
ModPE.setItem(ExNihilo.item.barrelAcacia,"acaciaBarrel",0,"acaciaBarrel",64);
ModPE.setItem(ExNihilo.item.barrelDarkOak,"darkOakBarrel",0,"darkOakBarrel",64);
ModPE.setItem(ExNihilo.item.barrelStone, "stoneBarrel", 0, "stoneBarrel", 64);

/* ModPE Hooks */
function attackHook(attacker, victim){ExNihilo.attackHook(attacker, victim);}
function chatHook(str){ExNihilo.chatHook(str);}
function destroyBlock(x, y, z, side){ExNihilo.destroyBlock(x, y, z, side);}
function eatHook(hearts, saturationRatio){ExNihilo.eatHook(hearts, saturationRatio);}
function entityAddedHook(entity){ExNihilo.entityAddedHook(entity);}
function entityRemovedHook(entity){ExNihilo.entityRemovedHook(entity);}
function explodeHook(entity, x, y, z, power, onFire){ExNihilo.explodeHook(entity, x, y, z, power, onFire);}
function serverMessageReceiveHook(str){ExNihilo.serverMessageReceiveHook(str);}
function chatReceiveHook(str, sender){ExNihilo.chatReceiveHook(str, sender);}
function leaveGame(){ExNihilo.leaveGame();}
function deathHook(attacker, victim){ExNihilo.deathHook(attacker, victim);}
function selectLevelHook(){ExNihilo.selectLevelHook();}
function newLevel(){ExNihilo.newLevel();}
function startDestroyBlock(x, y, z, side){ExNihilo.startDestroyBlock(x, y, z, side);}
function modTick(){ExNihilo.modTick();}
function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage){ExNihilo.useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage);}
function procCmd(cmd){ExNihilo.procCmd(cmd);}
