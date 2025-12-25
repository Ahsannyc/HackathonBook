---
id: 7
title: stabilize-builds-plan
stage: plan
date: 2025-12-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-stabilize-builds
branch: 001-stabilize-builds
user: 14loa
command: sp.plan
labels: ["github-pages", "railway", "deployment", "build", "configuration", "plan"]
links:
  spec: specs/001-stabilize-builds/spec.md
  plan: specs/001-stabilize-builds/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-stabilize-builds/plan.md
 - specs/001-stabilize-builds/research.md
 - specs/001-stabilize-builds/data-model.md
 - specs/001-stabilize-builds/quickstart.md
 - specs/001-stabilize-builds/contracts
tests:
 - none
---

## Prompt

/sp.plan

Objective:
Stabilize deployment across GitHub Pages and Railway by resolving build configuration and runtime detection issues.

Scope:
- GitHub Pages (Docusaurus)
- Railway deployment (backend / RAG / API)
- Build configuration only (NO feature work)

Constraints:
- Do NOT modify application logic
- Do NOT refactor RAG, auth, or frontend behavior
- Do NOT introduce new tools or services
- Do NOT break local development

Plan Requirements:

1. GitHub Pages Analysis
   - Identify the exact Docusaurus config file in use
   - Confirm where `onBrokenLinks` is defined
   - Verify no conflicting or duplicated config exists
   - Ensure config supports both local dev and GitHub Pages

2. Railway Build Detection Analysis
   - Determine which runtime Railway should use (Node vs Python vs Docker)
   - Identify all build-related files at repo root:
     - Dockerfile
     - package.json
     - requirements.txt / pyproject.toml
   - Identify why Railpack cannot generate a build plan
   - Determine whether the issue is:
     - ambiguous runtime
     - missing entrypoint
     - incorrect root directory
     - invalid Dockerfile

3. Risk Assessment
   - List what MUST NOT be changed
   - Identify minimal configuration changes required
   - Ensure fixes do not conflict with GitHub Pages

Deliverables:
- Clear explanation of root causes (GitHub Pages + Railway separately)
- Step-by-step plan to fix each issue
- List of files that will be modified (should be minimal)
- No code changes yet

## Response snapshot

Created comprehensive implementation plan for stabilizing GitHub Pages and Railway builds. The analysis confirmed that GitHub Pages configuration already has onBrokenLinks: 'warn' set correctly in book/docusaurus.config.ts. The Railway build issue stems from conflicting configurations where Dockerfile runs Node.js backend but railway.toml starts Python backend, causing Railway's NIXPACKS builder to be confused about which runtime to use. The plan includes research findings, data models, quickstart guide, and recommended approach to resolve the build detection ambiguity.

## Outcome

- ✅ Impact: Identified root causes for both GitHub Pages and Railway build issues, with clear path forward for implementation
- 🧪 Tests: none
- 📁 Files: specs/001-stabilize-builds/plan.md, specs/001-stabilize-builds/research.md, specs/001-stabilize-builds/data-model.md, specs/001-stabilize-builds/quickstart.md, specs/001-stabilize-builds/contracts/
- 🔁 Next prompts: /sp.tasks to generate implementation tasks
- 🧠 Reflection: Build configuration conflicts require careful analysis to ensure fixes don't break existing functionality across multiple deployment platforms

## Evaluation notes (flywheel)

- Failure modes observed: Railway build plan detection failing due to ambiguous configuration; GitHub Pages config already correct
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Generate implementation tasks to address the identified configuration issues