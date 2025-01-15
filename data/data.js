/*
When a new part gets added into the game: 
adjust all data variables here

When a new resource gets added into the game: 
adjust resourceData and costBreakdownData

meanings of tags:

crew_transport: in game section for crew related parts
structure: in game section for structure related parts
energy weapon: in game section for energy weapon related parts
utilities: in game section for utilities related parts
defense: in game section for defense related parts
projectile weapon: in game section for projectile weapon related parts
flight: in game section for flight related parts
power: in game section for power related parts
factory: in game section for factory parts

weapon: Anything that can deal consistent damage
weapon like: Used for parts that dont deal damage but still have adjustable fire modes (currently only tractor beam)
on_off: parts that can be tunred on and off
fire_pref: weapons that cen be switched between attack, defend or both (flak and pd)
thruster: Anything that provides thrust
hyperdrive: hyperdrives (obviously lol)
sprite_size: how big the sprite is
size: how big the base is (without turrets and such)
real_size: Used if the sprite is bigger than the size but the hitbox isnt. This is to seperate drawing in the right position and checking for overlaps.
*/ 

const spriteData = {
	"cosmoteer.corridor": { mass: 1, size: [1, 1], cost: 0.1, tags: ["crew_transport"], hitboxes: [squareWithLength(1)]},
	"cosmoteer.door": { size: [1, 1], cost: 0.1, tags: ["crew_transport"] },
	"cosmoteer.delete": { mass: 1, size: [1, 1], tags: [""] },
	"cosmoteer.structure": { mass: 0.33, size: [1, 1], cost: 0.05, tags: ["structure"], hitboxes: [squareWithLength(1)]},
	"cosmoteer.structure_wedge": {
		mass: 0.17,
		size: [1, 1],
		cost: 0.025,
		tags: ["structure"],
		hitboxes: [[[1,0], [0,1], [1,1]]],
	},
	"cosmoteer.structure_1x2_wedge": {
		mass: 0.33,
		size: [1, 2],
		cost: 0.05,
		tags: ["structure"],
		hitboxes: [[[1,0], [1,2], [0,2]]],
	},
	"cosmoteer.structure_1x3_wedge": {
		mass: 0.5,
		size: [1, 3],
		cost: 0.075,
		tags: ["structure"],
		hitboxes: [[[1,0], [1,3], [0,3]]],
	},
	"cosmoteer.structure_tri": {
		mass: 0.08,
		size: [1, 1],
		cost: 0.025,
		tags: ["structure"],
		hitboxes: [[[1,1], [0,1], [0.5,0.5]]],
	},
	"cosmoteer.laser_blaster_small": {
		mass: 2.5,
		size: [1, 2],
		sprite_size: [1, 4],
		dps: 667,
		burst_damage: 500,
		cost: 2,
		tags: ["weapon", "on_off", "energy weapon"],
		cp_cost: 2,
		hitboxes: [rectWithLengths(1, 2), circle([0.5, -0.54], 0.46)],
	},
	"cosmoteer.laser_blaster_large": {
		mass: 7.68,
		size: [2, 3],
		sprite_size: [2, 6],
		dps: 1778,
		burst_damage: 1000,
		cost: 6,
		tags: ["weapon", "on_off", "energy weapon"],
		cp_cost: 4,
		hitboxes: [rectWithLengths(2, 3), circle([1, -1], 0.75)],
	},
	"cosmoteer.disruptor": {
		mass: 3.48,
		size: [1, 3],
		sprite_size: [1, 5],
		dps: 100,
		burst_damage: 200,
		cost: 3,
		tags: ["weapon", "on_off", "energy weapon"],
		cp_cost: 2,
		hitboxes: [rectWithLengths(1, 3), circle([0.5, -(1-0.390625)], 0.45)],
	},
	"cosmoteer.ion_beam_emitter": {
		mass: 8,
		size: [2, 4],
		sprite_size: [2, 5],
		dps: 2500,
		burst_damage: 0,
		cost: 10,
		tags: ["weapon", "on_off", "energy weapon"],
		cp_cost: 4,
		hitboxes: [rectWithLengths(2, 4)],
	},
	"cosmoteer.resource_collector": {
		mass: 4,
		size: [2, 2],
		cost: 0,
		tags: ["on_off"],
		cp_cost: 4,
		hitboxes: [rectWithLengths(2, 2)],
	},
	"cosmoteer.ion_beam_prism": {
		mass: 7.7,
		size: [2, 2],
		sprite_size: [2, 2.5],
		real_size: [2,2],
		cost: 5,
		tags: ["energy weapon"],
		cp_cost: 2,
		hitboxes: [circle([1, 1], 0.75)],
	},
	"cosmoteer.tractor_beam_emitter": {
		mass: 32.07,
		size: [5, 5],
		cost: 40,
		tags: ["on_off", "weapon_like", "utilities"],
		cp_cost: 8,
		hitboxes: [squareWithLength(5), circle([2.5, 2.5], 1.5)],
	},
	"cosmoteer.point_defense": {
		mass: 1,
		size: [1, 1],
		sprite_size: [1, 2],
		dps: 525,
		burst_damage: 35,
		cost: 1,
		tags: ["weapon", "on_off", "fire_pref", "defense", "energy weapon"],
		cp_cost: 1,
		hitboxes: [squareWithLength(1), circle([0.5, 1-0.8128], 0.35)],
	},
	"cosmoteer.mining_laser_small": {
		mass: 7.4,
		size: [2, 3],
		dps: 1200,
		burst_damage: 0,
		cost: 6,
		tags: ["weapon", "on_off", "energy weapon", "utilities"],
		cp_cost: 3,
		hitboxes: [rectWithLengths(2, 3), circle([1, 2], 0.35)],
	},
	"cosmoteer.cannon_med": {
		mass: 4.44,
		size: [2, 1],
		sprite_size: [2, 3],
		dps: 1000,
		burst_damage: 750,
		cost: 2,
		tags: ["weapon", "on_off", "projectile weapon"],
		cp_cost: 2,
		hitboxes: [rectWithLengths(1, 2), circle([1, 0], 0.72)],
	},
	"cosmoteer.sensor_array": {
		mass: 11.54,
		size: [3, 3],
		cost: 20,
		tags: ["on_off", "utilities"],
		cp_cost: 8,
		hitboxes: [squareWithLength(3), circle([1.5, 1.5], 0.9)],
	},
	"cosmoteer.cannon_large": {
		mass: 12.29,
		size: [3, 2],
		sprite_size: [3, 5],
		dps: 2000,
		burst_damage: 2400,
		cost: 5,
		tags: ["weapon", "on_off", "projectile weapon"],
		cp_cost: 4,
		hitboxes: [rectWithLengths(3, 2), circle([1.5, 0], 1.155)],
	},
	"cosmoteer.hyperdrive_beacon": {
		mass: 17.13,
		size: [4, 4],
		cost: 40,
		tags: ["on_off", "utilities"],
		cp_cost: 12,
		hitboxes: [squareWithLength(3)],
	},
	"cosmoteer.cannon_deck": {
		mass: 27.07,
		size: [4, 5],
		sprite_size: [4, 7],
		dps: 6000,
		burst_damage: 7500,
		cost: 20,
		tags: ["weapon", "on_off", "projectile weapon"],
		cp_cost: 8,
		hitboxes: [rectWithLengths(4,5), circle([2, 122/64], 1.5)],
	},
	"cosmoteer.explosive_charge": {
		mass: 1,
		size: [1, 1],
		cost: 0.6,
		tags: ["utilities"],
		hitboxes: [squareWithLength(1)],
	},
	"cosmoteer.roof_light": { mass: 1, size: [1, 1], cost: 0.2, tags: ["on_off", "utilities"], hitboxes: [squareWithLength(1)] },
	"cosmoteer.missile_launcher": {
		mass: 8,
		size: [2, 3],
		sprite_size: [2, 4],
		dps: 0,
		burst_damage: 0,
		cost: 10,
		tags: ["on_off"],
		cp_cost: 5,
		hitboxes: [rectWithLengths(2,3)],
	},
	"cosmoteer.roof_headlight": {
		mass: 1,
		size: [1, 1],
		cost: 0.3,
		tags: ["on_off", "utilities"],
		hitboxes: [squareWithLength(1)],
	},
	"cosmoteer.railgun_loader": {
		mass: 24,
		size: [2, 3],
		cost: 12.5,
		tags: ["on_off", "projectile weapon"],
		cp_cost: 4,
		hitboxes: [rectWithLengths(2,3)],
	},
	"cosmoteer.armor_structure_hybrid_1x1": {
		mass: 1.5,
		size: [1, 1],
		cost: 0.125,
		tags: ["defense", "structure", "armor"],
		hitboxes: [[[1,0], [0,1], [1,1]]],
	},
	"cosmoteer.armor_structure_hybrid_1x2": {
		mass: 3,
		size: [1, 2],
		cost: 0.25,
		tags: ["defense", "structure", "armor"],
		hitboxes: [[[1,0], [1,2], [0,2]]],
	},
	"cosmoteer.railgun_accelerator": {
		mass: 36,
		size: [2, 3],
		cost: 7.5,
		tags: ["on_off", "projectile weapon"],
		cp_cost: 1,
		hitboxes: [rectWithLengths(2,3)],
	},
	"cosmoteer.armor_structure_hybrid_1x3": {
		mass: 4.5,
		size: [1, 3],
		cost: 0.375,
		tags: ["defense", "structure", "armor"],
		hitboxes: [[[1,0], [1,3], [0,3]]],
	},
	"cosmoteer.armor_structure_hybrid_tri": {
		mass: 1,
		size: [1, 1],
		cost: 0.075,
		tags: ["defense", "structure", "armor"],
		hitboxes: [[[1,1], [0,1], [0.5,0.5]]],
	},
	"cosmoteer.railgun_launcher": {
		mass: 36,
		size: [2, 3],
		sprite_size: [2, 4],
		dps: 10000,
		burst_damage: 2500,
		cost: 7.5,
		tags: ["weapon", "on_off", "projectile weapon"],
		cp_cost: 1,
		hitboxes: [rectWithLengths(2,3)],
	},
	"cosmoteer.armor": { 
		mass: 3, 
		size: [1, 1], 
		cost: 0.2, 
		tags: ["defense", "armor"] , 
		hitboxes: [squareWithLength(1)],
	},
	"cosmoteer.armor_2x1": { 
		mass: 6, 
		size: [2, 1], 
		cost: 0.4, 
		tags: ["defense", "armor"],
		hitboxes: [rectWithLengths(2,1)],
	},
	"cosmoteer.flak_cannon_large": {
		mass: 16.77,
		size: [3, 6],
		sprite_size: [3, 8],
		dps: 9,
		burst_damage: 2250,
		cost: 21,
		tags: ["weapon", "on_off", "fire_pref", "defense", "projectile weapon"],
		cp_cost: 6,
		hitboxes: [rectWithLengths(3,5), circle([1.5, 0], 0.75)],
	},
	"cosmoteer.armor_wedge": { 
		mass: 1.5, 
		size: [1, 1], 
		cost: 0.1, 
		tags: ["defense", "armor"],
		hitboxes: [[[1,0], [0,1], [1,1]]],
	},
	"cosmoteer.armor_1x2_wedge": {
		mass: 3,
		size: [1, 2],
		cost: 0.2,
		tags: ["defense", "armor"],
		hitboxes: [[[1,0], [1,2], [0,2]]],
	},
	"cosmoteer.shield_gen_small": {
		mass: 6,
		size: [2, 2],
		sprite_size: [2, 3],
		cost: 5,
		tags: ["on_off", "defense"],
		cp_cost: 3,
		hitboxes: [rectWithLengths(2,3)],
	},
	"cosmoteer.armor_1x3_wedge": {
		mass: 4.5,
		size: [1, 3],
		cost: 0.3,
		tags: ["defense", "armor"],
		hitboxes: [[[1,0], [1,3], [0,3]]],
	},
	"cosmoteer.armor_tri": { 
		mass: 0.75, 
		size: [1, 1], 
		cost: 0.05, 
		tags: ["defense", "armor"],
		hitboxes: [[[1,1], [0,1], [0.5,0.5]]],
	},
	"cosmoteer.shield_gen_large": {
		mass: 12.65,
		size: [3, 6],
		cost: 20,
		tags: ["on_off", "defense"],
		cp_cost: 6,
		hitboxes: [translatedPoly(rectWithLengths(3,4), [0,2]), circle([1.5, 1.9], 1.4375)],
	},
	"cosmoteer.thruster_small": {
		mass: 1.3,
		size: [1, 1],
		sprite_size: [1, 2],
		cost: 0.5,
		tags: ["thruster", "on_off", "flight"],
		cp_cost: 1,
		thrust: [0, 0, 0.4, 0],
		hitboxes: [squareWithLength(1), ],
	},
	"cosmoteer.thruster_med": {
		mass: 2.45,
		size: [1, 2],
		sprite_size: [1, 3],
		cost: 1.5,
		tags: ["thruster", "on_off", "flight"],
		cp_cost: 2,
		thrust: [0, 0, 1.2, 0],
		hitboxes: [rectWithLengths(1,2), ],
	},
	"cosmoteer.thruster_large": {
		mass: 4.99,
		size: [2, 2],
		sprite_size: [2, 3],
		cost: 4,
		tags: ["thruster", "on_off", "flight"],
		cp_cost: 4,
		thrust: [0, 0, 3.2, 0],
		hitboxes: [squareWithLength(2), ],
	},
	"cosmoteer.thruster_boost": {
		mass: 8.88,
		size: [2, 3],
		sprite_size: [2, 5],
		cost: 6,
		tags: ["thruster", "on_off", "flight"],
		cp_cost: 6,
		thrust: [0, 0, 3.2, 0],
		hitboxes: [rectWithLengths(2,3), ],
	},
	"cosmoteer.fire_extinguisher": {
		mass: 1,
		size: [1, 1],
		cost: 0.3,
		tags: ["defense"],
		hitboxes: [squareWithLength(1)],
	},
	"cosmoteer.thruster_huge": {
		mass: 11,
		size: [3, 3],
		sprite_size: [3, 5],
		cost: 10,
		tags: ["thruster", "on_off", "flight"],
		cp_cost: 8,
		thrust: [0, 0, 8, 0],
		hitboxes: [squareWithLength(3), ],
	},
	"cosmoteer.control_room_small": {
		mass: 4,
		size: [2, 2],
		cost: 10,
		tags: ["on_off", "flight"],
		cp_cost: 0,
		hitboxes: [squareWithLength(2)],
	},
	"cosmoteer.control_room_med": {
		mass: 9,
		size: [3, 3],
		cost: 25,
		tags: ["on_off", "flight"],
		cp_cost: 0,
		hitboxes: [squareWithLength(3)],
	},
	"cosmoteer.thruster_small_2way": {
		mass: 1.61,
		size: [1, 1],
		sprite_size: [2, 2],
		cost: 1,
		tags: ["thruster", "on_off", "flight"],
		cp_cost: 2,
		thrust: [0, 0.4, 0.4, 0],
		hitboxes: [squareWithLength(1), ],
	},
	"cosmoteer.control_room_large": {
		mass: 16,
		size: [4, 4],
		cost: 50,
		tags: ["on_off", "flight"],
		cp_cost: 0,
		hitboxes: [squareWithLength(4)],
	},
	"cosmoteer.thruster_small_3way": {
		mass: 1.91,
		size: [1, 1],
		sprite_size: [3, 2],
		cost: 1.5,
		tags: ["thruster", "on_off", "flight"],
		cp_cost: 3,
		thrust: [0, 0.4, 0.4, 0.4],
		hitboxes: [squareWithLength(1), ],
	},
	"cosmoteer.hyperdrive_small": {
		mass: 4,
		size: [2, 2],
		cost: 10,
		tags: ["hyperdrive", "on_off", "flight"],
		hitboxes: [squareWithLength(2)],
	},
	"cosmoteer.engine_room": {
		mass: 9,
		size: [3, 3],
		cost: 12,
		tags: ["on_off", "flight"],
		cp_cost: 6,
		hitboxes: [squareWithLength(3)],
	},
	"cosmoteer.crew_quarters_small": {
		mass: 2,
		size: [1, 2],
		cost: 1.6,
		tags: ["crew", "crew_transport"],
		hitboxes: [rectWithLengths(1,2)],
	},
	"cosmoteer.crew_quarters_med": {
		mass: 4,
		size: [2, 2],
		cost: 4.2,
		tags: ["crew", "crew_transport"],
		hitboxes: [squareWithLength(2)],
	},
	"cosmoteer.airlock": { 
		mass: 1, 
		size: [1, 1], 
		cost: 0.6, 
		tags: ["on_off", "crew_transport"], 
		hitboxes: [squareWithLength(1)],
	},
	"cosmoteer.conveyor": { 
		mass: 1, size: [1, 1], 
		cost: 0.2, 
		tags: ["crew_transport"], 
		hitboxes: [squareWithLength(1)], 
	},
	"cosmoteer.reactor_small": { 
		mass: 4, 
		size: [2, 2], 
		cost: 25, 
		tags: ["power", "reactor"], 
		hitboxes: [squareWithLength(1)], 
	},
	"cosmoteer.reactor_med": { 
		mass: 9, 
		size: [3, 3], 
		cost: 50, 
		tags: ["power", "reactor"], 
		hitboxes: [squareWithLength(2)], 
	},
	"cosmoteer.reactor_large": { 
		mass: 16, size: [4, 4], 
		cost: 75, tags: ["power", "reactor"], 
		hitboxes: [squareWithLength(3)], 
	},
	"cosmoteer.power_storage": { 
		mass: 4, 
		size: [2, 2], 
		cost: 4, 
		tags: ["power", "storage"], 
		hitboxes: [squareWithLength(2)], 
	},
	"cosmoteer.factory_ammo": {
		mass: 4,
		size: [2, 2],
		cost: 4.1,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [squareWithLength(2)], 
	},
	"cosmoteer.factory_he": {
		mass: 9,
		size: [3, 3],
		cost: 15.2,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [squareWithLength(3)], 
	},
	"cosmoteer.factory_emp": {
		mass: 12,
		size: [3, 4],
		cost: 20.5,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [rectWithLengths(3,4)],
	},
	"cosmoteer.factory_nuke": {
		mass: 16,
		size: [4, 4],
		cost: 27.1,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [squareWithLength(4)], 
	},
	"cosmoteer.factory_mine": {
		mass: 12,
		size: [4, 3],
		cost: 20.18,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [rectWithLengths(4,3)],
	},
	"cosmoteer.factory_steel": {
		mass: 16,
		size: [4, 4],
		cost: 30.4,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [squareWithLength(4)], 
	},
	"cosmoteer.factory_coil": {
		mass: 9,
		size: [3, 3],
		cost: 30.8,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [squareWithLength(3)], 
	},
	"cosmoteer.factory_coil2": {
		mass: 12,
		size: [4, 3],
		cost: 54.8,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [squareWithLength(3)], 
	},
	"cosmoteer.factory_tristeel": {
		mass: 16,
		size: [4, 4],
		cost: 68.2,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [squareWithLength(4)], 
	},
	"cosmoteer.factory_diamond": {
		mass: 6,
		size: [2, 3],
		cost: 53.2,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [rectWithLengths(2,3)],
	},
	"cosmoteer.factory_processor": {
		mass: 9,
		size: [3, 3],
		cost: 89,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [squareWithLength(3)], 
	},
	"cosmoteer.factory_uranium": {
		mass: 12,
		size: [3, 4],
		cost: 98,
		tags: ["on_off", "factory"],
		cp_cost: 1,
		hitboxes: [rectWithLengths(2,3)],
	},
	"cosmoteer.storage_2x2": { 
		mass: 4, 
		size: [2, 2], 
		cost: 1.2, 
		tags: ["storage"] ,
		hitboxes: [squareWithLength(2)], 
	},
	"cosmoteer.storage_3x2": { 
		mass: 6, 
		size: [3, 2], 
		cost: 1.8, 
		tags: ["storage"],
		hitboxes: [rectWithLengths(3,2)],
	},
	"cosmoteer.storage_3x3": { 
		mass: 9, 
		size: [3, 3], 
		cost: 2.7, 
		tags: ["storage"],
		hitboxes: [squareWithLength(3)], 
	},
	"cosmoteer.storage_4x3": { 
		mass: 12, 
		size: [4, 3], 
		cost: 3.6, 
		tags: ["storage"],
		hitboxes: [rectWithLengths(4,3)],
	},
	"cosmoteer.storage_4x4": { 
		mass: 16, 
		size: [4, 4], 
		cost: 4.8, 
		tags: ["storage"],
		hitboxes: [squareWithLength(4)], 
	},
	"cosmoteer.chaingun": {
		mass: 17.77,
		size: [3, 5],
		sprite_size: [3, 7],
		dps: 18000,
		burst_damage: 0,
		cost: 24,
		tags: ["weapon", "on_off", "projectile weapon"],
		cp_cost: 6,
		hitboxes: [rectWithLengths(3,4), circle([1.5,0.9], 54/64), circle([96/64, -(2-136/64)], 94/64)],
	},
	"cosmoteer.chaingun_magazine": {
		mass: 2,
		size: [1, 2],
		cost: 1,
		tags: ["projectile weapon"],
		hitboxes: [rectWithLengths(1,2)],
	},
	"cosmoteer.hyperdrive_large": {
		mass: 16,
		size: [4, 4],
		cost: 34,
		tags: ["hyperdrive", "on_off", "flight"],
		hitboxes: [squareWithLength(4)], 
	},
	"cosmoteer.thruster_rocket_battery": {
		mass: 2,
		size: [1, 2],
		cost: 3,
		tags: ["flight"],
		hitboxes: [rectWithLengths(1,2)],
	},
	"cosmoteer.thruster_rocket_extender": {
		mass: 6,
		size: [3, 2],
		cost: 6,
		tags: ["thruster", "on_off", "flight"],
		thrust: [0, 0, 8, 0],
		hitboxes: [rectWithLengths(3,2)],
	},
	"cosmoteer.thruster_rocket_nozzle": {
		mass: 14.4,
		size: [3, 4],
		sprite_size: [3, 5],
		cost: 15,
		tags: ["thruster", "on_off", "flight"],
		cp_cost: 16,
		thrust: [0, 0, 10, 0],
		hitboxes: [rectWithLengths(3,4)],
	},
	"cosmoteer.hyperdrive_med": {
		mass: 9,
		size: [3, 3],
		cost: 20,
		tags: ["hyperdrive", "on_off", "flight"],
		hitboxes: [squareWithLength(3)], 
	},
	"cosmoteer.manipulator_beam_emitter": {
		mass: 4,
		size: [2, 2],
		cost: 3,
		tags: ["on_off", "utilities"],
		cp_cost: 4,
		hitboxes: [squareWithLength(2)], 
	},
	"cosmoteer.crew_quarters_large": {
		mass: 12,
		size: [3, 4],
		cost: 15.6,
		tags: ["crew", "crew_transport"],
		hitboxes: [rectWithLengths(3,4)],
	},
};
const costBreakdownData = {
	"weapon": ["laser_blaster_small", "laser_blaster_large", "cannon_deck", "cannon_large", "cannon_med", "chaingun", "chaingun_magazine", "disruptor", "flak_cannon_large", "ion_beam_emitter", "ion_beam_prism", "mining_laser_small", "missile_launcher", "point_defense", "railgun_accelerator", "railgun_launcher", "railgun_loader", "railgun_accelerator"],
	"armor": ["armor", "armor_1x2_wedge", "armor_1x3_wedge", "armor_2x1", "armor", "armor_structure_hybrid_1x1", "armor_structure_hybrid_1x2", "armor_structure_hybrid_1x3", "armor_tri", "armor_wedge"],
	"shields": ["shield_gen_large", "shield_gen_small"],
	"infrastructure": ["airlock", "conveyor", "corridor", "crew_quarters_large", "crew_quarters_med", "crew_quarters_small", "door", "power_storage"],
	"thrust": ["engine_room", "thruster_boost", "thruster_huge", "thruster_large", "thruster_med", "thruster_small", "thruster_small_2way", "thruster_small_3way", "thruster_rocket_battery", "thruster_rocket_extender", "thruster_rocket_nozzle", ],
	"reactors": ["reactor_large", "reactor_med", "reactor_small"],
	"resources": ["storage_2x2","storage_3x2", "storage_3x3", "storage_4x3", "storage_4x4", "factory_ammo", "factory_coil", "factory_coil2", "factory_diamond", "factory_emp", "factory_he", "factory_mine", "factory_nuke", "factory_processor", "factory_steel", "factory_tristeel", "factory_uranium"],
	"utility": ["hyperdrive_beacon", "manipulator_beam_emitter", "sensor_array", "tractor_beam_emitter"],
	"other": ["control_room_small", "control_room_med", "control_room_large", "explosive_charge", "fire_extinguisher", "hyperdrive_small", "hyperdrive_med", "hyperdrive_large", "roof_headlight", "roof_light", "structure", "structure_1x2_wedge", "structure_1x3_wedge", "structure_tri", "structure_wedge"],
}
const resourceData = {
	"battery": {cost: 0, category: "power", stack_size: 1},
	"bullet": {cost: 4, category: "ammo", stack_size: 40},
	"carbon": {cost: 160, category: "ore", stack_size: 5},
	"coil": {cost: 10, category: "refined", stack_size: 40},
	"coil2": {cost: 300, category: "refined", stack_size: 40},
	"copper": {cost: 80, category: "ore", stack_size: 5},
	"diamond": {cost: 4000, category: "refined", stack_size: 5},
	"enriched_uranium": {cost: 2000, category: "refined", stack_size: 10},
	"gold": {cost: 500, category: "ore", stack_size: 5},
	"hyperium": {cost: 50, category: "fuel", stack_size: 20},
	"iron": {cost: 20, category: "ore", stack_size: 5},
	"mine_part": {cost: 52, category: "ammo", stack_size: 8},
	"missile_part_emp": {cost: 20, category: "ammo", stack_size: 10},
	"missile_part_he": {cost: 8, category: "ammo", stack_size: 10},
	"missile_part_nuke": {cost: 36, category: "ammo", stack_size: 10},
	"processor": {cost: 2500, category: "refined", stack_size: 5},
	"steel": {cost: 25, category: "refined", stack_size: 40},
	"sulfur": {cost: 20, category: "ore", stack_size: 5},
	"tristeel": {cost: 200, category: "refined", stack_size: 40},
	"tritanium": {cost: 160, category: "ore", stack_size: 5},
	"uranium": {cost: 400, category: "ore", stack_size: 5},
}
const upTurrets = [
	"cosmoteer.laser_blaster_small",
	"cosmoteer.laser_blaster_large",
	"cosmoteer.disruptor",
	"cosmoteer.ion_beam_emitter",
	"cosmoteer.ion_beam_prism",
	"cosmoteer.point_defense",
	"cosmoteer.cannon_med",
	"cosmoteer.cannon_large",
	"cosmoteer.cannon_deck",
	"cosmoteer.missile_launcher",
	"cosmoteer.railgun_launcher",
	"cosmoteer.flak_cannon_large",
	"cosmoteer.shield_gen_small",
	"cosmoteer.chaingun",
];
const downTurrets = [
	"cosmoteer.thruster_small",
	"cosmoteer.thruster_med",
	"cosmoteer.thruster_large",
	"cosmoteer.thruster_huge",
	"cosmoteer.thruster_boost",
];
const mergingParts = [
	"cosmoteer.corridor",
	"cosmoteer.conveyor"
]

const multiple_turrets = [
	"cosmoteer.thruster_small_2way",
	"cosmoteer.thruster_small_3way",
];

//A single corridor block
const startup_ship_data = {"Author": "Ship Builder", "BuildCenterlineNESW": null, "BuildCenterlineNWSE": null, "BuildCenterlineX": null, "BuildCenterlineY": null, "BuildMirrorAxis": 1, "BuildMirrorEnabled": false, "CrewSourceRoles": "Unset", "CrewSourceTargets": "Unset", "Decals1": "Unset", "Decals2": "Unset", "Decals3": "Unset", "DefaultAttackFollowAngle": null, "DefaultAttackRadius": null, "DefaultAttackRotation": null, "Description": "", "Doors": "Unset", "FlightDirection": 1, "FormationOrder": 3, "Name": "Unnamed Ship", "NewFlexResourceGridTypes": "Unset", "PaintCenterlineNESW": null, "PaintCenterlineNWSE": null, "PaintCenterlineX": null, "PaintCenterlineY": null, "PaintMirrorAxis": 1, "PaintMirrorEnabled": false, "PartControlGroups": "Unset", "Parts": [{"FlipX": false, "ID": "cosmoteer.corridor", "Location": [-1, 0], "Rotation": 0}], "PartUIColorValues": "Unset", "PartUIToggleStates": "Unset", "ResourceConsumptionToggles": "Unset", "ResourceSupplierTargets": "Unset", "ResourceSupplyToggles": "Unset", "Roles": [{"AssignmentPriority": 5, "AutoFillFromLower": true, "Color": ["D093943E", "00000000", "D678583F", "0000803F"], "ID": -2147483648, "Name": "Supply", "Priorities": [{"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.laser_blaster_small"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.laser_blaster_large"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.disruptor"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.ion_beam_emitter"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_med"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small"}, "Value": 5}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_large"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_deck"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.missile_launcher"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.railgun_loader"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.chaingun"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.shield_gen_small"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.shield_gen_large"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.flak_cannon_large"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.point_defense"}, "Value": 3}, {"Key": {"ComponentID": "FireExtinguishJob", "PartID": "cosmoteer.fire_extinguisher"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_large"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_small"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_med"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_med"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_small"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_large"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small_2way"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small_3way"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_med"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_boost"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_huge"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_large"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.engine_room"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_small"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_med"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_large"}, "Value": 8}, {"Key": {"ComponentID": "ResourceTransferJob.Collect", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "SalvageJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "ConstructPartJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "DeconstructJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "RepairPartJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.power_storage"}, "Value": 3}, {"Key": {"ComponentID": "SulfurConsumer", "PartID": "cosmoteer.factory_ammo"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_ammo"}, "Value": 5}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 5}, {"Key": {"ComponentID": "SulfurConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 5}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 5}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 5}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 5}, {"Key": {"ComponentID": "UraniumConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 5}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 2}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 2}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_steel"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_steel"}, "Value": 2}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_coil"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_coil"}, "Value": 2}, {"Key": {"ComponentID": "CoilConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 2}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 2}, {"Key": {"ComponentID": "TritaniumConsumer", "PartID": "cosmoteer.factory_tristeel"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_tristeel"}, "Value": 2}, {"Key": {"ComponentID": "CarbonConsumer", "PartID": "cosmoteer.factory_diamond"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_diamond"}, "Value": 2}, {"Key": {"ComponentID": "CoilConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 2}, {"Key": {"ComponentID": "GoldConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 2}, {"Key": {"ComponentID": "UraniumConsumer", "PartID": "cosmoteer.factory_uranium"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_uranium"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.mining_laser_small"}, "Value": 6}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.resource_collector"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.resource_collector"}, "Value": 5}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.tractor_beam_emitter"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.sensor_array"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.sensor_array"}, "Value": 7}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.hyperdrive_beacon"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.laser_blaster_small"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.laser_blaster_large"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.disruptor"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.ion_beam_emitter"}, "Value": 6}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.mining_laser_small"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_med"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_large"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_deck"}, "Value": 6}, {"Key": {"ComponentID": "MissileStorage", "PartID": "cosmoteer.missile_launcher"}, "Value": 6}, {"Key": {"ComponentID": "EMPMissilesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 6}, {"Key": {"ComponentID": "NukeMissilesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 6}, {"Key": {"ComponentID": "MinesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.railgun_loader"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.railgun_accelerator"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.railgun_launcher"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumerLeft", "PartID": "cosmoteer.chaingun"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.chaingun_magazine"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.flak_cannon_large"}, "Value": 6}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.engine_room"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.tractor_beam_emitter"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_beacon"}, "Value": 5}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_med"}, "Value": 5}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_large"}, "Value": 5}, {"Key": {"ComponentID": "flex_grid_uranium", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_gold", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_bullet", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_missile_part_he", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_missile_part_nuke", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_mine_part", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_missile_part_emp", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_steel", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_coil2", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_tristeel", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_coil", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_diamond", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_processor", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_sulfur", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_enriched_uranium", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_iron", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_copper", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_tritanium", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_carbon", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_hyperium", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_small"}, "Value": 5}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.thruster_rocket_nozzle"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_battery"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_extender"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_nozzle"}, "Value": 7}]}], "RoofBaseColor": ["00000000", "00000000", "00000000", "00000000"], "RoofBaseTexture": "_none_", "RoofDecalColor1": ["0000803F", "0000803F", "0000803F", "0000803F"], "RoofDecalColor2": ["0000003F", "0000003F", "0000003F", "0000803F"], "RoofDecalColor3": ["0000803F", "00000000", "00000000", "0000803F"], "ShipRulesID": "cosmoteer.terran", "Version": 3, "WeaponDirectControlBindings": "Unset", "WeaponSelfTargets": "Unset", "WeaponShipRelativeTargets": "Unset"}
