// making myself not miserable
'use strict'

// game config
let config = {
    parent: 'game',
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 256,
    height: 240,
    zoom: Math.min((window.innerHeight/256), (window.innerWidth/240)),
    scene: [ Load, Title, Keys, Room ]
}

// game variables
const game = new Phaser.Game(config)
// convenience variables
const centerX = game.config.width/2
const centerY = game.config.height/2
const width = game.config.width
const height = game.config.height
const tileSize = 8
const bigTileSize = tileSize*2
// console log color variables
const testColor = "color: #cfd1af"
const goodColor = "color: #91aa86"
const badColor = "color: #c088ae"
// cursor setup
let cursors, LEFT, RIGHT, UP, DOWN, A, B, SELECT, START