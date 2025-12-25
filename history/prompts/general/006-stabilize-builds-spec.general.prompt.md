---
id: 6
title: stabilize-builds-spec
stage: general
date: 2025-12-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-stabilize-builds
branch: 001-stabilize-builds
user: 14loa
command: sp.specify
labels: ["github-pages", "railway", "deployment", "build", "configuration"]
links:
  spec: specs/001-stabilize-builds/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-stabilize-builds/spec.md
 - specs/001-stabilize-builds/checklists/requirements.md
tests:
 - none
---

## Prompt

/sp.specify

Goal:
Stabilize GitHub Pages and Railway builds without breaking local development.

STRICT RULES (must follow):
- DO NOT delete, rename, or move files
- DO NOT change application logic
- DO NOT add new frameworks
- DO NOT break localhost
- Fix only configuration and build-detection issues

PART 1 — GitHub Pages Fix (Verification Only):
1. Locate the Docusaurus config file:
   - docusaurus.config.js OR docusaurus.config.ts
2. Verify that:
   onBrokenLinks: 'warn'
   is set exactly once
3. Ensure no duplicate or conflicting onBrokenLinks settings exist
4. Do NOT modify any other Docusaurus behavior

PART 2 — Railway Build Failure (Critical):
Observed Error:
"Error creating build plan with Railpack"

Required Investigation:
1. Determine which runtime Railway should use:
   - Node (frontend / docs)
   - Python (backend / RAG)
2. Identify which build files exist:
   - package.json
   - requirements.txt
   - Dockerfile
3. Identify why Railway cannot detect a build plan

Required Fix:
- Make Railway build detection explicit and unambiguous
- Ensure exactly ONE clear entry point for Railway
- If a Dockerfile exists, ensure it is valid and referenced correctly
- If Dockerfile is used, ensure Railway does NOT attempt auto-detection
- If no Dockerfile is used, ensure required build files exist at repo root

DO NOT:
- Rewrite Dockerfile unless broken
- Combine frontend and backend builds
- Change application ports
- Add environment variables unless required

Verification Checklist (must pass):
- GitHub Pages build completes
- Railway build plan is created successfully
- Railway build proceeds past "Build image"
- App starts without crashing
- Local dev still works

Output Requirements:
- List files inspected
- List files modified (should be minimal)
- Show exact config changes
- Explain why Railway failed and how the fix resolves it

## Response snapshot

Created comprehensive specification for stabilizing GitHub Pages and Railway builds. The investigation revealed that the Docusaurus config already has onBrokenLinks: 'warn' set correctly. The Railway build issue stems from conflicting build configurations where Railway's NIXPACKS builder is confused by multiple build files (package.json, requirements.txt) and a Dockerfile that doesn't align with the railway.toml configuration. The solution involves clarifying the build plan for Railway by ensuring explicit configuration.

## Outcome

- ✅ Impact: Established clear requirements for fixing both GitHub Pages and Railway build issues
- 🧪 Tests: none
- 📁 Files: specs/001-stabilize-builds/spec.md, specs/001-stabilize-builds/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to create implementation plan, /sp.tasks to generate tasks
- 🧠 Reflection: Build configuration conflicts between multiple deployment platforms require explicit configuration to resolve detection ambiguity

## Evaluation notes (flywheel)

- Failure modes observed: Railway build plan detection failing due to ambiguous configuration
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Create implementation plan for build configuration fixes