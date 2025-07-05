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

## 5-Minute Setup

### Step 1: Download Files
```bash
# Option A: Clone the repo
git clone https://github.com/Blackpenguin46/Claude-Code-MCP-for-Cursor.git
cd Claude-Code-MCP-for-Cursor

# Option B: Download individual files to your project
curl -O https://raw.githubusercontent.com/Blackpenguin46/Claude-Code-MCP-for-Cursor/main/claude-mcp-server.js
mkdir -p .cursor
curl -o .cursor/mcp.json https://raw.githubusercontent.com/Blackpenguin46/Claude-Code-MCP-for-Cursor/main/.cursor/mcp.json
```

### Step 2: Test the Server
```bash
# Make executable
chmod +x claude-mcp-server.js

# Test it works
node claude-mcp-server.js
# In another terminal, test with:
# echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | nc localhost 3000
```

### Step 3: Configure Cursor
1. Open Cursor
2. Go to **Settings** → **Tools & Integrations** → **MCP Tools**
3. Look for "claude-code" 
4. Toggle it ON (green)
5. Should show "1 tools enabled"

### Step 4: Test in Cursor
- Start a new chat in Cursor
- Ask: "What is the capital of France?"
- Should get response from your Claude subscription!

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "0 tools enabled" | Restart Cursor, check file locations |
| "Command not found: claude" | Install Claude Code CLI |
| MCP server won't start | Check Node.js version, file permissions |
| No response in Cursor | Verify Claude Code authentication |

## File Structure
```
your-project/
├── .cursor/
│   └── mcp.json          # Cursor MCP configuration
├── claude-mcp-server.js  # The MCP bridge server
└── (your project files)
```

## Verification Commands

```bash
# Verify each component:
claude --version                    # Claude Code installed
node --version                     # Node.js available  
ls -la claude-mcp-server.js       # File exists and executable
cat .cursor/mcp.json              # Config file correct
node claude-mcp-server.js         # Server starts without errors
```

Need help? [Open an issue](https://github.com/Blackpenguin46/Claude-Code-MCP-for-Cursor/issues)