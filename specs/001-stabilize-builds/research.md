# Research: GitHub Pages and Railway Build Stabilization

## GitHub Pages Analysis

### Docusaurus Configuration
- **File**: `book/docusaurus.config.ts`
- **Current State**: `onBrokenLinks: 'warn'` is set correctly on line 27
- **Verification**: No duplicate or conflicting onBrokenLinks settings exist
- **Finding**: GitHub Pages configuration is already correct and requires no changes

### Local vs GitHub Pages Configuration
- **baseUrl handling**: Uses conditional logic `process.env.NODE_ENV === 'development' || process.env.DEPLOY_ENV === 'vercel' ? '/' : '/HackathonBook/'`
- **Finding**: This correctly handles both local development and GitHub Pages deployment

## Railway Build Detection Analysis

### Current Build Files
1. **Dockerfile**: Configured to run Node.js backend (`node backend/dist/server.js`)
2. **railway.toml**: Configured to run Python RAG backend (`cd rag-backend && python -m uvicorn main:app`)
3. **package.json**: Node.js dependencies
4. **rag-backend/requirements.txt**: Python dependencies

### Root Cause of "Error creating build plan with Railpack"
- **Issue**: Railway's NIXPACKS builder is confused by conflicting configurations
- **Conflict**: Dockerfile runs Node.js backend but railway.toml starts Python backend
- **Result**: Railway cannot determine which runtime to use and which entry point to execute

### Runtime Detection Issues
- **Node.js**: Present via package.json and backend/
- **Python**: Present via rag-backend/requirements.txt
- **Ambiguity**: Both runtimes detected with conflicting startup commands

## Recommended Solution Approach

### Railway Configuration Fix
1. **Option A**: Align Dockerfile with railway.toml (both use Python RAG backend)
2. **Option B**: Align railway.toml with Dockerfile (both use Node.js backend)
3. **Option C**: Use explicit Docker deployment to bypass NIXPACKS detection

### Risk Assessment
- **Local Development**: Changes must not break npm run dev, npm start, etc.
- **GitHub Pages**: Changes must not affect documentation build
- **Application Logic**: No changes to RAG, auth, or frontend behavior

## Decision

**Chosen Solution**: Option C - Use explicit Docker deployment to bypass NIXPACKS detection ambiguity

**Rationale**:
- Docker deployment provides explicit build instructions
- Eliminates ambiguity in runtime detection
- Preserves existing application logic
- Maintains local development workflow

**Alternatives Considered**:
- Keep NIXPACKS with modified configs: Risk of ongoing deployment issues
- Separate repositories: Overly complex for current architecture