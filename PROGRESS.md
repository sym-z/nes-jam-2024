# PROGRESS

## TO-DO/TRACKING
- [x] **File Setup** 06-08-2024
- [x] **Initial Player Movement** 06-08-2024
- [x] **NES Controls Mapping** 06-09-2024
- [x] **Basic Grid Movement and Tile Collision** 06-11-2024
- [x] **Holding a Directional Input Uses "Turbo" After a Few Seconds** 6-12-2024
- [x] **Room-Based Camera Movement** 6-11-2024
- [x] **Local Storage Setup** 06-11-2024 
- [ ] **Enemies**
- [ ] **Player Animations**
- [ ] **Enemy Spawner Tiles**
- [ ] **Wave Based Difficulty**
- [ ] **Polish Level Design**
- [ ] **Item Shop**
- [ ] **Main Menu**
- [ ] **NES Control Binding Diagram**
- [ ] **Basic Ranged Attack with Collision**

## UPGRADES

| NAME | LEVEL | EFFECT | NOTES | PRIORITY |
| :--- | :---: | :----- | ----: | -------: |
| sickness | 1 | 1dmg inflicted every 3 seconds | triggered on first attack in room | 8 |
| sickness | 2 | 3dmg inflicted every 3 seconds | triggered on first attack in room | 8 |
| sickness | 3 | 5dmg inflicted every 3 seconds | triggered on first attack in room | 8 |
| sickness | 4 | 7dmg inflicted every 3 seconds | triggered on first attack in room | 8 |
| sickness | 5 | 10dmg inflicted every 3 seconds | triggered on first attack in room | 8 |
| paralysis | 1 | enemey slowed for 1 second | triggered on first attack per enemy | 6 |
| paralysis | 2 | enemey slowed for 3 second | triggered on first attack per enemy | 6 |
| paralysis | 3 | enemey slowed for 5 second | triggered on first attack per enemy | 6 |
| paralysis | 4 | enemey slowed for 7 second | triggered on first attack per enemy | 6 |
| paralysis | 5 | enemey slowed for 10 seconds | triggered on first attack per enemy | 6 |
| charm | 1 | half damage from attacks for 3 seconds | triggered on enetering room | 7 |
| charm | 2 | half damage from attacks for 6 seconds | triggered on enetering room | 7 |
| charm | 3 | half damage from attacks for 10 seconds | triggered on enetering room | 7 |
| fear | 1 | enemy flees/does not attack for 2 seconds | triggered on crit | 11 |
| fear | 2 | enemy flees/does not attack for 4 seconds | triggered on crit | 11 |
| fear | 3 | enemy flees/does not attack for 6 seconds | triggered on crit | 11 |
| max HP | inf | max HP +5 | | 1 |
| HP restore | 0 | HP is restored by 1p every 10 seconds | | 5 |
| HP restore | 1 | HP is restored by 1p every 8 seconds | | 5 |
| HP restore | 2 | HP is restored by 1p every 6 seconds | | 5 |
| HP restore | 3 | HP is restored by 1p every 4 seconds | | 5 |
| HP restore | 4 | HP is restored by 1p every 1 seconds | | 5 |
| max mana | inf | max mana +5 | | 2 |
| mana restore | 0 | HP is restored by 1p every 10 seconds | | 4 |
| mana restore | 1 | HP is restored by 1p every 8 seconds | | 4 |
| mana restore | 2 | HP is restored by 1p every 6 seconds | | 4 |
| mana restore | 3 | HP is restored by 1p every 4 seconds | | 4 |
| mana restore | 4 | HP is restored by 1p every 1 seconds | | 4 |
| attack | inf | attack +1 | | 3 |
| crit damage | 0 | crit = attack +5 | | 9 |
| crit damage | inf | crit +2 | | 9 |
| crit chance | 0 | crit = 4% | | 10 |
| crit chance | 1 | crit = 7%  | | 10 |
| crit chance | 2 | crit = 10%  | | 10 |
| crit chance | 3 | crit = 13%  | | 10 |
| crit chance | 4 | crit = 16%  | | 10 |
| crit chance | 5 | crit = 20%  | | 10 |
| magical attack | 0 | magical attack = attack +3 | | 3 |
| magical attack | inf | magical attack +1 | | 3 |
| magical heal | 0 | +1 HP | | 3 |

## ITEMS

| NAME | COST | EFFECT | PRIORITY |
| :--- | :--: |:----- | -------: |
|  |  | HP +5 | 1 |
|  |  | HP +10 | 1 |
|  |  | HP +15 | 1 |
|  |  | HP +25 | 1 |
|  |  | temp HP maximum +25 for 1 minute |  |
|  |  | temp HP maximum +35 for 1 minute |  |
|  |  | temp HP maximum +45 for 1 minute |  |
|  |  | temp HP maximum +60 for 1 minute |  |
|  |  | attack(and crit) +5 for 30 seconds |  |
|  |  | attack(and crit) +10 for 30 seconds |  |
|  |  | attack(and crit) +15 for 30 seconds |  |
|  |  | attack(and crit) +25 for 30 seconds |  |
|  |  | mana +5 | 2 |
|  |  | mana +10 | 2 |
|  |  | mana +15 | 2 |
|  |  | mana +25 | 2 |
|  |  | attack(and crit) +5 for 30 seconds |  |
|  |  | attack(and crit) +10 for 30 seconds |  |
|  |  | attack(and crit) +15 for 30 seconds |  |
|  |  | attack(and crit) +25 for 30 seconds |  |
|  |  | extra life, automatically respawn at front of room on defeat |  |