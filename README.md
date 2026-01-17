<div align="center">

# 🌐 OpenBare

### A decentralized, censorship-resistant web proxy network

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)](https://workers.cloudflare.com/)

**Deploy your own node in 30 seconds** • **Use community nodes** • **Browse freely**

[Quick Start](#-quick-start) • [Deploy Your Node](#-deploy-your-own-node) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- 👀 **Instant Setup** - One-click deploy to Vercel, Railway, or Cloudflare
- 🌍 **Decentralized** - Community-run nodes across the globe
- ⚡ **Edge Performance** - Cloudflare Workers for <50ms latency worldwide
- 🔄 **Automatic Failover** - Client seamlessly switches between nodes
- 📊 **Built-in Monitoring** - Health checks, metrics, and status dashboard
- 🔒 **Production Ready** - Rate limiting, security headers, graceful shutdown
- 🤝 **UV Compatible** - Works with Ultraviolet and other TompHTTP clients

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            YOUR APPLICATION                             │
│                    (SperaxOS, Ultraviolet, etc.)                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         OPENBARE CLIENT                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│  │ Server Pool │──│  Failover   │──│  Discovery  │                      │
│  │  Manager    │  │   Logic     │  │   Client    │                      │
│  └─────────────┘  └─────────────┘  └─────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │  Node 1   │   │  Node 2   │   │  Node 3   │
            │  (US)     │   │  (EU)     │   │  (Asia)   │
            │  Vercel   │   │ Cloudflare│   │  Railway  │
            └───────────┘   └───────────┘   └───────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                    ┌───────────────────────────────┐
                    │      OPENBARE REGISTRY        │
                    │   (Optional - Node Discovery) │
                    └───────────────────────────────┘
```

---

## 🚀 Quick Start

### Option 1: Use Public Nodes

Use community-maintained nodes without deploying anything:

```javascript
import { OpenBareClient } from '@openbare/client';

const client = new OpenBareClient({
  // Auto-discover nodes from registry
  registry: 'https://registry.openbare.dev'
});

// Fetch any URL through the proxy network
const response = await client.fetch('https://example.com');
```

### Option 2: Run Locally

```bash
# Clone the repo
git clone https://github.com/nirholas/openbare.git
cd openbare

# Start the server
cd server
npm install
npm start

# Server running at http://localhost:8080
# Bare endpoint at http://localhost:8080/bare/
```

### Option 3: Deploy Your Own (see below)

---

## 🌐 Deploy Your Own Node

### One-Click Deploy

| Platform | Deploy | Best For |
|----------|--------|----------|
| **Vercel** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nirholas/openbare/tree/main/server) | Easy setup, free tier |
| **Railway** | [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/openbare) | Docker support, databases |
| **Cloudflare** | [Deploy to Workers →](#cloudflare-workers) | Global edge, lowest latency |

### Cloudflare Workers (Edge)

Deploy to 300+ locations worldwide:

```bash
cd edge
npm install
npx wrangler login
npx wrangler deploy
```

### Docker

```bash
docker run -d \
  -p 8080:8080 \
  -e NODE_ID=my-node \
  -e REGION=us-east \
  ghcr.io/nirholas/openbare:latest
```

### Manual Deployment

```bash
cd server
npm install
npm start
```

See [Self-Hosting Guide](docs/SELF-HOSTING.md) for detailed instructions.

---

## 📦 Components

| Package | Description | Location |
|---------|-------------|----------|
| **@openbare/server** | Node.js bare server with metrics | [`/server`](./server) |
| **@openbare/client** | Client library with failover | [`/client`](./client) |
| **@openbare/edge** | Cloudflare Workers server | [`/edge`](./edge) |
| **@openbare/registry** | Node discovery service | [`/registry`](./registry) |

---

## 🔧 Configuration

### Environment Variables

```bash
# Node Identification
NODE_ID=my-bare-node          # Unique node ID
REGION=us-east                # Geographic region
NODE_URL=https://example.com  # Public URL

# Rate Limiting
RATE_LIMIT_MAX=100            # Requests per minute
RATE_LIMIT_WINDOW_MS=60000    # Window size

# Registry (Optional)
REGISTRY_URL=https://registry.openbare.dev

# Logging
LOG_LEVEL=info                # trace/debug/info/warn/error
```

See [`.env.example`](./server/.env.example) for all options.

---

## 📊 API Endpoints

Every OpenBare node exposes these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Server info and status |
| `/bare/` | * | Bare Server protocol |
| `/health` | GET | Health check (for load balancers) |
| `/status` | GET | Detailed metrics |
| `/info` | GET | Node information |

### Example Response: `GET /`

```json
{
  "status": "ok",
  "name": "OpenBare Server",
  "version": "1.0.0",
  "node_id": "us-east-abc123",
  "region": "us-east",
  "uptime_seconds": 86400,
  "requests_served": 150000,
  "healthy": true,
  "bare_endpoint": "/bare/"
}
```

---

## 📖 Documentation

- [**Architecture**](docs/ARCHITECTURE.md) - How OpenBare works
- [**Self-Hosting**](docs/SELF-HOSTING.md) - Deployment guide
- [**API Reference**](docs/API.md) - Full API documentation
- [**Client Usage**](client/README.md) - Client library guide

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repo
git clone https://github.com/nirholas/openbare.git
cd openbare

# Install all workspace dependencies
npm install

# Start server in dev mode
npm run dev:server

# Run tests
npm test
```

### Areas for Contribution

- 🌍 Run a public node
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit PRs

---

## 🔒 Security

OpenBare is designed with security in mind:

- **Rate limiting** prevents abuse
- **Helmet.js** sets security headers
- **No logging** of proxied content
- **Registry validation** prevents malicious nodes

Report security issues to: security@openbare.dev

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [TompHTTP](https://github.com/tomphttp) - Bare Server protocol
- [Ultraviolet](https://github.com/nickg4422/ultraviolet) - Web proxy framework
- [Titanium Network](https://titaniumnetwork.org/) - Proxy community

---

<div align="center">

**[⬆ Back to Top](#-openbare)**

Made with ❤️ by the OpenBare community

</div>
