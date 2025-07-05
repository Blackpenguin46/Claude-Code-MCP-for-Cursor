#!/usr/bin/env node

const { spawn } = require('child_process');

// MCP Server for Claude Code integration
class ClaudeMCPServer {
  constructor() {
    this.setupStdio();
  }

  setupStdio() {
    // Read JSON-RPC messages from stdin
    let buffer = '';

    process.stdin.on('data', (chunk) => {
      buffer += chunk.toString();

      // Process complete JSON-RPC messages (one per line)
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const request = JSON.parse(line);
            this.handleRequest(request);
          } catch (error) {
            this.sendError(null, -32700, 'Parse error', error.message);
          }
        }
      }
    });

    process.stdin.on('end', () => {
      process.exit(0);
    });
  }

  async handleRequest(request) {
    const { id, method, params } = request;

    try {
      switch (method) {
        case 'initialize':
          await this.handleInitialize(id, params);
          break;

        case 'notifications/initialized':
          // Initialization complete - no response needed
          break;

        case 'tools/list':
          await this.handleToolsList(id);
          break;

        case 'tools/call':
          await this.handleToolCall(id, params);
          break;

        case 'ping':
          this.sendResponse(id, {});
          break;

        default:
          this.sendError(id, -32601, 'Method not found', `Unknown method: ${method}`);
      }
    } catch (error) {
      this.sendError(id, -32603, 'Internal error', error.message);
    }
  }

  async handleInitialize(id, params) {
    this.sendResponse(id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {
          listChanged: false
        }
      },
      serverInfo: {
        name: 'claude-code-mcp',
        version: '1.0.0'
      }
    });
  }

  async handleToolsList(id) {
    this.sendResponse(id, {
      tools: [
        {
          name: 'claude_chat',
          description: 'Send a message to Claude using Claude Code CLI',
          inputSchema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'The message to send to Claude'
              }
            },
            required: ['message']
          }
        }
      ]
    });
  }

  async handleToolCall(id, params) {
    const { name, arguments: args } = params;

    if (name !== 'claude_chat') {
      this.sendError(id, -32602, 'Invalid params', `Unknown tool: ${name}`);
      return;
    }

    try {
      const { message } = args;
      if (!message) {
        this.sendError(id, -32602, 'Invalid params', 'Message is required');
        return;
      }

      const response = await this.callClaude(message);

      this.sendResponse(id, {
        content: [
          {
            type: 'text',
            text: response
          }
        ]
      });
    } catch (error) {
      this.sendError(id, -32603, 'Internal error', `Claude Code error: ${error.message}`);
    }
  }

  async callClaude(message) {
    return new Promise((resolve, reject) => {
      // Try using echo to pipe the message to claude chat
      const bashCommand = `echo "${message.replace(/"/g, '\\"')}" | claude chat`;

      const process = spawn('bash', ['-c', bashCommand], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let response = '';
      let error = '';

      process.stdout.on('data', (data) => {
        response += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        // Clean up the response by removing Claude Code's formatting
        let cleanResponse = response
          // Remove the welcome box
          .replace(/╭[─┬┐┌┐]*╮[\s\S]*?╰[─┴┘└┘]*╯/g, '')
          // Remove tip sections
          .replace(/Tips for getting started:[\s\S]*?(?=\n\n|\n$|$)/g, '')
          // Remove prompts and indicators
          .replace(/>\s*chat\s*/g, '')
          .replace(/⏺\s*/g, '')
          // Remove shell prompts at the end
          .replace(/\n\s*%\s*$/, '')
          // Clean up whitespace
          .trim();

        if (!cleanResponse && error) {
          reject(new Error(`Claude Code error: ${error.trim()}`));
          return;
        }

        if (!cleanResponse) {
          reject(new Error('No response received from Claude Code'));
          return;
        }

        resolve(cleanResponse);
      });

      process.on('error', (err) => {
        reject(new Error(`Failed to execute command: ${err.message}`));
      });

      // Set a timeout
      setTimeout(() => {
        process.kill('SIGTERM');
        reject(new Error('Claude Code request timed out'));
      }, 30000);
    });
  }

  sendResponse(id, result) {
    const response = {
      jsonrpc: '2.0',
      id,
      result
    };

    console.log(JSON.stringify(response));
  }

  sendError(id, code, message, data = null) {
    const response = {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message,
        ...(data && { data })
      }
    };

    console.log(JSON.stringify(response));
  }
}

// Start the MCP server
const server = new ClaudeMCPServer();

// Handle graceful shutdown
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

// Send ready signal
process.stderr.write('Claude Code MCP Server started\n');