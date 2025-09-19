// ==UserScript==
// @name         FlatMMO+ Notepad
// @namespace    com.dounford.flatmmo.notepad
// @version      1.0.0
// @description  Ingame notepad
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class NotepadPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("notepad", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });

            this.notes = {};
            this.userNotes = {};
        }
        
        onLogin() {
            this.notes = JSON.parse(localStorage.getItem("FlatNotes") || {});
            this.userNotes = JSON.parse(localStorage.getItem("FlatUserNotes") || {});
        }
        
        //Receives all messages sent by the game server
        onMessageReceived(data) {
            // Will spam the console, uncomment if you want to see it
            //console.log("SamplePlugin.onMessageReceived: ", data);
        }
    }
    
    const plugin = new SamplePlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();