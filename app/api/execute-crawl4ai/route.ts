import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Crawl4AI service URL (default to localhost, can be configured via env)
const CRAWL4AI_SERVICE_URL = process.env.CRAWL4AI_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params, jsonSchema, extractPrompt } = body;

    // Map action to Crawl4AI endpoint
    let endpoint = '';
    let requestBody: any = {};

    switch (action) {
      case 'scrape':
        endpoint = '/scrape';
        requestBody = {
          url: params.url,
          formats: params.formats || ['markdown', 'html'],
        };
        break;

      case 'search':
        endpoint = '/search';
        requestBody = {
          query: params.query,
          limit: params.limit || 5,
        };
        break;

      case 'map':
        endpoint = '/map';
        requestBody = {
          url: params.url,
        };
        break;

      case 'crawl':
        endpoint = '/crawl';
        requestBody = {
          url: params.url,
          limit: params.limit || 10,
          formats: params.formats || ['markdown'],
        };
        break;

      case 'batch_scrape':
        endpoint = '/batch_scrape';
        requestBody = {
          urls: params.urls,
          formats: params.formats || ['markdown'],
        };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Supported: scrape, search, map, crawl, batch_scrape` },
          { status: 400 }
        );
    }

    // Call Crawl4AI service
    const response = await fetch(`${CRAWL4AI_SERVICE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Crawl4AI request failed');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      action,
      result,
    });
  } catch (error) {
    console.error('Crawl4AI execution error:', error);
    return NextResponse.json(
      {
        error: 'Crawl4AI execution failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
