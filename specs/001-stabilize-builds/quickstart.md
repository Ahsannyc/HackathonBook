# Quickstart: Build Configuration Fixes

## GitHub Pages Configuration

### Verify Docusaurus Settings
1. Check `book/docusaurus.config.ts` has `onBrokenLinks: 'warn'` (already correct)
2. Verify no duplicate broken link settings exist
3. Confirm baseUrl handles both local and GitHub Pages environments

### Build and Deploy GitHub Pages
```bash
cd book
npm run build
# Deploy the build/ directory to GitHub Pages
```

## Railway Configuration

### Current Issue
- Railway shows "Error creating build plan with Railpack"
- Caused by conflicting build configurations between Dockerfile and railway.toml

### Recommended Fix
1. **Option A**: Align Dockerfile and railway.toml configurations
2. **Option B**: Use explicit Docker deployment to bypass NIXPACKS
3. **Option C**: Simplify to single runtime detection

### Implementation Steps
1. Determine primary application runtime (Node.js proxy vs Python RAG)
2. Update configurations to align with chosen runtime
3. Test Railway deployment with fixed configuration
4. Verify local development still works

## Local Development Verification

### Test Commands
```bash
# Verify local development still works
npm run dev
# Should start both backend and frontend without issues
```

### Verification Checklist
- [ ] GitHub Pages build completes successfully
- [ ] Railway deployment detects build plan correctly
- [ ] Local development environment works unchanged
- [ ] No broken functionality after configuration changes