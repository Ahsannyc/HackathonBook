<!--
Sync Impact Report:
Version change: N/A
List of modified principles: N/A
Added sections: N/A
Removed sections: N/A
Templates requiring updates: N/A
Follow-up TODOs: None
-->
# Implementation Plan: Textbook for Teaching Physical AI & Humanoid Robotics Course

**Branch**: `001-robotics-textbook` | **Date**: 2025-12-04 | **Spec**: specs/001-robotics-textbook/spec.md
**Input**: Feature specification from `/specs/001-robotics-textbook/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This project aims to create a comprehensive technical textbook and governance charter on Physical AI and Humanoid Robotics. The primary technical approach involves a unified project architecture with a Docusaurus-based book and an integrated FastAPI backend for a RAG chatbot. The content will be structured into 4 modules, each covering specific robotics and AI topics, with a strong emphasis on practical, reproducible examples and evidence-based applications.

## Technical Context

**Language/Version**: Python 3.10+ (for FastAPI, RAG, ROS 2 clients), JavaScript/TypeScript (for Docusaurus)
**Primary Dependencies**: Docusaurus, FastAPI, OpenAI Agents/ChatKit, Neon Serverless Postgres, Qdrant Cloud Free Tier, Better-Auth, ROS 2, Gazebo, NVIDIA Isaac Sim (via Isaac ROS), VLA libraries (Whisper, LLM integration)
**Storage**: Neon Serverless Postgres (for RAG data, user profiles), Qdrant Cloud Free Tier (for vector embeddings)
**Testing**: `pytest` (for FastAPI backend), Docusaurus build validations, manual verification of robotics code/simulations, end-to-end testing of integrated features.
**Target Platform**: Web (Docusaurus deployment to GitHub Pages), Linux (Ubuntu 22.04 LTS for ROS 2, Gazebo, NVIDIA Isaac Sim environments)
**Project Type**: Hybrid (documentation site + backend API)
**Performance Goals**: RAG chatbot responses within 2-3 seconds, Docusaurus site load times under 3 seconds (p95), efficient content personalization and translation.
**Constraints**: Total word count 10,000-20,000 words (technical core 5,000-7,000), 8+ peer-reviewed academic sources (2014-2024), 5+ reproducible code/sim setups per module (20+ total), module-by-module drafting within 1 month.
**Scale/Scope**: 4 core modules, introductory/early-career university audience, 3+ concrete AI applications with evidence, integrated RAG chatbot, authentication, personalization, and translation features.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Verified Information**: All content MUST use verified information from primary sources, peer-reviewed research, and official robotics platforms (ROS 2, Gazebo, NVIDIA Isaac, OpenAI tools). (FR-001, FR-006, FR-008, FR-018, SC-001)
- **Clarity and Accessibility**: The textbook MUST maintain clarity for students and general readers with introductory AI/engineering knowledge. (FR-002, FR-009)
- **Reproducibility**: All code, simulations, RAG workflows, and technical setups MUST be fully reproducible. (FR-003, FR-016, SC-004, SC-008)
- **Balanced Context**: The textbook MUST present balanced context on technological progress, global contributors, and economic impact in a respectful, culturally neutral manner. (FR-004)
- **Ethical Perspectives**: The textbook MUST include ethical themes shared across global traditions: human dignity, responsibility, fairness, and harmony with nature. (FR-005)
- **Secure and Private Features**: All authentication, personalization, and translation features MUST follow secure and privacy-respecting practices. (FR-025, FR-026, FR-027, FR-028)
- **Grounded RAG System**: RAG system MUST deliver grounded answers based strictly on retrieved book content. (FR-023, FR-024)
- **Respectful Governance Content**: Governance content MUST treat all cultures and beliefs respectfully, avoiding preference or comparison. (FR-030, SC-006)

## Project Structure

### Documentation (this feature)

```text
specs/001-robotics-textbook/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
./
├── docs/                              # Docusaurus content
│   ├── intro/
│   │   ├── 00-welcome.md
│   │   ├── 01-why-physical-ai.md      # Must include 3+ AI applications with evidence
│   │   ├── 02-learning-outcomes.md
│   │   └── 03-course-overview.md
│   ├── module-1-robotic-nervous-system/ # ROS 2
│   │   ├── 00-module-overview.md
│   │   ├── 01-ros2-fundamentals.md     # 5+ reproducible examples
│   │   ├── 02-rclpy-bridge.md
│   │   ├── 03-urdf-humanoid.md
│   │   └── 99-lab-ros2-package.md      # Verified implementation
│   ├── module-2-digital-twin/         # Gazebo & Unity
│   │   ├── 00-module-overview.md
│   │   ├── 01-gazebo-simulation.md   # 5+ reproducible examples
│   │   ├── 02-unity-integration.md
│   │   ├── 03-sensor-simulation.md
│   │   └── 99-lab-digital-twin.md
│   ├── module-3-ai-robot-brain/       # NVIDIA Isaac
│   │   ├── 00-module-overview.md
│   │   ├── 01-isaac-sim-setup.md     # 5+ reproducible examples
│   │   ├── 02-isaac-ros.md
│   │   ├── 03-vslam-nav2.md
│   │   └── 99-lab-perception-pipeline.md
│   ├── module-4-vision-language-action/ # VLA
│   │   ├── 00-module-overview.md
│   │   ├── 01-whisper-voice-commands.md # 5+ reproducible examples
│   │   ├── 02-llm-task-planning.md
│   │   ├── 03-capstone-project.md
│   │   └── 99-lab-autonomous-humanoid.md # Basic simulation setup
│   ├── hardware-requirements/
│   │   ├── 00-workstation-specs.md
│   │   ├── 01-edge-kit-setup.md
│   │   └── 02-robot-lab-options.md
│   └── appendices/
│       ├── 00-glossary.md
│       ├── 01-resources.md          # APA citations for 8+ peer-reviewed sources
│       └── 02-roi-case-studies.md    # Reader can explain classroom AI ROI
├── src/                               # Docusaurus custom components, plugins, etc.
├── static/                            # Docusaurus static assets
├── blog/                              # Docusaurus blog (if used)
├── docusaurus.config.js
├── package.json
├── backend/                           # FastAPI RAG chatbot backend
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── services/
│   │   └── models/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── auth/
│   ├── better_auth_setup.py         # Better-Auth integration
│   └── models.py
├── scripts/                           # General utility scripts (e.g., content generation, deployment)
├── .github/workflows/                 # GitHub Actions for CI/CD, deployment
├── .env.example                       # Environment variables
└── README.md
```

**Structure Decision**: The project will follow a hybrid structure with the Docusaurus site at the root (`docs/`, `src/`, `static/`, etc.) and a dedicated `backend/` directory for the FastAPI RAG chatbot. An `auth/` directory will house Better-Auth integration. This setup allows for modular development and clear separation of concerns between the documentation frontend and the AI backend services.

## Development Phases (as provided by user)

### Phase 1 (Week 1-2): Research & Foundation
- Collect 8+ peer-reviewed sources (2014-2024)
- Set up Docusaurus with authentication (Better Auth)
- Implement basic RAG chatbot with FastAPI + Neon + Qdrant

### Phase 2 (Week 3): Core Content - Modules 1 & 2
- Write Module 1 (ROS 2) with 5+ reproducible examples
- Write Module 2 (Simulation) with 5+ reproducible examples
- Integrate personalization and Urdu translation features

### Phase 3 (Week 4): Advanced Content - Modules 3 & 4
- Write Module 3 (NVIDIA Isaac) with 5+ reproducible examples
- Write Module 4 (VLA) with 5+ reproducible examples
- Complete capstone project documentation

### Phase 4 (Week 4): Integration & Polish
- Connect all components (book + chatbot + auth + features)
- Verify all 20+ examples are reproducible
- Test end-to-end on simulated environment
- Record 90-second demo video

## Technical Specifications (as provided by user)

- **Total Word Count**: 10,000-20,000 words (2000-4000 per module)
- **Sources**: 8+ peer-reviewed journals (2014-2024) + official docs (2019-2024)
- **Format**: Markdown with APA citations and inline documentation links
- **Chatbot**: OpenAI Agents/ChatKit + FastAPI + Neon Postgres + Qdrant Cloud
- **Authentication**: Better Auth with software/hardware background questions

## Exclusions (Per Specs, as provided by user)

- No comprehensive AI literature review
- No hardware assembly manuals
- No vendor comparisons
- No AI ethics discussion
- No full production codebases

## Success Metrics (as provided by user)

1.  **Content Quality**: All 4 modules complete with 5+ examples each
2.  **Academic Rigor**: 8+ peer-reviewed sources properly cited
3.  **Technical Accuracy**: All code examples verified in Ubuntu 22.04 + RTX environment
4.  **Functional Requirements**:
    -   Book deployed to GitHub Pages
    -   RAG chatbot answers from content + selected-text queries
    -   Authentication with background questions working
    -   Personalization and Urdu translation functional
5.  **Submission Ready**: Public repo + live link + 90-second demo video

## Validation Checklist (as provided by user)

-   [ ] 8+ peer-reviewed sources cited (APA format)
-   [ ] 3+ concrete AI applications with evidence
-   [ ] 20+ reproducible examples (5×4 modules)
-   [ ] Reader can explain classroom AI ROI
-   [ ] Basic humanoid simulation runs after reading
-   [ ] All bonus features implemented (auth, personalization, translation, reusable agents)
-   [ ] Chatbot answers from book content only
-   [ ] Selected-text query functionality working
-   [ ] Demo video under 90 seconds covers all features

## Timeline Enforcement (as provided by user)

-   Day 7: Module 1 complete + authentication working
-   Day 14: Modules 1-2 complete + chatbot functional
-   Day 21: All modules complete + all bonus features implemented
-   Day 28: Final testing + demo recording + submission
