// ==UserScript==
// @name         FlatMMO+ Gamepad
// @namespace    com.dounford.flatmmo.gamepad
// @version      0.0.1
// @description  Adds Gamepad Support on FlatMMO
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// ==/UserScript==
 
(function() {
    'use strict';
    const buttonNames = {
        xbox: {
            a: "A",
            b: "B",
            x: "X",
            y: "Y",
            l1: "LB",
            l2: "LT",
            l3: "LS",
            r1: "RB",
            r2: "RT",
            r3: "RS",
            back: "BACK",
            start: "START",
            up: "↑ (UP)",
            down: "↓ (DOWN)",
            left: "← (LEFT)",
            right: "→ (RIGHT)",
        },
        playstation: {
            a: "✖",
            b: "⃝",
            x: "◻",
            y: "△",
            l1: "L1",
            l2: "L2",
            l3: "L3",
            r1: "R1",
            r2: "R2",
            r3: "R3",
            back: "SELECT",
            start: "START",
            up: "↑ (UP)",
            down: "↓ (DOWN)",
            left: "← (LEFT)",
            right: "→ (RIGHT)",
        }
    };
 
    class GamepadPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("gamepad", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "gamepadRemap",
                        label: "Remap Gamepad",
                        type: "panel",
                        panel: "gamepadRemap"
                    }
                ]
            });
            this.inventorySlotSelected = 0;
            this.mapObjectSelected = 0;
            this.paths = [];
            this.mappings = {
                a: 0,
                b: 1,
                x: 2,
                y: 3,
                l1: 4,
                l2: 6,
                l3: 10,
                r1: 5,
                r2: 7,
                r3: 11,
                back: 8,
                start: 9,
                up: 12,
                down: 13,
                left: 14,
                right: 15,
            };
        }
        
        onLogin() {
            console.log("SamplePlugin.onLogin");
        }

        //Called when the player changes map
        onMapChanged(mapBefore, mapAfter) {
            this.joinPaths();
        }
        
        //Called everytime something changes in the inventory
        onInventoryChanged() {
            document.getElementById("ui-panel-inventory-content").children[this.inventorySlotSelected].style.cssText = "border: 2px solid #ff0000 !important; background: darkgrey;"
        }

        //Called every frame after every other paint
        onPaint() {
            const currentPath = 0;
            let path = [...path2[currentPath]];
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            const firstVertice = path.pop();
            ctx.moveTo(firstVertice[0], firstVertice[1]);
            path.forEach(p=>{
                ctx.lineTo(p[0], p[1]);
            })
            ctx.stroke();
            ctx.closePath();
        }
        
        //These are used inside functions instead of being called directly by FMP
        additionalMethods() {
            //content can be html text or a function that returns html text
            FlatMMOPlus.addPanel("id","Title","content");
        }

        tileToCoord(tile) {
            return `${tile.x}-${tile.y}`;
        }

        joinPaths() {
            
            teleport_tiles = [
    {
        "x": 6,
        "y": 13
    },
    {
        "x": 7,
        "y": 13
    },
    {
        "x": 8,
        "y": 13
    },
    {
        "x": 22,
        "y": 0
    },
    {
        "x": 23,
        "y": 0
    },
    {
        "x": 23,
        "y": 1
    }
]
            //const tileCoords = teleport_tiles.map(tile => this.tileToCoord(tile));
            const tileCoords = ["6-13", "7-13", "8-13", "22-0", "23-0", "23-1"];
            const alreadyVisited = new Set();
let final = [[[6,13],[7,13],[8,13],[9,13],[9,14],[8,14],[7,14],[6,14],[6,13]], [[22, 0], [23, 0], [24, 0], [24, 1], [24, 2], [23, 2], [23, 1], [22, 1], [22, 0]]]
            let currentTeleport = [null, null, null, null]
            let currentPath = [];
            teleport_tiles.forEach((tile, index) => {
                if(!alreadyVisited.has(this.tileToCoord(tile))) {
                    const {x, y} = tile;
                    currentPath.push([x, y],[x + 1, y],[x + 1, y + 1],[x, y + 1])
                }
            })
        }
        
        
    }
    
    const plugin = new GamepadPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();