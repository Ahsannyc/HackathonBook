---
id: 0002
title: Finalize Constitution for Robotics Textbook
stage: constitution
date: 2025-12-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-simple-calculator
user: user
command: /sp.constitution
labels: ["constitution", "project-setup", "finalization"]
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

(Final Version — All Features Required)

Title: Constitution for a Technical Textbook & Governance Charter on Physical AI and Humanoid Robotics

Core Principles

Use verified information from primary sources, peer-reviewed research, and official robotics platforms (ROS 2, Gazebo, NVIDIA Isaac, OpenAI tools).

Ensure clarity for students and general readers with introductory AI/engineering knowledge.

Guarantee full reproducibility for all code, simulations, RAG workflows, and technical setups.

Present balanced context on technological progress, global contributors, and economic impact in a respectful, culturally neutral manner.

Include ethical themes shared across global traditions: human dignity, responsibility, fairness, and harmony with nature.

Key Standards

All claims must be backed by verifiable sources (research, official docs, recognized institutions).

Use APA for academic citations and Markdown links/URLs for technical documentation.

Maintain a source mix of 50% peer-reviewed research and 50% official documentation or open-source repositories.

Ensure clear writing at a grade level 8–12.

All authentication, personalization, and translation features must follow secure and privacy-respecting practices.

RAG system must deliver grounded answers based strictly on retrieved book content.

Governance content must treat all cultures and beliefs respectfully, avoiding preference or comparison.

Constraints

Total book length: 10,000–20,000 words (technical core: 5,000–7,000).

Format: Markdown (Docusaurus ready) with Python/ROS code blocks; final export as PDF with APA citations.

Required deliverables:

Full Docusaurus-based textbook deployed to GitHub Pages.

Integrated RAG chatbot built with:

OpenAI Agents / ChatKit

FastAPI

Neon Serverless Postgres

Qdrant Cloud Free Tier

Chatbot must answer questions only from book content, including user-selected text.

Required system features:

Signup / Signin using Better-Auth

User background questionnaire (software + hardware experience)

Content personalization button at the start of every chapter

Urdu translation button at the start of every chapter

Required AI automation features:

Use of Claude Code Subagents

Use of Claude Agent Skills

Governance charter must be bullet-pointed and cover:

Workforce impact (e.g., automation of repetitive or risky tasks)

Applications in healthcare, education, infrastructure, science, disaster response

Innovation vs precaution, rights, safety, equity, and oversight

Success Criteria

All claims are source-verified and pass fact-checking.

All required features (auth, RAG, personalization, translation, subagents, skills) function reliably.

Zero plagiarism across the entire project.

All technical components (code, simulations, RAG, APIs) are fully reproducible.

The book deploys cleanly to GitHub Pages via Spec-Kit-Plus and Cloud Code.

Governance content remains culturally respectful, neutral, and inclusive.

## Response snapshot

Updated and finalized the project constitution with comprehensive details on core principles, key standards, constraints, and success criteria, reflecting all features required by the user.

## Outcome

- ✅ Impact: Project constitution has been fully updated and finalized, serving as a comprehensive foundational document for the Physical AI & Humanoid Robotics Textbook project.
- 🧪 Tests: None
- 📁 Files: .specify/memory/constitution.md modified.
- 🔁 Next prompts: Proceed with project specification or planning based on the finalized constitution.
- 🧠 Reflection: The detailed user input allowed for a thorough and complete update of the constitution, covering all critical aspects of the project, including advanced features like RAG chatbots and AI automation.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
