// ==UserScript==
// @name         FlatMMO+ Piggie
// @namespace    com.dounford.flatmmo.piggie
// @version      0.0.3
// @description  A Buddy Pig
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/547463/FlatMMO%2B%20Piggie.user.js
// @updateURL https://update.greasyfork.org/scripts/547463/FlatMMO%2B%20Piggie.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

 
    class piggieBuddy extends FlatMMOPlusPlugin {
        constructor() {
            super("piggieBuddy", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
						id: "showPet",
						label: "Show Pet",
						type: "boolean",
						default: true
					},
                ]
            });

            this.currentPet = "pig";
            this.currentAction = "stand";
            this.pets = {}
        }
        
        onPaint() {
            if(this.config["showPet"] === false) {return}
            //Draw pig
            if (players[Globals.local_username].face_left) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(this.pets[this.currentPet][this.currentAction].get_frame(), -(players[Globals.local_username].client_x + 160), players[Globals.local_username].client_y - 25, 96, 96);
                ctx.restore();
            } else {
                ctx.drawImage(this.pets[this.currentPet][this.currentAction].get_frame(), players[Globals.local_username].client_x - 96, players[Globals.local_username].client_y - 25, 96, 96);
            }
        }
 
        
        onLogin() {
            if(FlatMMOPlus.version <= "0.0.8") {
                //alert("This plugin requires FlatMMO+ 1.0.0 or later\nYour current version is " + FlatMMOPlus.version);
                //return;
                window.AnimationSheetPlus = class {
                constructor(filename, frames, path, speed, images) {
                    this.filename = filename;
                    this.running = false;
                    this.frame_at = 0;
                    this.FRAMES = frames;
                    this.SPEED = speed;
                    this.speed_at = 0;
                    this.animation_tick_at = animation_tick;
                    this.images = []
                    for(var i = 1; i <= this.FRAMES; i++) {
                        let image = new Image();
                        if(images) {
                            image.src = images[i - 1]
                        } else {
                            image.src =  path + filename + i + ".png";
                        }
                        this.images.push(image);
                    }
                }

                get_frame() {
                    if(this.FRAMES > 0) {
                        if(this.SPEED == this.speed_at) {
                            //swtich frames
                            if(this.animation_tick_at != animation_tick) {
                                this.frame_at++;
                                this.animation_tick_at = animation_tick;
                            }
                            
                            if(this.FRAMES == this.frame_at) {
                                this.frame_at = 0;
                            }
                            this.speed_at = 0;
                        } else {
                            this.speed_at++;
                        }
                        return this.images[this.frame_at];
                    } else {
                        return this.images[0];
                    } 
                }
            }
            }

            this.addPets()
        }

        onActionChanged() {
            if(this.pets[this.currentPet].hasOwnProperty(FlatMMOPlus.currentAction)) {
                this.currentAction = FlatMMOPlus.currentAction;
            }
        }
        
        changePet(pet) {
            this.currentPet = pet;
            if(!this.pets[this.currentPet].hasOwnProperty(this.currentAction)) {
                this.currentAction = "stand";
            }
        }

        addPets() {
            this.pets.pig = {};
            this.pets.pig.stand = new AnimationSheetPlus("piggieStand", 2, "", 15, [
                "https://i.imgur.com/e3QkOfX.png",
                "https://i.imgur.com/mvI9MhH.png"
            ]);
            this.pets.pig.walk = new AnimationSheetPlus("piggieWalk", 4, "", 15, [
                "https://i.imgur.com/iQuTPz0.png",
                "https://i.imgur.com/e3QkOfX.png",
                "https://i.imgur.com/fPcnDXk.png",
                "https://i.imgur.com/e3QkOfX.png",
            ]);
            this.pets.pig.attack = new AnimationSheetPlus("piggieAttack", 2, "", 15, [
                "https://i.imgur.com/KGOFnNa.png",
                "https://i.imgur.com/PRgOXok.png"
            ]);
            this.pets.pig.fishing_rod = new AnimationSheetPlus("piggieFishingRod", 2, "", 15, [
                "https://i.imgur.com/g1fPWpn.png",
                "https://i.imgur.com/7qoXigs.png"
            ]);
        }
    }
 
    const plugin = new piggieBuddy();
    FlatMMOPlus.registerPlugin(plugin);
 
})();