# About
Dungeon keeper like game.

## Mechanics, Tier 1

Primarily inspired by Dungeon Keeper, Dungeons, Underlord etc.

### Must-have

These mechanics are must-have for a minimum viable product

#### Dungeon

- Terrain: solid or empty (walkable), split into equally sized tiles
- Resources: Gold, in addition to terrain data
- Rendering: one tile type per terrain type (so two tiles in total)

#### AI

- Tasks: Task pool, each unit picks up one task & executes it. Executed tasks are consumed. Which tasks are picked is random / unimportant.
- Unavailable tasks: Areas must be split into accessible and non-accessible. Non-accessible areas are defined as non-pathable from any accessible area node. Tasks in non-accessible areas should be unavailable.
- A* path finding
- Dig task: Should have a target tile and be generated when a dig order is created. 

#### Interaction

- Order digging by clicking a tile
- Order digging multiple tiles by clicking and dragging
- Dig orders should be marked on the tile of the order

#### Game Structure

- One prototype level
- Load level from PNG file where dark pixels are solid and white are walkable. A BLUE pixel represents the player's start, and GREEN pixels represent trog starting positions

### Nice-to-haves

These mechanics would be nice to have but are not mandatory

#### Dungeon - Nice

- Terrain: Water, lava, void/pit, non-digable
- Resources: Gold veins, drop gold piles on ground next to them when mined out but stays as long as there's resources left
- Randomly generate dungeons

## Mechanics, Tier 2

These mechanics depend on Tier 1 and should involve more game play; adding challenges, and user interaction.
