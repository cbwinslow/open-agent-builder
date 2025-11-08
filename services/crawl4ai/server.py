#!/usr/bin/env python3
"""
Crawl4AI Service - Free and Open Source Web Scraping
Replacement for Firecrawl API
"""
import asyncio
import json
import sys
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

try:
    from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, BrowserConfig, CacheMode
except ImportError:
    print("Error: crawl4ai not installed. Install with: pip install crawl4ai")
    sys.exit(1)

app = FastAPI(title="Crawl4AI Service", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global crawler instance
crawler = None

class ScrapeRequest(BaseModel):
    url: str
    formats: Optional[List[str]] = ["markdown", "html"]

class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 5

class MapRequest(BaseModel):
    url: str

class CrawlRequest(BaseModel):
    url: str
    limit: Optional[int] = 10
    formats: Optional[List[str]] = ["markdown"]

class BatchScrapeRequest(BaseModel):
    urls: List[str]
    formats: Optional[List[str]] = ["markdown"]

@app.on_event("startup")
async def startup_event():
    """Initialize the crawler on startup"""
    global crawler
    browser_config = BrowserConfig(
        headless=True,
        verbose=False,
    )
    crawler = AsyncWebCrawler(config=browser_config)
    await crawler.start()
    print("✅ Crawl4AI service started")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global crawler
    if crawler:
        await crawler.close()
    print("👋 Crawl4AI service stopped")

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "crawl4ai"}

@app.post("/scrape")
async def scrape(request: ScrapeRequest):
    """
    Scrape a single URL and return markdown/html content
    Equivalent to Firecrawl's scrape action
    """
    try:
        config = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS,
            word_count_threshold=10,
        )
        
        result = await crawler.arun(
            url=request.url,
            config=config
        )
        
        if not result.success:
            raise HTTPException(status_code=500, detail=f"Scraping failed: {result.error_message}")
        
        # Format response similar to Firecrawl
        response = {
            "success": True,
            "url": request.url,
            "markdown": result.markdown or "",
            "html": result.html or "",
            "metadata": {
                "title": result.metadata.get("title", "") if result.metadata else "",
                "description": result.metadata.get("description", "") if result.metadata else "",
                "language": result.metadata.get("language", "") if result.metadata else "",
                "status_code": result.status_code,
            },
            "links": {
                "internal": result.links.get("internal", []) if result.links else [],
                "external": result.links.get("external", []) if result.links else [],
            }
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping error: {str(e)}")

@app.post("/search")
async def search(request: SearchRequest):
    """
    Web search functionality
    Note: This is a basic implementation. For production, consider integrating
    with SearXNG or another search API
    """
    try:
        # For now, return a basic response indicating search is not fully implemented
        # In production, you would integrate with SearXNG or another search API
        return {
            "success": True,
            "query": request.query,
            "results": [],
            "note": "Search functionality requires integration with SearXNG or another search API. "
                   "For basic use cases, consider using the scrape endpoint with specific URLs."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@app.post("/map")
async def map_site(request: MapRequest):
    """
    Map a website and return all internal links
    Equivalent to Firecrawl's map action
    """
    try:
        config = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS,
            word_count_threshold=0,  # We just want links
        )
        
        result = await crawler.arun(
            url=request.url,
            config=config
        )
        
        if not result.success:
            raise HTTPException(status_code=500, detail=f"Mapping failed: {result.error_message}")
        
        # Extract all links
        internal_links = result.links.get("internal", []) if result.links else []
        external_links = result.links.get("external", []) if result.links else []
        
        return {
            "success": True,
            "url": request.url,
            "links": internal_links + external_links,
            "internal_links": internal_links,
            "external_links": external_links,
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mapping error: {str(e)}")

@app.post("/crawl")
async def crawl(request: CrawlRequest):
    """
    Crawl multiple pages from a website
    Equivalent to Firecrawl's crawl action
    """
    try:
        # First, get the map of the site
        map_config = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS,
            word_count_threshold=0,
        )
        
        map_result = await crawler.arun(
            url=request.url,
            config=map_config
        )
        
        if not map_result.success:
            raise HTTPException(status_code=500, detail=f"Initial crawl failed: {map_result.error_message}")
        
        # Get internal links to crawl
        internal_links = map_result.links.get("internal", []) if map_result.links else []
        urls_to_crawl = [request.url] + internal_links[:request.limit - 1]
        
        # Crawl each URL
        results = []
        scrape_config = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS,
            word_count_threshold=10,
        )
        
        for url in urls_to_crawl:
            try:
                result = await crawler.arun(url=url, config=scrape_config)
                if result.success:
                    results.append({
                        "url": url,
                        "markdown": result.markdown or "",
                        "html": result.html or "",
                        "metadata": {
                            "title": result.metadata.get("title", "") if result.metadata else "",
                            "description": result.metadata.get("description", "") if result.metadata else "",
                        }
                    })
            except Exception as e:
                print(f"Error crawling {url}: {str(e)}")
                continue
        
        return {
            "success": True,
            "url": request.url,
            "total": len(results),
            "results": results,
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crawl error: {str(e)}")

@app.post("/batch_scrape")
async def batch_scrape(request: BatchScrapeRequest):
    """
    Scrape multiple URLs in batch
    Equivalent to Firecrawl's batch_scrape action
    """
    try:
        results = []
        config = CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS,
            word_count_threshold=10,
        )
        
        for url in request.urls:
            try:
                result = await crawler.arun(url=url, config=config)
                if result.success:
                    results.append({
                        "url": url,
                        "markdown": result.markdown or "",
                        "html": result.html or "",
                        "metadata": {
                            "title": result.metadata.get("title", "") if result.metadata else "",
                            "description": result.metadata.get("description", "") if result.metadata else "",
                        }
                    })
            except Exception as e:
                print(f"Error scraping {url}: {str(e)}")
                results.append({
                    "url": url,
                    "error": str(e),
                    "success": False,
                })
        
        return {
            "success": True,
            "total": len(results),
            "results": results,
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch scrape error: {str(e)}")

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    uvicorn.run(app, host="0.0.0.0", port=port)
