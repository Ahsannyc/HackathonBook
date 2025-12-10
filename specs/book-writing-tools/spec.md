# Specification: Claude Code Subagents and Skills for Professional Book Writing and Editing

## Feature Description
Create a comprehensive set of Claude Code subagents and agent skills specifically designed for professional book writing and editing tasks. These tools will provide specialized assistance for various aspects of the writing and editing process, from developmental editing to copy editing, character consistency tracking, and manuscript analysis.

## User Scenarios & Testing

### Primary User Scenarios
1. **Professional Author Workflow**: An author uses the subagents and skills to improve their manuscript at various stages of the writing process, from initial draft to final revision.
2. **Editorial Workflow**: A professional editor uses the tools to provide consistent, thorough feedback on manuscripts across multiple projects.
3. **Self-Publishing Author Support**: An independent author leverages the tools to achieve professional-quality editing without external editor costs.

### Testing Approach
- Each subagent and skill should be validated by testing with sample text passages
- Tools must provide actionable, specific feedback that improves the text
- Quality of feedback should be comparable to professional editing services
- Tools must maintain consistency in their application of editing principles

## Functional Requirements

### Subagent 1: book-editor
- Focus on prose clarity, narrative flow, and pacing
- Improve sentence structure and word choice for maximum clarity
- Ensure smooth chapter transitions and consistent narrative rhythm
- Identify and correct 'telling' instead of 'showing' passages
- Eliminate redundant content and repetitive phrasing
- Strengthen opening and closing hooks for chapters and scenes

### Subagent 2: character-tracker
- Monitor character details (physical appearance, personality traits, background, speech patterns)
- Track character relationships and dynamics throughout the narrative
- Maintain character sheets with key attributes and details
- Flag inconsistencies in character behavior, voice, or details
- Note timeline issues in character development or age progression
- Identify moments where character motivations are unclear or inconsistent

### Subagent 3: style-checker
- Enforce Chicago Manual of Style compliance
- Identify and flag passive voice constructions that weaken prose
- Suggest stronger, more precise word choices to eliminate weak language
- Detect overused words, phrases, and repetitive sentence structures
- Identify clichés and suggest fresh, original alternatives
- Ensure consistent formatting for dialogue, quotations, and citations

### Subagent 4: dev-editor
- Analyze plot structure using three-act framework and identify structural weaknesses
- Evaluate story arcs for proper setup, development, and resolution
- Assess theme development and ensure thematic elements are well-integrated
- Identify areas where conflict escalation is insufficient or forced
- Check for proper pacing throughout the narrative (action vs. reflection)
- Locate plot holes and logical inconsistencies in the story

### Subagent 5: copy-editor
- Correct grammar, punctuation, and spelling errors
- Ensure formatting consistency throughout the manuscript
- Catch typos and technical errors that affect readability
- Verify proper usage of homophones and commonly confused words
- Check for consistency in capitalization, hyphenation, and abbreviation usage
- Ensure dialogue formatting follows standard conventions

### Skill 1: plot-analyzer
- Identify plot holes, pacing issues, and structural weaknesses
- Analyze where story logic breaks down or where pacing drags/rushes
- Locate weak plot points that don't advance the story meaningfully
- Find missing cause-and-effect relationships between events
- Identify underdeveloped subplots that don't serve the main story

### Skill 2: dialogue-polisher
- Review and improve dialogue authenticity and impact
- Ensure each character has a distinctive voice and speaking pattern
- Eliminate exposition-heavy dialogue that sounds unnatural
- Strengthen subtext and emotional undertones in conversations
- Improve dialogue tags and action beats to enhance flow

### Skill 3: scene-builder
- Analyze and enhance individual scenes for sensory detail and tension
- Add vivid sensory details that immerse readers in the scene
- Build tension through pacing, dialogue, and action
- Ensure scenes have clear objectives, obstacles, and outcomes
- Strengthen setting descriptions to support mood and atmosphere

### Skill 4: chapter-reviewer
- Provide comprehensive chapter-level feedback
- Evaluate chapter opening hooks and engagement level
- Assess overall pacing and rhythm within the chapter
- Review character development and consistency throughout
- Check plot advancement and relevance to the overall story

### Skill 5: manuscript-audit
- Perform full manuscript analysis with actionable revision priorities
- Examine overall narrative structure and pacing across the entire work
- Assess character development arcs and consistency throughout
- Evaluate theme development and integration with plot elements
- Identify major plot holes, inconsistencies, and logical issues
- Provide priority order for revision efforts based on impact

### Content Requirements
- Each subagent and skill must have comprehensive, professional-grade instructions
- Tools must follow industry-standard editing practices and principles
- All tools must provide specific, actionable feedback
- Instructions must be clear, detailed, and unambiguous

## Non-Functional Requirements

### Performance
- Tools should provide feedback efficiently without excessive processing time
- Subagents and skills should maintain consistent response quality

### Quality
- All feedback must be professional-grade and comparable to human editing
- Tools must maintain consistency in their application of standards
- Feedback should be specific and actionable rather than generic

### Maintainability
- Tools should be modular and easily updatable
- Instructions should be clear enough for future maintenance
- Configuration should follow standard Claude Code conventions

## Success Criteria

### Quantitative Measures
- 5 functional subagents created with appropriate instructions
- 5 functional skills created with appropriate instructions
- All tools properly configured and stored in Claude Code directories
- 100% of tools provide actionable feedback when executed

### Qualitative Measures
- Tools provide professional-grade editing feedback
- Feedback is specific, actionable, and improves text quality
- Tools follow industry-standard editing practices
- Users can effectively integrate tools into their writing workflow

## Key Entities
- Claude Code subagents (5 core subagents)
- Claude Code skills (5 core skills)
- Professional editing standards and practices
- Target users (authors, editors, publishers)

## Constraints

### Scope Constraints
- Focus on professional editing tasks rather than casual writing
- Limit to text-based feedback rather than visual or multimedia elements
- Adhere to established editing standards (Chicago Manual of Style)
- Exclude features outside of writing and editing scope

### Technical Constraints
- Tools must be compatible with Claude Code configuration format
- Instructions must be stored in JSON format in appropriate directories
- Tools must work within Claude Code's existing architecture
- Configuration files must follow standard Claude Code conventions

## Dependencies
- Claude Code CLI and configuration system
- Access to text content for analysis
- Standard editing reference materials (Chicago Manual of Style)