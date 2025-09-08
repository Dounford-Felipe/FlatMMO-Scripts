// ==UserScript==
// @name         FlatMMO+ notEnoughDecorations
// @namespace    com.dounford.flatmmo.NED
// @version      0.0.1
// @description  Adds some decoration to the game
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

 
    class notEnoughDecorations extends FlatMMOPlusPlugin {
        constructor() {
            super("notEnoughDecorations", {
                about: {
                    name: "FlatMMO+ Not Enough Decorations",
                    version: "0.0.1",
                    author: "Dounford",
                    description: "Adds some decoration to the game"
                },
                config: [
                    {
						id: "showItems",
						label: "Show Items",
						type: "boolean",
						default: true
					},
                ]
            });

            this.decorations = {};
            this.maps = {
                m1007_1002: {
                    objects: [],
                    overlays: [
                        {
                            x: 0,
                            y: 0,
                            name: "coins"
                        }
                    ]
                },
                m1001_1001: {
                    objects: [],
                    overlays: [
                        {
                            name: "apples",
                            x: 18,
                            y: 4,
                            tile_width: 4,
                            tile_height: 5,
                        }
                    ]
                },
                m1007_1000: {
                    objects: [
                        {
                            "name": "picnicBlanket",
                            "x": 12,
                            "y": 10,
                            "tile_width": 4,
                            "tile_height": 3
                        },
                        {
                            "name": "picnicBottle",
                            "x": 13.1,
                            "y": 11.6,
                            "tile_width": 0.7,
                            "tile_height": 0.7
                        },
                        {
                            "name": "picnicBasket",
                            "x": 13,
                            "y": 11.5,
                            "tile_width": 1,
                            "tile_height": 1
                        },
                        {
                            "name": "picnicJello",
                            "x": 15,
                            "y": 10,
                            "tile_width": 0.7,
                            "tile_height": 0.7
                        },
                        {
                            "name": "picnicCake",
                            "x": 12.5,
                            "y": 10.5,
                            "tile_width": 0.7,
                            "tile_height": 0.7
                        }
                    ],
                    overlays: [
                        {
                            "name": "apples",
                            "x": 17,
                            "y": 2,
                            tile_width: 4,
                            tile_height: 5,
                        },
                        {
                            "name": "apples",
                            "x": 2,
                            "y": 6,
                            tile_width: 4,
                            tile_height: 5,
                        },
                        {
                            "name": "apples",
                            "x": 7,
                            "y": 8,
                            tile_width: 4,
                            tile_height: 5,
                        },
                    ]
                }
            }
        };

        //This is for overlays
        onPaint() {
            if(FlatMMOPlus.loggedIn === false) {return}
            if(this.config["showItems"] === false) {return}
            if(!this.maps.hasOwnProperty(current_map)) {return}
            const mousePos = get_postition_from_pixel(mouse_over_now.x, mouse_over_now.y)
            this.maps[current_map].overlays.forEach(item => {
                ctx.globalAlpha = is_mouse_on_map_object(mousePos.x, mousePos.y, item) ? 0.5 : 1;
                ctx.drawImage(this.decorations[item.name].get_frame(), item.x * 64, item.y * 64, (item.tile_width || 1) * 64, (item.tile_height || 1) * 64);
                ctx.globalAlpha = 1;
            });
        }

        //This is for objects (they will be under things like trees)
        onPaintObjects() {
            if(FlatMMOPlus.loggedIn === false) {return}
            if(this.config["showItems"] === false) {return}
            if(!this.maps.hasOwnProperty(current_map)) {return}
            this.maps[current_map].objects.forEach(item => {
                ctx.drawImage(this.decorations[item.name].get_frame(), item.x * 64, item.y * 64, (item.tile_width || 1) * 64, (item.tile_height || 1) * 64);
            });
        }
 
        
        onLogin() {
            ctx.imageSmoothingEnabled = false; //Pixel art will not look ass with this
            this.addDecoration()
        }

        addMap() {
            this.maps[current_map] = {
                overlays: [],
                objects: [
                    {
                        "name": "picnicBlanket",
                        "x": 0,
                        "y": 0,
                        "tile_width": 1,
                        "tile_height": 1
                    }
                ]
            }
        }

        addDecoration() {
            //Trees
            this.registerAnimation("apples", 1);

            //Flowers
            this.registerIPItem("poppy","poppy");
            this.registerIPItem("tulip","tulip");

            //Picnic Items (m1007_1000)
            this.registerAnimation("picnicBlanket", 1);
            this.registerIPItem("picnicBasket","basket_sigil");
            this.registerIPItem("picnicJello","banana_jello");
            this.registerIPItem("picnicCake","chocolate_cake");

            //In-game items (this doesn't get a function because I don't think there will be a lot)
            this.decorations["picnicBottle"] = new AnimationSheetPlus("picnicBottle", 1, "", 50, ["https://flatmmo.com/images/items/large_stardust_potion.png"]);
        }

        //This is for images hosted on my github
        registerAnimation(item, frames, speed = 50) {
            const animations = [];
            for (let i = 0; i < frames; i++) {
                animations.push(`https://raw.githubusercontent.com/Dounford-Felipe/FlatMMO-Scripts/refs/heads/main/decorations/images/${item}${i}.png`);
            }
            this.decorations[item] = new AnimationSheetPlus(item, frames, "", speed, animations);
        }

        //This is for Idle Pixel assets
        registerIPItem(item, image) {
            this.decorations[item] = new AnimationSheetPlus(item, 1, "", 50, [`https://cdn.idle-pixel.com/images/${image}.png`]);
        }
    }
 
    const plugin = new notEnoughDecorations();
    FlatMMOPlus.registerPlugin(plugin);
 
})();