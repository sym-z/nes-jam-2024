// making myself not miserable
'use strict'

// game config
let config = {
    parent: 'game',
    type: Phaser.AUTO,
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
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
    scene: [ Load, Title, ItemShop, Room, Keys, Dev ]
}

// game variables
const game = new Phaser.Game(config)
let ROOM, LEVEL, ITEMS, UPGRADES, RICHES
// convenience variables
const centerX = game.config.width/2
const centerY = game.config.height/2
const width = game.config.width
const height = game.config.height
const tileSize = 8
const bigTileSize = tileSize*2
// console log color variables
const testColor = "color: #91aa86;"
const goodColor = "color: #cfd1af;"
const badColor = "color: #c088ae;"
const logSize = "font-size: 1.25em;"
const logWeight = "font-weight: bold;"
const logFamily = "font-family: sans-serif;"
// cursor setup
let LEFT, RIGHT, UP, DOWN, A, B, SELECT, START
let cursors, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, ELEVEN, TWELVE, QUESTION