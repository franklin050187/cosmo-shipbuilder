const crew_roles = {
    "Supply": {"AssignmentPriority": 5, "AutoFillFromLower": true, "Color": ["D093943E", "00000000", "D678583F", "0000803F"], "ID": -2147483648, "Name": "Supply", "Priorities": [{"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.laser_blaster_small"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.laser_blaster_large"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.disruptor"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.ion_beam_emitter"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_med"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small"}, "Value": 5}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_large"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_deck"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.missile_launcher"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.railgun_loader"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.chaingun"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.shield_gen_small"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.shield_gen_large"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.flak_cannon_large"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.point_defense"}, "Value": 3}, {"Key": {"ComponentID": "FireExtinguishJob", "PartID": "cosmoteer.fire_extinguisher"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_large"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_small"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_med"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_med"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_small"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_large"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small_2way"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small_3way"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_med"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_boost"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_huge"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_large"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.engine_room"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_small"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_med"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_large"}, "Value": 8}, {"Key": {"ComponentID": "ResourceTransferJob.Collect", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "SalvageJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "ConstructPartJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "DeconstructJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "RepairPartJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.power_storage"}, "Value": 3}, {"Key": {"ComponentID": "SulfurConsumer", "PartID": "cosmoteer.factory_ammo"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_ammo"}, "Value": 5}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 5}, {"Key": {"ComponentID": "SulfurConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 5}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 5}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 5}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 5}, {"Key": {"ComponentID": "UraniumConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 5}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 5}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 2}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 2}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_steel"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_steel"}, "Value": 2}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_coil"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_coil"}, "Value": 2}, {"Key": {"ComponentID": "CoilConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 2}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 2}, {"Key": {"ComponentID": "TritaniumConsumer", "PartID": "cosmoteer.factory_tristeel"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_tristeel"}, "Value": 2}, {"Key": {"ComponentID": "CarbonConsumer", "PartID": "cosmoteer.factory_diamond"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_diamond"}, "Value": 2}, {"Key": {"ComponentID": "CoilConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 2}, {"Key": {"ComponentID": "GoldConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 2}, {"Key": {"ComponentID": "UraniumConsumer", "PartID": "cosmoteer.factory_uranium"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_uranium"}, "Value": 2}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.mining_laser_small"}, "Value": 6}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.resource_collector"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.resource_collector"}, "Value": 5}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.tractor_beam_emitter"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.sensor_array"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.sensor_array"}, "Value": 7}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.hyperdrive_beacon"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.laser_blaster_small"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.laser_blaster_large"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.disruptor"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.ion_beam_emitter"}, "Value": 6}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.mining_laser_small"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_med"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_large"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_deck"}, "Value": 6}, {"Key": {"ComponentID": "MissileStorage", "PartID": "cosmoteer.missile_launcher"}, "Value": 6}, {"Key": {"ComponentID": "EMPMissilesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 6}, {"Key": {"ComponentID": "NukeMissilesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 6}, {"Key": {"ComponentID": "MinesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.railgun_loader"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.railgun_accelerator"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.railgun_launcher"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumerLeft", "PartID": "cosmoteer.chaingun"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.chaingun_magazine"}, "Value": 6}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.flak_cannon_large"}, "Value": 6}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.engine_room"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.tractor_beam_emitter"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_beacon"}, "Value": 5}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_med"}, "Value": 5}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_large"}, "Value": 5}, {"Key": {"ComponentID": "flex_grid_uranium", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_gold", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_bullet", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_missile_part_he", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_missile_part_nuke", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_mine_part", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_missile_part_emp", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_steel", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_coil2", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_tristeel", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_coil", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_diamond", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_processor", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_sulfur", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_enriched_uranium", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_iron", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_copper", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_tritanium", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_carbon", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "flex_grid_hyperium", "PartID": "cosmoteer.storage_2x2"}, "Value": 2}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_small"}, "Value": 5}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.thruster_rocket_nozzle"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_battery"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_extender"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_nozzle"}, "Value": 7}]},
    "Operator": {"AssignmentPriority": 5, "AutoFillFromLower": true, "Color": ["0000803F", "0000803F", "0000803F", "0000803F"], "ID": -2147483647, "Name": "Operator", "Priorities": [{"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.laser_blaster_small"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.laser_blaster_large"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.disruptor"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.ion_beam_emitter"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_med"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_large"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_deck"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.missile_launcher"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.railgun_loader"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.shield_gen_small"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.shield_gen_large"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.flak_cannon_large"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.point_defense"}, "Value": 0}, {"Key": {"ComponentID": "FireExtinguishJob", "PartID": "cosmoteer.fire_extinguisher"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.power_storage"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_small"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_med"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_large"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_small"}, "Value": 0}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_small"}, "Value": 0}, {"Key": {"ComponentID": "ToggledBatteryConsumer", "PartID": "cosmoteer.thruster_small"}, "Value": 0}, {"Key": {"ComponentID": "ToggledBatteryConsumer", "PartID": "cosmoteer.thruster_small_2way"}, "Value": 0}, {"Key": {"ComponentID": "ToggledBatteryConsumer", "PartID": "cosmoteer.thruster_small_3way"}, "Value": 0}, {"Key": {"ComponentID": "ToggledBatteryConsumer", "PartID": "cosmoteer.thruster_med"}, "Value": 0}, {"Key": {"ComponentID": "ToggledBatteryConsumer", "PartID": "cosmoteer.thruster_large"}, "Value": 0}, {"Key": {"ComponentID": "ToggledBatteryConsumer", "PartID": "cosmoteer.thruster_huge"}, "Value": 0}, {"Key": {"ComponentID": "BoostOffComponents", "PartID": "cosmoteer.thruster_boost"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.engine_room"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.engine_room"}, "Value": 0}, {"Key": {"ComponentID": "ResourceTransferJob.Collect", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 0}, {"Key": {"ComponentID": "ResourceTransferJob.Eject", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 0}, {"Key": {"ComponentID": "SalvageJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 0}, {"Key": {"ComponentID": "SulfurConsumer", "PartID": "cosmoteer.factory_ammo"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_ammo"}, "Value": 0}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 0}, {"Key": {"ComponentID": "SulfurConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 0}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 0}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 0}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 0}, {"Key": {"ComponentID": "UraniumConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 0}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 0}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_steel"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_steel"}, "Value": 0}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_coil"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_coil"}, "Value": 0}, {"Key": {"ComponentID": "CoilConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 0}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 0}, {"Key": {"ComponentID": "TritaniumConsumer", "PartID": "cosmoteer.factory_tristeel"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_tristeel"}, "Value": 0}, {"Key": {"ComponentID": "CarbonConsumer", "PartID": "cosmoteer.factory_diamond"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_diamond"}, "Value": 0}, {"Key": {"ComponentID": "CoilConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 0}, {"Key": {"ComponentID": "GoldConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 0}, {"Key": {"ComponentID": "UraniumConsumer", "PartID": "cosmoteer.factory_uranium"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_uranium"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_hyperium", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_carbon", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_copper", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_iron", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_sulfur", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_enriched_uranium", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_processor", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_diamond", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_gold", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_tristeel", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_coil", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_steel", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_mine_part", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_missile_part_nuke", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_missile_part_emp", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_missile_part_he", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_bullet", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_coil2", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_uranium", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.mining_laser_small"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.mining_laser_small"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.tractor_beam_emitter"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.tractor_beam_emitter"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.sensor_array"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.sensor_array"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.laser_blaster_small"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.laser_blaster_large"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.disruptor"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.ion_beam_emitter"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_med"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_large"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.cannon_deck"}, "Value": 0}, {"Key": {"ComponentID": "MinesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.railgun_loader"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.railgun_accelerator"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.railgun_launcher"}, "Value": 0}, {"Key": {"ComponentID": "NukeMissilesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 0}, {"Key": {"ComponentID": "EMPMissilesComponents", "PartID": "cosmoteer.missile_launcher"}, "Value": 0}, {"Key": {"ComponentID": "MissileStorage", "PartID": "cosmoteer.missile_launcher"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.flak_cannon_large"}, "Value": 0}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.hyperdrive_beacon"}, "Value": 9}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.chaingun"}, "Value": 9}, {"Key": {"ComponentID": "StorageUIProxies", "PartID": "cosmoteer.chaingun"}, "Value": 0}, {"Key": {"ComponentID": "StorageUIProxies", "PartID": "cosmoteer.chaingun_magazine"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small_2way"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small_3way"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_med"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_large"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_huge"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_boost"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_med"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_large"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.resource_collector"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_beacon"}, "Value": 0}, {"Key": {"ComponentID": "flex_grid_tritanium", "PartID": "cosmoteer.storage_2x2"}, "Value": 0}, {"Key": {"ComponentID": "RepairPartJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 0}, {"Key": {"ComponentID": "DeconstructJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 0}, {"Key": {"ComponentID": "ConstructPartJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 0}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_med"}, "Value": 0}, {"Key": {"ComponentID": "HyperiumConsumer", "PartID": "cosmoteer.hyperdrive_large"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumerLeft", "PartID": "cosmoteer.chaingun"}, "Value": 0}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.chaingun_magazine"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_nozzle"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_extender"}, "Value": 0}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_battery"}, "Value": 0}]},
    "Redshirt": {"AssignmentPriority": 5, "AutoFillFromLower": true, "Color": ["0000803F", "00000000", "00000000", "0000803F"], "ID": -2147483646, "Name": "Redshirt", "Priorities": [{"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.laser_blaster_small"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.laser_blaster_large"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.disruptor"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.ion_beam_emitter"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_med"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small"}, "Value": 4}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_large"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.cannon_deck"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.missile_launcher"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.railgun_loader"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.chaingun"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.shield_gen_small"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.shield_gen_large"}, "Value": 7}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.flak_cannon_large"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.point_defense"}, "Value": 2}, {"Key": {"ComponentID": "FireExtinguishJob", "PartID": "cosmoteer.fire_extinguisher"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_large"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_small"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_med"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_med"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.control_room_small"}, "Value": 9}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.control_room_large"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small_2way"}, "Value": 4}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_small_3way"}, "Value": 4}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_med"}, "Value": 4}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_boost"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_huge"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_large"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.engine_room"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_small"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_med"}, "Value": 7}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.hyperdrive_large"}, "Value": 7}, {"Key": {"ComponentID": "ResourceTransferJob.Collect", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "SalvageJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "ConstructPartJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "DeconstructJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "RepairPartJob", "PartID": "cosmoteer.crew_quarters_med"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.power_storage"}, "Value": 2}, {"Key": {"ComponentID": "SulfurConsumer", "PartID": "cosmoteer.factory_ammo"}, "Value": 4}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_ammo"}, "Value": 4}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 4}, {"Key": {"ComponentID": "SulfurConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 4}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_he"}, "Value": 4}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 4}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 4}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_emp"}, "Value": 4}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 4}, {"Key": {"ComponentID": "UraniumConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 4}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_nuke"}, "Value": 4}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 1}, {"Key": {"ComponentID": "AmmoConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_mine"}, "Value": 1}, {"Key": {"ComponentID": "IronConsumer", "PartID": "cosmoteer.factory_steel"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_steel"}, "Value": 1}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_coil"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_coil"}, "Value": 1}, {"Key": {"ComponentID": "CoilConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 1}, {"Key": {"ComponentID": "CopperConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_coil2"}, "Value": 1}, {"Key": {"ComponentID": "TritaniumConsumer", "PartID": "cosmoteer.factory_tristeel"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_tristeel"}, "Value": 1}, {"Key": {"ComponentID": "CarbonConsumer", "PartID": "cosmoteer.factory_diamond"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_diamond"}, "Value": 1}, {"Key": {"ComponentID": "CoilConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 1}, {"Key": {"ComponentID": "GoldConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_processor"}, "Value": 1}, {"Key": {"ComponentID": "UraniumConsumer", "PartID": "cosmoteer.factory_uranium"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.factory_uranium"}, "Value": 1}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.mining_laser_small"}, "Value": 5}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.resource_collector"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.resource_collector"}, "Value": 4}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.tractor_beam_emitter"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.sensor_array"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.sensor_array"}, "Value": 6}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.hyperdrive_beacon"}, "Value": 8}, {"Key": {"ComponentID": "PartCrew", "PartID": "cosmoteer.thruster_rocket_nozzle"}, "Value": 8}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_nozzle"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_extender"}, "Value": 6}, {"Key": {"ComponentID": "BatteryConsumer", "PartID": "cosmoteer.thruster_rocket_battery"}, "Value": 5}]}
}   
