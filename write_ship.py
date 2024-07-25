''' tool to write json data to a png file '''

import json

from PIL import Image

from cosmoteer_save_tools import Ship

# load generated json
GEN_JSON = "out.json"
with open(GEN_JSON, "r", encoding="utf-8") as f:
    json_data = json.load(f)


# Convert lists to tuples in the JSON data
# thing to tuple
tuple_data = ["RoofBaseColor", "RoofDecalColor1", "RoofDecalColor2", "RoofDecalColor3"]
for key, value in json_data.items():
    if key in tuple_data:
        if isinstance(value, list):
            json_data[key] = tuple(value)
if "Roles" in json_data:
    for role in json_data["Roles"]:
        if "Color" in role and isinstance(role["Color"], list):
            role["Color"] = tuple(role["Color"])
if "WeaponShipRelativeTargets" in json_data:
    for WeaponShipRelativeTargets in json_data["WeaponShipRelativeTargets"]:
        if "Value" in WeaponShipRelativeTargets and isinstance(
            WeaponShipRelativeTargets["Value"], list
        ):
            WeaponShipRelativeTargets["Value"] = tuple(WeaponShipRelativeTargets["Value"])

# Now, json_data contains tuples instead of lists
# print(json_data)

ORG_IMG = "ionv2.ship.png"  # Replace with the path to your image
my_ship1 = Ship(ORG_IMG)  # read image
my_ship1.data = json_data  # replace the data
new_image = my_ship1.write(Image.open("test99.png"))  # write image
new_image.save("outtest.ship.png")  # save image
my_ship2 = Ship("outtest.ship.png")  # read image


print(my_ship1.data == my_ship2.data)
# print all of the differences
for key in my_ship1.data.keys():
    if my_ship1.data[key] != my_ship2.data[key]:
        print("ship 1")
        print(key)
        print(my_ship1.data[key])
        print("===================================")
        print("ship 2")
        print(my_ship2.data[key])
        print()

for key in my_ship1.data.keys():
    if my_ship1.data[key] != json_data[key]:
        print("ship 1")
        print(key)
        print(my_ship1.data[key])
        print("===================================")
        print("json data")
        print(json_data[key])
        print()
