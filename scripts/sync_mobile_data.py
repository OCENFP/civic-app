#!/usr/bin/env python3
"""Copy the web app's scenario data into the Expo app.

The mobile Train tab bundles its own copy because Expo's bundler cannot
reach outside frontend/mobile. Run this after editing scenarios;
scripts/validate_data.py fails CI when the two drift apart.
"""

import shutil

SOURCE = "src/data/scenarios.json"
DEST = "frontend/mobile/constants/scenarios.json"

shutil.copyfile(SOURCE, DEST)
print(f"Copied {SOURCE} -> {DEST}")
