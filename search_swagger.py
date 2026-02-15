
import json
import os

try:
    with open('c:/Users/user/Desktop/imedteam/imedteamuz/swagger.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    paths = data.get('paths', {})
    definitions = data.get('definitions', {})

    print("--- Matching Paths ---")
    for path in paths:
        if any(x in path.lower() for x in ['promo', 'coupon', 'discount', 'code', 'order']):
            print(f"Path: {path}")
            for method in paths[path]:
                print(f"  Method: {method}")
                # print(json.dumps(paths[path][method], indent=2))

    print("\n--- Matching Definitions ---")
    for def_name in definitions:
        if any(x in def_name.lower() for x in ['promo', 'coupon', 'discount', 'code', 'order']):
            print(f"Definition: {def_name}")
            # print(json.dumps(definitions[def_name], indent=2))

except Exception as e:
    print(f"Error: {e}")
