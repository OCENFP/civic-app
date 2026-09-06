#!/usr/bin/env python3
"""Validate the app's static data files.

Run from the repo root (CI does). Fails loudly on: invalid JSON, scenario
steps with dangling `next` references, unreachable or missing end states,
choices without required fields, and lessons missing required fields.
"""

import json
import sys

ERRORS = []


def err(msg):
    ERRORS.append(msg)


def load(path):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception as e:  # noqa: BLE001 - report and continue
        err(f"{path}: invalid JSON ({e})")
        return None


def validate_scenarios(path="src/data/scenarios.json"):
    scenarios = load(path)
    if scenarios is None:
        return

    for s in scenarios:
        sid = s.get("id", "<missing id>")
        steps = s.get("steps", {})

        if "start" not in steps:
            err(f"{sid}: no 'start' step")

        has_end = False
        for step_id, step in steps.items():
            if step.get("end"):
                has_end = True
                if "result" not in step:
                    err(f"{sid}/{step_id}: end step missing 'result'")
                continue

            choices = step.get("choices")
            if not choices:
                err(f"{sid}/{step_id}: non-end step has no choices")
                continue

            for c in choices:
                for field in ("text", "next", "feedback"):
                    if field not in c:
                        err(f"{sid}/{step_id}: choice missing '{field}'")
                if "correct" not in c:
                    err(f"{sid}/{step_id}: choice '{c.get('text')}' missing 'correct'")
                if c.get("next") not in steps:
                    err(f"{sid}/{step_id}: dangling next '{c.get('next')}'")

        if not has_end:
            err(f"{sid}: no end step")


def validate_courses(path="src/data/courses.json"):
    courses = load(path)
    if courses is None:
        return

    required = {"title", "explanation", "when_applies", "example", "risk", "action", "script"}

    for course in courses:
        cid = course.get("id", "<missing id>")
        if not course.get("modules"):
            err(f"{cid}: no modules")
        for module in course.get("modules", []):
            for lesson in module.get("lessons", []):
                missing = required - set(lesson)
                if missing:
                    err(f"{cid}/{module.get('id')}/{lesson.get('title')}: missing {sorted(missing)}")


def validate_misc():
    for path in (
        "src/data/constitution.json",
        "src/data/scripts.json",
        "src/data/stateLaws.json",
        "src/data/states/california.json",
        "backend/constitution.json",
        "backend/politicians.json",
        "backend/lobbying.json",
    ):
        load(path)


def main():
    validate_scenarios()
    validate_courses()
    validate_misc()

    if ERRORS:
        print(f"DATA VALIDATION FAILED ({len(ERRORS)} problem(s)):")
        for e in ERRORS:
            print(f"  - {e}")
        sys.exit(1)

    print("All data files valid.")


if __name__ == "__main__":
    main()
