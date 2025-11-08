# Crawl4AI Service

Free and open-source web scraping service using Crawl4AI.

## Installation

```bash
cd services/crawl4ai
pip install -r requirements.txt
playwright install chromium
```

## Running the Service

```bash
python server.py 8000
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

### Scrape
```
POST /scrape
Body: { "url": "https://example.com", "formats": ["markdown", "html"] }
```

### Search
```
POST /search
Body: { "query": "search query", "limit": 5 }
```

### Map
```
POST /map
Body: { "url": "https://example.com" }
```

### Crawl
```
POST /crawl
Body: { "url": "https://example.com", "limit": 10 }
```

### Batch Scrape
```
POST /batch_scrape
Body: { "urls": ["https://example.com", "https://example.org"] }
```

## Development

The service is designed to be a drop-in replacement for Firecrawl API calls.
