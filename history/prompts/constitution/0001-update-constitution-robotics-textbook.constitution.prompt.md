---
id: 0001
title: Update Constitution for Robotics Textbook
stage: constitution
date: 2025-12-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-simple-calculator
user: user
command: /sp.constitution
labels: ["constitution", "project-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - None
---

## Prompt

Create a Textbook for Teaching Physical AI & Humanoid Robotics Course
Core Principles
Use verified information from primary sources, peer-reviewed work, and official robotics tools (ROS 2, Gazebo, Isaac).

Write clearly for students and general readers with introductory AI knowledge.

Ensure full reproducibility of all code, simulations, and technical setups.

Provide balanced context on technological progress, global contributions, and economic impacts.

When addressing ethics, include perspectives from major world traditions in a respectful, neutral, and non-comparative way, focusing on shared themes such as human dignity, responsibility, and harmony with nature.

Key Standards
Every claim must be supported by a verifiable source (research, official docs, reputable institutions).

Use APA style for academic citations and Markdown links/URLs for technical documentation.

Source mix: 50% peer-reviewed research + 50% official docs or open-source repositories.

Zero plagiarism; write with clarity at grade level 8–12.

Governance charter must include balanced consideration of:

Different socioeconomic groups’ needs (e.g., managing disruption, ensuring opportunity and security).

Principles of rights, safety, fairness, and responsible oversight.

Constraints
Total length: 10,000–20,000 words (technical core: 5,000–7,000).

Governance charter must be bullet-pointed and address:

Workforce changes (e.g., automation of repetitive, risky, or high-cost tasks).

Applications in healthcare, education, infrastructure, science, and disaster response.

The balance between innovation and precaution.

Each module: 10+ sources; full project: 15+ academic sources.

Format: Markdown (Docusaurus-compatible) with code blocks (Python, ROS 2).

Final export: PDF with embedded APA citations.

All simulations, launch files, and examples must run without errors.

Success Criteria
All claims pass fact-checking and source verification.

Governance content remains respectful, inclusive, and culturally neutral.

Zero plagiarism.

All technical examples are fully reproducible.

Project deploys smoothly to GitHub Pages using Spec-Kit-Plus and Cloud Code.

## Response snapshot

Updated project constitution with core principles, key standards, constraints, success criteria, and governance rules based on user input.

## Outcome

- ✅ Impact: Project constitution updated to reflect the new project requirements for the Physical AI & Humanoid Robotics Textbook.
- 🧪 Tests: None
- 📁 Files: .specify/memory/constitution.md modified.
- 🔁 Next prompts: Continue with project setup or feature specification.
- 🧠 Reflection: The constitution now provides a clear foundational document for the project.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
