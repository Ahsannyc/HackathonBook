<!--
Sync Impact Report:
Version change: 0.1.0 → 0.2.0
List of modified principles:
  - Verified Information: Updated to include NVIDIA Isaac, OpenAI tools.
  - Clarity and Accessibility: Updated to include AI/engineering knowledge.
  - Reproducibility: Updated to include RAG workflows.
  - Balanced Context: Updated to specify respectful, culturally neutral manner.
  - Ethical Perspectives: Updated to specify shared global traditions and themes.
Added sections:
  - New Key Standards (authentication, RAG, governance content).
  - New Constraints (deliverables, system features, AI automation features).
  - New Success Criteria (all features functioning, plagiarism-free, deployment).
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ updated
  - .specify/templates/spec-template.md: ✅ updated
  - .specify/templates/tasks-template.md: ✅ updated
  - .specify/templates/commands/*.md: ✅ updated
  - README.md: ✅ updated
  - docs/quickstart.md: ✅ updated
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Original adoption date unknown.
-->
# Constitution for a Technical Textbook & Governance Charter on Physical AI and Humanoid Robotics

## Core Principles

### Verified Information
Use verified information from primary sources, peer-reviewed research, and official robotics platforms (ROS 2, Gazebo, NVIDIA Isaac, OpenAI tools).

### Clarity and Accessibility
Ensure clarity for students and general readers with introductory AI/engineering knowledge.

### Reproducibility
Guarantee full reproducibility for all code, simulations, RAG workflows, and technical setups.

### Balanced Context
Present balanced context on technological progress, global contributors, and economic impact in a respectful, culturally neutral manner.

### Ethical Perspectives
Include ethical themes shared across global traditions: human dignity, responsibility, fairness, and harmony with nature.

## Key Standards

### Verifiable Claims
All claims must be backed by verifiable sources (research, official docs, recognized institutions).

### Citation Style
Use APA for academic citations and Markdown links/URLs for technical documentation.

### Source Mix
Maintain a source mix of 50% peer-reviewed research and 50% official documentation or open-source repositories.

### Originality and Clarity
Ensure clear writing at a grade level 8–12.

### Secure and Private Features
All authentication, personalization, and translation features must follow secure and privacy-respecting practices.

### Grounded RAG System
RAG system must deliver grounded answers based strictly on retrieved book content.

### Respectful Governance Content
Governance content must treat all cultures and beliefs respectfully, avoiding preference or comparison.

## Constraints

### Total Book Length
Total book length: 10,000–20,000 words (technical core: 5,000–7,000).

### Format and Export
Format: Markdown (Docusaurus ready) with Python/ROS code blocks; final export as PDF with APA citations.

### Required Deliverables
*   Full Docusaurus-based textbook deployed to GitHub Pages.
*   Integrated RAG chatbot built with: OpenAI Agents / ChatKit, FastAPI, Neon Serverless Postgres, Qdrant Cloud Free Tier. Chatbot must answer questions only from book content, including user-selected text.

### Required System Features
*   Signup / Signin using Better-Auth
*   User background questionnaire (software + hardware experience)
*   Content personalization button at the start of every chapter
*   Urdu translation button at the start of every chapter

### Required AI Automation Features
*   Use of Claude Code Subagents
*   Use of Claude Agent Skills

### Governance Charter Coverage
Governance charter must be bullet-pointed and cover:
*   Workforce impact (e.g., automation of repetitive or risky tasks)
*   Applications in healthcare, education, infrastructure, science, disaster response
*   Innovation vs precaution, rights, safety, equity, and oversight

## Success Criteria

### Source Verification
All claims are source-verified and pass fact-checking.

### Feature Reliability
All required features (auth, RAG, personalization, translation, subagents, skills) function reliably.

### Plagiarism-Free Content
Zero plagiarism across the entire project.

### Technical Reproducibility
All technical components (code, simulations, RAG, APIs) are fully reproducible.

### Clean Deployment
The book deploys cleanly to GitHub Pages via Spec-Kit-Plus and Cloud Code.

### Inclusive Governance
Governance content remains culturally respectful, neutral, and inclusive.

## Governance

Amendment Procedure: All amendments to this constitution require a formal proposal, review by at least two project leads, and majority approval from the core development team. Significant changes must be communicated to all stakeholders.
Versioning Policy: The constitution follows semantic versioning (MAJOR.MINOR.PATCH). MAJOR increments for backward-incompatible changes, MINOR for new sections or expanded guidance, and PATCH for clarifications or typo fixes.
Compliance Review: This constitution will be reviewed annually or upon major project milestones to ensure continued relevance and compliance with project goals and external regulations.

**Version**: 0.2.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date unknown. | **Last Amended**: 2025-12-04
