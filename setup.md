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
4. **Disable ALL models** (GPT-4, Claude API, etc.) - turn every toggle OFF
5. **Go to Settings → Tools & Integrations → MCP Tools**
6. **Verify "claude-code" shows "1 tools enabled"** (not "0 tools enabled")
7. **Toggle it ON** if not already enabled

### Step 4: Force Cursor to Use Your MCP Tool
🚨 **CRITICAL**: Cursor may still try to use built-in models even with MCP enabled!

**When starting a chat in Cursor:**
1. **Look for a model/tool selector** in the chat interface
2. **Explicitly select "claude-code" tool** instead of GPT-4 or other models
3. **OR manually specify in your first message**: "Use the claude-code MCP tool to respond"

### Step 5: Verify It's Working
**Test with this exact message:**
```
Are you responding through Claude Code or an API?
```

**✅ Correct Response** (using your $20 plan):
- Should mention Claude Code, Claude CLI, or your subscription
- Should NOT mention GPT-4, OpenAI, or API usage

**❌ Wrong Response** (using paid API):
- Mentions GPT-4, OpenAI, or API
- Says it's not Claude Code
- **If you get this**: Go back to Settings → Models and disable ALL models

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
- **Disable ALL models** in Settings → Models (turn every toggle OFF)
- **Explicitly select claude-code tool** when chatting
- **Test with verification message** to confirm you're using Claude Code

### ❌ Common Mistakes:
- Running script from wrong directory
- Forgetting to restart Cursor
- Opening wrong folder in Cursor
- Leaving ANY paid models enabled in Settings → Models
- Not explicitly selecting the claude-code tool when chatting
- Assuming MCP will be used automatically (it often won't be!)

### 🧪 Always Test First:
Before doing any real work, **ALWAYS** test with:
```
Are you responding through Claude Code or an API?
```
If you get the wrong answer, you're using paid APIs instead of your subscription!

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Gets GPT-4 response instead of Claude | Disable ALL models in Settings → Models, explicitly select claude-code tool |
| "0 tools enabled" | Restart Cursor, check you opened correct project folder |
| "Are you responding through Claude Code?" gets wrong answer | You're using paid APIs - disable all models, select claude-code tool |
| "Command not found: claude" | Install Claude Code CLI |
| MCP server won't start | Check Node.js version, file permissions |
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
