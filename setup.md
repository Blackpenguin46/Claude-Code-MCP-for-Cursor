# Quick Setup Guide

## Prerequisites Check

Before starting, verify you have:

```bash
# 1. Node.js installed
node --version  # Should show v14+ 

# 2. Claude Code installed and working
claude chat "Hello"  # Should respond with Claude

# 3. Cursor IDE installed
```

## One-Time Global Setup (Do This Once)

### Step 1: Set Up Global MCP Server
```bash
# Create global directory for MCP server
mkdir -p ~/.cursor-mcp

# Copy the MCP server to global location (from your downloaded/cloned repo)
cp claude-mcp-server.js ~/.cursor-mcp/
chmod +x ~/.cursor-mcp/claude-mcp-server.js

# Verify it's there
ls -la ~/.cursor-mcp/claude-mcp-server.js
```

### Step 2: Create Setup Script for Future Projects
```bash
# Create the setup script on your Desktop (or anywhere convenient)
cat > ~/Desktop/setup-claude-mcp.sh << 'EOF'
#!/bin/bash
echo "Setting up Claude Code MCP for current project..."

# Create .cursor directory
mkdir -p .cursor

# Create mcp.json pointing to global location
cat > .cursor/mcp.json << 'MCPEOF'
{
  "mcpServers": {
    "claude-code": {
      "command": "node",
      "args": ["/Users/$USER/.cursor-mcp/claude-mcp-server.js"],
      "env": {},
      "description": "Claude Code CLI integration"
    }
  }
}
MCPEOF

echo "✅ MCP setup complete!"
echo ""
echo "🔄 IMPORTANT: Restart Cursor completely!"
echo "Then open THIS project folder in Cursor and check MCP Tools."
EOF

# Make it executable
chmod +x ~/Desktop/setup-claude-mcp.sh
```

## For Each New Project (Simple 3-Step Process)

### Step 1: Navigate to Your Project
```bash
cd ~/Desktop/YourNewProject
# Make sure you're IN the project directory you want to set up
```

### Step 2: Run the Setup Script
```bash
bash ~/Desktop/setup-claude-mcp.sh
```

### Step 3: Configure Cursor
1. **🔄 RESTART CURSOR COMPLETELY** (this is critical!)
2. **Open the SAME project folder** you just set up
3. **Go to Settings → Models**
4. **Disable all other models** (GPT-4, Claude API, etc.) - leave only your custom model
5. **Go to Settings → Tools & Integrations → MCP Tools**
6. **Verify "claude-code" shows "1 tools enabled"** (not "0 tools enabled")
7. **Toggle it ON** if not already enabled

## Example Walkthrough

```bash
# For a project called "MyWebApp"
cd ~/Desktop/MyWebApp

# Run setup (use full path to be safe)
bash ~/Desktop/setup-claude-mcp.sh

# Output should show: "✅ MCP setup complete!"
# RESTART Cursor, open MyWebApp folder, check MCP Tools
```

## 🚨 Critical Success Tips

### ✅ Always Do This:
- **Run the setup script FROM INSIDE the project directory** you want to use Claude in
- **RESTART Cursor completely** after setup (close and reopen)
- **Open the EXACT project folder** you ran the script in
- **Disable other models** in Cursor to avoid confusion and costs

### ❌ Common Mistakes:
- Running script from wrong directory
- Forgetting to restart Cursor
- Opening wrong folder in Cursor
- Leaving other paid models enabled

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "0 tools enabled" | Restart Cursor, check you opened correct project folder |
| "Command not found: claude" | Install Claude Code CLI |
| MCP server won't start | Check Node.js version, file permissions |
| Still using API/paid models | Disable all models except your custom Claude proxy |
| Script doesn't work | Use full path: `bash ~/Desktop/setup-claude-mcp.sh` |

## File Structure After Setup
```
your-project/
├── .cursor/
│   └── mcp.json          # Points to global MCP server
└── (your project files)

~/.cursor-mcp/
└── claude-mcp-server.js  # Global MCP server (shared by all projects)
```

## Model Configuration in Cursor

In **Settings → Models**:
- ❌ **Disable**: GPT-4, Claude API, other paid models
- ✅ **Enable**: Only your custom "claude-code" model
- This ensures you ONLY use your $20/month subscription, never pay-per-use APIs

## Verification Commands

```bash
# Verify each component:
claude --version                    # Claude Code installed
node --version                     # Node.js available  
ls -la ~/.cursor-mcp/              # Global MCP server exists
cat .cursor/mcp.json              # Project config correct
```

## 💡 Pro Tips

- **Keep the setup script handy** - you'll use it for every new project
- **Always verify "1 tools enabled"** in MCP Tools before starting work
- **Restart Cursor** if anything seems off - it solves most issues
- **Only enable your custom model** to avoid accidental API charges

Need help? [Open an issue](https://github.com/Blackpenguin46/Claude-Code-MCP-for-Cursor/issues)
