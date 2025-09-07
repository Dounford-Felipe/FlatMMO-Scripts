// ==UserScript==
// @name         FlatMMO+ Piggie
// @namespace    com.dounford.flatmmo.piggie
// @version      1.0.0
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
                    name: "FlatMMO+ Piggie",
                    version: "1.0.0",
                    author: "Dounford",
                    description: "A Buddy Pig"
                },
                config: [
                    {
						id: "showPet",
						label: "Show Pet",
						type: "boolean",
						default: true
					},
                    {
                        id: "pet",
                        label: "Pet",
                        type: "select",
                        options: [
                            {
                                value: "pig",
                                label: "Pig"
                            },
                            {
                                value: "beer",
                                label: "Beer"
                            },
                        ]
                    }
                ]
            });

            this.currentPet = "pig";
            this.currentAction = "stand";
            this.pets = {}
        }

        onConfigsChanged() {
            this.currentPet = this.config["pet"];
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
                class AnimationSheetPlus {
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
            window.AnimationSheetPlus = AnimationSheetPlus
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
            this.registerAnimation("pig","stand","2",50);
            this.registerAnimation("pig","walk","4",10);
            this.registerAnimation("pig","attack","2",20);
            this.registerAnimation("pig","fishing_net","2",25);
            this.registerAnimation("pig","fishing_rod","2",25);
            this.registerAnimation("pig","harpoon","2",25);
            this.registerAnimation("pig","mine_rock","2",15);
            this.registerAnimation("pig","chop_tree","2",20);
            
            this.pets.beer = {};
            this.registerAnimation("beer","stand","2",50);
        }

        registerAnimation(pet, animation, frames, speed) {
            const animations = [];
            for (let i = 0; i < frames; i++) {
                animations.push(`https://raw.githubusercontent.com/Dounford-Felipe/FlatMMO-Scripts/refs/heads/main/pets/images/${pet}/${animation}${i}.png`);
            }
            this.pets[pet][animation] = new AnimationSheetPlus(pet + animation, frames, "", speed, animations);
        }
    }
 
    const plugin = new piggieBuddy();
    FlatMMOPlus.registerPlugin(plugin);
 
})();