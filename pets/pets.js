// ==UserScript==
// @name         FlatMMO+ Pets
// @namespace    com.dounford.flatmmo.piggie
// @version      1.5.0.4
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
                    version: "1.5.0.4",
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
                                value: "blackSlimeCat",
                                label: "Black Slime Cat"
                            },
                            {
                                value: "calicoSlimeCat",
                                label: "Calico Slime Cat"
                            },
                            {
                                value: "whiteSlimeCat",
                                label: "White Slime Cat"
                            },
                            {
                                value: "pumpkin",
                                label: "Pumpking"
                            },
                            {
                                value: "pizza",
                                label: "Pizza"
                            },
                            {
                                value: "capybara",
                                label: "Capybara"
                            },
                            {
                                value: "beer",
                                label: "Beer"
                            },
                            {
                                value: "gingerbreadMan",
                                label: "Gingerbread Man"
                            },
                            {
                                value: "snowman",
                                label: "Snowman"
                            },
                            {
                                value: "reindeer",
                                label: "Reindeer"
                            },
                        ]
                    },
                    {
                        id: "randomize",
                        label: "Randomize Selected Pet",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "event",
                        label: "Event Skin",
                        type: "select",
                        options: [
                            {
                                value: "",
                                label: "None"
                            },
                            {
                                value: "halloween",
                                label: "Halloween"
                            },
                            {
                                value: "christmas",
                                label: "Christmas"
                            }
                        ]
                    }
                ]
            });

            this.currentPet = "pig";
            this.currentAction = "stand";
            this.pets = {}

            petObj = {
                type: 0, //0 pet, 1 skin
                requiredPet: "none", //none, petName
                name: "",
                creator: "Felipe",
                id: 23,
                downloads: 23,
                animations: {
                    stand: [20, "stand1"],
                    walk: [],
                    attack: [],
                    fishing_net: [],
                    fishing_rod: [],
                    harpoon: [],
                    mine_rock: [],
                    chop_tree: []
                }
            }
        }

        onConfigsChanged() {
            this.changePet(this.config["pet"]);
        }
        
        onPaint() {
            if(this.config["showPet"] === false) {return}
            if(FlatMMOPlus.loggedIn === false) {return}
            if(this.pets[this.currentPet].hasOwnProperty(this.currentAction)) {
                //Draw pig
                if (players[Globals.local_username].face_left) {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(this.pets[this.currentPet][this.currentAction].get_frame(), -(players[Globals.local_username].client_x + 160), players[Globals.local_username].client_y - 25, 96, 96);
                    ctx.restore();
                } else {
                    ctx.drawImage(this.pets[this.currentPet][this.currentAction].get_frame(), players[Globals.local_username].client_x - 96, players[Globals.local_username].client_y - 25, 96, 96);
                }
                if(this.config.randomize && Math.random() < 0.0000046296296296296296) {
                    this.randomizePet();
                }
            } else {
                this.currentAction = "stand";
            }
        }
 
        
        onLogin() {
            this.addPets();
        }

        onActionChanged() {
            if(!this.pets.hasOwnProperty(1)) {return};
            if(this.pets[this.currentPet].hasOwnProperty("stand_" + this.config.event)) {
                if(this.pets[this.currentPet].hasOwnProperty(FlatMMOPlus.currentAction + "_" + this.config.event)) {
                    this.currentAction = FlatMMOPlus.currentAction + "_" + this.config.event;
                } else {
                    this.currentAction = "stand_" + this.config.event;
                }
            } else if(this.pets[this.currentPet].hasOwnProperty(FlatMMOPlus.currentAction)) {
                this.currentAction = FlatMMOPlus.currentAction;
            }
        }
        
        changePet(pet) {
            this.currentPet = pet;
            this.currentAction = "stand";
            this.onActionChanged();
        }

        randomizePet() {
            const petArray = Object.keys(this.pets);
            const newIndex = Math.floor(Math.random() * petArray.length);
            this.changePet(petArray[newIndex])
        }

        addPet(petObj) {
            const pet = {
                name: petObj.name,
                skins: {
                    0: {
                        name: "Default",
                        animations: this.newAnimations(petObj.name, petObj.animations)
                    }
                }
            }

            this.pets[petObj.id] = pet;
        }

        addSkin(petObj) {
            //0 = pet, 1 = skin
            //Skins require the pet
            if(petObj.type === 1 && !this.pets.hasOwnProperty(petObj.requiredPet)) {
                return;
            }

            this.pets[petObj.requiredPet].skins[petObj.id] = {
                name: petObj.name,
                animations = this.newAnimations(petObj.animations)
            }
        }

        newAnimations(petName, animationNames) {
            const animations = {};
            for (action in animationNames) {
                const sheet = [];
                const speed = animationNames[action].shift();
                animationNames[action].forEach(img => {
                    sheet.push("https://pets.dounford.qt.ce/images/" + img);
                })
                animations[action] = new AnimationSheetPlus(petName + action, animationNames[action].length, speed, sheet);
            }
            return animations;
        }

        addDefaultPets() {
            const pig = {
                type: 0,
                id: 1,
                name: "Piggy",
                animations: {
                    stand: [50, "stand1"],
                    walk: [10],
                    attack: [20],
                    fishing_net: [25],
                    fishing_rod: [25],
                    harpoon: [25],
                    mine_rock: [15],
                    chop_tree: [20]
                }
            }
            const pigHalloween = {
                type: 1,
                id: 2,
                requiredPet: 1,
                name: "Halloween",
                animations: {
                    stand: [50, "stand1"],
                }
            }
            const pigChristmas = {
                type: 1,
                id: 3,
                requiredPet: 1,
                name: "Christmas",
                animations: {
                    stand: [50, "stand1"],
                    walk: [10],
                    attack: [20],
                    fishing_net: [25],
                    fishing_rod: [25],
                    harpoon: [25],
                    mine_rock: [15],
                    chop_tree: [20]
                }
            }

            this.addPet(pig);
            this.addSkin(pigHalloween);
            this.addSkin(pigChristmas);
        }
    }
 
    const plugin = new pets();
    FlatMMOPlus.registerPlugin(plugin);
 
})();