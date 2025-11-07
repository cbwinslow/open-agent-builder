import { Workflow } from '../../types';

/**
 * Example 2: Agent with Crawl4AI Tool (MCP Integration)
 *
 * This workflow demonstrates how to give an agent access to Crawl4AI MCP tools
 * for free web scraping and crawling.
 *
 * Flow: Start -> Agent (with Crawl4AI MCP) -> End
 *
 * Use case: Web research, data gathering, content extraction from URLs
 *
 * REQUIREMENTS:
 * - Crawl4AI service running (no API key needed - it's free!)
 * - AI provider with MCP/function calling support
 *
 * MCP TOOL SUPPORT BY PROVIDER:
 * - Anthropic (Claude): ✅ Native MCP support via beta API
 * - OpenAI (GPT-4o): ✅ Function calling support (converted from MCP)
 * - Groq (gpt-oss-20b/120b): ✅ Native MCP via Responses API
 *
 * All three providers support MCP tools! Choose based on speed, cost, and model preference.
 */
export const agentWithCrawl4AI: Workflow = {
  id: 'example-02-agent-with-crawl4ai',
  name: 'Example 2: Agent with Crawl4AI',
  description: 'An agent that can scrape and crawl the web using free open-source Crawl4AI',
  category: 'examples',
  tags: ['example', 'beginner', 'crawl4ai', 'tools', 'free'],
  estimatedTime: '2-3 minutes',
  difficulty: 'beginner',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  nodes: [
    {
      id: 'start',
      type: 'start',
      position: { x: 100, y: 200 },
      data: {
        label: 'Start',
        nodeType: 'start',
        nodeName: 'Start',
        inputVariables: [
          {
            name: 'url',
            type: 'string',
            required: true,
            description: 'What URL would you like to scrape and research?',
            defaultValue: 'https://github.com/unclecode/crawl4ai',
          },
        ],
      },
    },
    {
      id: 'research-agent',
      type: 'agent',
      position: { x: 350, y: 200 },
      data: {
        label: 'Web Research Agent',
        nodeType: 'agent',
        nodeName: 'Web Research Agent',
        instructions: `You are a web research assistant with access to Crawl4AI MCP tools. Your task:

1. Use the crawl4ai_scrape tool to scrape content from: {{input.url}}
2. Review the scraped content and extract key information
3. If needed, use crawl4ai_map to discover related pages
4. Synthesize the information into a clear, well-organized summary

Provide a comprehensive summary with key findings from the webpage.`,
        model: 'anthropic/claude-sonnet-4-20250514', // Also: openai/gpt-4o or groq/gpt-oss-20b
        outputFormat: 'Text',
        mcpTools: [
          {
            name: 'Crawl4AI',
            url: process.env.CRAWL4AI_SERVICE_URL || 'http://localhost:8000',
          },
        ],
      },
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 600, y: 200 },
      data: {
        label: 'End',
        nodeType: 'end',
        nodeName: 'End',
      },
    },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'research-agent' },
    { id: 'e2', source: 'research-agent', target: 'end' },
  ],
};
