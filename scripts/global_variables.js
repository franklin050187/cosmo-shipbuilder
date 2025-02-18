//This contains most of the global variables

const gridSize = 32; // Size of each grid cell
let isPreviewSpriteLoaded = false; // init sprite preview
const gridMap = {}; // To store the grid map
let sprite_delete_mode = []; // To store the sprite delete mode
let global_sprites_to_place = [generatePart("cosmoteer.corridor")]; // To store the sprites to place
let global_properties_to_apply = []
let global_supply_chains_to_apply = []
let global_selected_sprites = []
let global_unmirrored_selected_sprites = []
let global_toggles_to_add = []
let global_mirror_axis = []
let global_mirror_center = [0,0]
let global_crew_assignments = []
let global_supply_chains = []
let global_sprites_to_draw = [] //Saves the sprites that are yet to be drawn
let global_sprites_to_delete = [] //Saves the sprites that are drawn to which should be deleted
let global_doors_to_draw = [] //Saves the doors that are yet to be drawn
let global_doors_to_delete = [] //Saves the doors that are drawn to which should be deleted
let global_recently_placed = [] //Saves recently placed parts
let global_weapon_targetes = []
let global_weapon_target_selection_toggle = false
let global_log = {0:"", 1:"", 2:""}

let global_copied_parts = []
let global_copied_supply_chains = []
let global_copied_doors = []
let global_copied_properties = []

let global_previous_mirror_mode = "vertical"
let sprites = []; // To store the sprites
let all_ship_stats = undefined

// adjust canvas size
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0; 

let shipdata = {}; // To store the ship data
let cursorMode = "Place"; // Initial cursor mode
let global_doors = []; // To store the doors
let global_resources = []; // To store the resources
let global_resources_to_place = []
let global_zoom_factor = 1
let global_canvases = [canvas, resource_canvas, drawing_canvas, preview_canvas, door_canvas, hitbox_canvas, grid_canvas]
let global_crew_role_to_place = undefined
let global_crew_roles = []
let global_crew_role_sources = []

const spriteCache = {};
const previewSpriteImage = new Image();
