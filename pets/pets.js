// ==UserScript==
// @name         FlatMMO+ Pets
// @namespace    com.dounford.flatmmo.pets
// @version      1.1.2
// @description  Adds custom Pets to the game
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// ==/UserScript==
 
(function() {
    'use strict';

 
    class pets extends FlatMMOPlusPlugin {
        constructor() {
            super("petsBuddy", {
                about: {
                    name: "FlatMMO+ Pets",
                    version: "1.1.2",
                    author: "Dounford",
                    description: "Adds custom Pets to the game"
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
                            {
                                value: "capybara",
                                label: "Capybara"
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
            this.changePet(this.config["pet"]);
        }
        
        onPaint() {
            if(this.config["showPet"] === false) {return}
            if(FlatMMOPlus.loggedIn === false) {return}
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
            this.addPets()
        }

        onActionChanged() {
            if(this.pets[this.currentPet].hasOwnProperty(FlatMMOPlus.currentAction)) {
                this.currentAction = FlatMMOPlus.currentAction;
            }
        }
        
        changePet(pet) {
            this.currentPet = pet;
            this.currentAction = "stand";
            if(this.pets[this.currentPet]?.hasOwnProperty(FlatMMOPlus.currentAction)) {
                this.currentAction = FlatMMOPlus.currentAction;
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
            
            this.pets.capybara = {};
            this.registerAnimation("capybara","stand","2",50);
        }

        registerAnimation(pet, animation, frames, speed) {
            const animations = [];
            for (let i = 0; i < frames; i++) {
                animations.push(`https://raw.githubusercontent.com/Dounford-Felipe/FlatMMO-Scripts/refs/heads/main/pets/images/${pet}/${animation}${i}.png`);
            }
            this.pets[pet][animation] = new AnimationSheetPlus(pet + animation, frames, "", speed, animations);
        }
    }
 
    const plugin = new pets();
    FlatMMOPlus.registerPlugin(plugin);
 
})();