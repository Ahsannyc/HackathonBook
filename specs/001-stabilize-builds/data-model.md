# Data Model: Build Configuration Entities

## Build Configuration Entities

### GitHubPagesBuild
- **name**: GitHubPagesBuild
- **description**: Configuration for GitHub Pages deployment of Docusaurus documentation
- **fields**:
  - config_file: string (docusaurus.config.ts)
  - base_url: string (conditional based on environment)
  - broken_link_handling: string (warn level)
  - build_output: directory (book/build)
- **validation**:
  - onBrokenLinks must be set to 'warn'
  - baseUrl must support both local dev and GitHub Pages
- **state transitions**: N/A (configuration entity)

### RailwayDeployment
- **name**: RailwayDeployment
- **description**: Configuration for Railway deployment of backend services
- **fields**:
  - config_file: string (railway.toml)
  - builder_type: string (NIXPACKS or Docker)
  - runtime: string (Node.js or Python)
  - entry_point: string (startup command)
  - dependencies: array (package.json, requirements.txt)
- **validation**:
  - Must have unambiguous build plan detection
  - Runtime must be clearly specified
- **state transitions**: N/A (configuration entity)

### BuildPlanDetection
- **name**: BuildPlanDetection
- **description**: Process by which Railway determines how to build the application
- **fields**:
  - detector_type: string (NIXPACKS, Docker, etc.)
  - detection_rules: array (patterns for detection)
  - ambiguity_level: string (none, low, high)
- **validation**:
  - Must resolve to single clear build plan
  - Must not conflict with other deployment targets
- **state transitions**: N/A (process entity)

### DocusaurusConfig
- **name**: DocusaurusConfig
- **description**: Configuration file controlling documentation site behavior
- **fields**:
  - onBrokenLinks: string (warn/error handling)
  - baseUrl: string (path configuration)
  - presets: array (docusaurus presets)
  - plugins: array (docusaurus plugins)
- **validation**:
  - onBrokenLinks must be set exactly once
  - No duplicate or conflicting settings
- **state transitions**: N/A (configuration entity)

### RailwayConfig
- **name**: RailwayConfig
- **description**: Configuration file defining Railway deployment behavior
- **fields**:
  - builder: string (NIXPACKS or Docker)
  - start_command: string (how to start the app)
  - environment: object (env vars)
  - build_phases: object (setup, install, build, start)
- **validation**:
  - Must have clear single entry point
  - Must not conflict with other build systems
- **state transitions**: N/A (configuration entity)

### BrokenLinkHandling
- **name**: BrokenLinkHandling
- **description**: Configuration for how broken links are processed during builds
- **fields**:
  - severity_level: string (warn, error, ignore)
  - reporting_method: string (console, file, etc.)
- **validation**:
  - Must be set to 'warn' for GitHub Pages
  - Must be consistent across config
- **state transitions**: N/A (configuration entity)

### BuildArtifact
- **name**: BuildArtifact
- **description**: Output files generated during the build process
- **fields**:
  - type: string (documentation, backend, frontend)
  - location: string (directory path)
  - dependencies: array (required files)
- **validation**:
  - Must be properly generated for deployment
  - Must not conflict between different build targets
- **state transitions**: N/A (artifact entity)