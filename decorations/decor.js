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

            this.decorations = {
                coins: null
            }
            this.maps = {
                m1007_1002: [
                    {
                        x: 0,
                        y: 0,
                        name: "coins"
                    }
                ],
                m1001_1001: [
                    {
                        x: 18,
                        y: 4,
                        width: 256,
                        height: 320,
                        name: "apples"
                    }
                ],
                m1007_1000: [
                    {
                        "x": 17,
                        "y": 2,
                        "width": 256,
                        "height": 320,
                        "name": "apples"
                    },
                    {
                        "x": 2,
                        "y": 6,
                        "width": 256,
                        "height": 320,
                        "name": "apples"
                    },
                    {
                        "x": 7,
                        "y": 8,
                        "width": 256,
                        "height": 320,
                        "name": "apples"
                    }
                ]
            }
        }
        
        onPaint() {
            if(FlatMMOPlus.loggedIn === false) {return}
            if(this.config["showItems"] === false) {return}
            if(!this.maps.hasOwnProperty(current_map)) {return}
            this.maps[current_map].forEach(item => {
                ctx.drawImage(this.decorations[item.name].get_frame(), item.x * 64, item.y * 64, item.width || 64, item.height || 64);
            });
        }
 
        
        onLogin() {
            this.addDecoration()
        }

        addDecoration() {
            this.decorations.coins = new AnimationSheetPlus("coins", 1, "", 50, ["https://flatmmo.com/images/items/coins.png"])
            this.registerAnimation("apples", 1);
        }

        registerAnimation(item, frames, speed = 50) {
            const animations = [];
            for (let i = 0; i < frames; i++) {
                animations.push(`https://raw.githubusercontent.com/Dounford-Felipe/FlatMMO-Scripts/refs/heads/main/decorations/images/${item}${i}.png`);
            }
            this.decorations[item] = new AnimationSheetPlus(item, frames, "", speed, animations);
        }
    }
 
    const plugin = new notEnoughDecorations();
    FlatMMOPlus.registerPlugin(plugin);
 
})();