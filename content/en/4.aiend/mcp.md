---
title: Model Context Protocol (MCP)
description: The Model Context Protocol (MCP) is an open standard introduced by Anthropic to standardize how AI interacts with external systems—like a universal translator for large language models.
icon: 'lucide:git-fork'
gitTalk: false
date: 2025-03-22T10:30:00+08:00
read: '13'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

Imagine you have an AI application that understands natural language—but it struggles to interact directly with real-world systems and data. There's always a delay, and it feels kind of "laggy and clunky."

The Model Context Protocol (MCP) acts like a "universal translator" for AI, enabling communication between models and the external world—across many languages, tools, and systems.

## What is MCP? From Transport Hubs to Global Diplomacy

Think of a busy international airport where each gate leads to a different country, each speaking its own language. Without translators, you'd need to learn a new language for every destination—just like traditional AI integrations. But what if there were a centralized translation hub at the airport? No matter where you’re headed, you’d get instant translation. Convenient, right?

That’s what MCP does—but for AI models. It functions like the "United Nations translation system" of the AI world, allowing assistants to communicate smoothly with external systems and data sources.

:::alert{type="info" icon="lucide:info"}
MCP is like a “USB-C port” for AI applications, providing a universal interface to connect models with various tools and data sources.
:::

![MCP Concept Diagram](/images/ai/mcp.png)

Launched by Anthropic in November 2024, MCP is an open-source protocol that aims to standardize how applications provide context to large language models.

### Solving the "Multilingual Diplomacy" Problem

In the early days of global trade, ten countries speaking different languages needed 45 translation pairings to communicate (10×9÷2). Similarly, in AI integrations, with M models and N tools, you need M×N integration combinations.

MCP changes that by introducing a “universal language.” Each model or tool only needs to learn one protocol to interact with everything else, reducing the complexity from M×N to M+N.

```

# Traditional Integration (M×N combinations)

AI Model 1 <--> Tool 1 (custom)
AI Model 1 <--> Tool 2 (custom)
AI Model 2 <--> Tool 1 (custom)
...

# MCP Integration (M+N combinations)

AI Model 1 --> MCP <-- Tool 1
AI Model 2 --> MCP <-- Tool 2
...

```

## MCP Origins: From LSP to AI Interoperability

MCP draws inspiration from the Language Server Protocol (LSP), which standardized communication between code editors and programming language tools.

Imagine you're running a restaurant. Every time you hire a new chef (AI model), you also need to teach them how to contact each supplier (tool). The success of LSP inspired Anthropic to build a standardized “kitchen communication protocol” so that all chefs could communicate with all suppliers seamlessly.

In late November 2024, Anthropic released MCP as an open protocol to empower developers, speed up growth, and promote a thriving ecosystem of shared connectors—enabling richer AI behavior across domains.

## MCP Architecture: The Café Model

MCP uses a client-server architecture, similar to how a boutique café operates:

![MCP Architecture](/images/ai/mcp-chart.png)

- **MCP Client** (like the café front desk):
  - Part of a client-side application (e.g., Claude Desktop, IDEs, or AI tools)
  - Accepts coffee orders (queries) from customers (users)
  - Communicates with the kitchen (server) to fulfill requests
  - Safely delivers the final drink (results) back to the customer

- **MCP Server** (like the barista and kitchen equipment):
  - An independent external process providing specific capabilities
  - Connected to data sources (coffee beans, milk, spices)
  - Executes operations requested by the client and returns results

This separation of concerns allows the front desk to focus on user interaction while the kitchen specializes in making great coffee. In MCP, the client handles LLM interaction, while the server manages external resources.

## Core MCP Components: Kitchen Tools & Ingredients

Like a kitchen full of tools and ingredients for making gourmet meals, MCP has key elements that enable AI interaction with the outside world:

### Server-Side Components (Chef’s Toolbox)

1. **Tools**
   - Like knives, pans, and mixers—tools for preparing ingredients
   - Executable functions provided by the server (e.g., DB queries, web search)
   - Called by the model to perform tasks like a chef using kitchen tools

2. **Resources**
   - Like fresh ingredients and spices—provide the base for meals
   - Structured data that the server sends (e.g., code snippets, document chunks)
   - Enriches model context like ingredients enhance a dish

3. **Prompts**
   - Like recipe cards or culinary guides
   - Prewritten instructions or templates that guide model responses
   - Ensures consistent, high-quality outputs

:::alert{type="success" icon="lucide:chef-hat"}
Imagine the MCP server as a master chef with tools (Tool), fresh ingredients (Resource), and signature recipes (Prompt) ready to prepare custom dishes for every guest.
:::

### Client-Side Components (Restaurant Management)

1. **Roots**
   - Like access zones in a restaurant—who can enter where
   - Define where a server is authorized to operate
   - Protect sensitive data by scoping access

2. **Sampling**
   - Like a chef asking the manager for special ingredient access or cooking advice
   - Allows the server to request completions from the client LLM
   - Client maintains control over privacy, cost, and LLM selection

## MCP Communication Flow: From Ordering to Serving

When a user asks a question requiring external data, the MCP flow is like dining at a fine restaurant:

```

1. Customer (user) places an order (query) with the waiter (MCP client)
2. Waiter asks the kitchen (server) about available menu options (tools)
3. Chef (AI model) reviews available ingredients and specialties
4. Waiter relays the customer’s request to the chef
5. Chef analyzes the request and plans which tools and techniques to use
6. Waiter sends prep requests to kitchen stations (server tools)
7. Stations prepare their components and return them to the waiter
8. Waiter delivers components to the chef for final assembly
9. Chef finishes the dish, and the waiter serves it to the customer

````

![MCP Flow](/images/ai/mcp-chart-2.png)

This multi-step process ensures the AI can safely and effectively interact with external data and tools—just like a restaurant ensures an exceptional dining experience.

## Real-World Use Cases

MCP is already proving useful in real applications. Think of it as opening new doors for AI in every industry:

- **Smart Customer Support**: Like a concierge with full access to client profiles, order history, and product catalogs
- **AI Financial Advisors**: Aggregate transactions, track spending, and provide insights across accounts and investment tools
- **Code Assistants**: Interact with IDEs to read, refactor, and optimize code like a seasoned architect

:::alert{to="https://modelcontextprotocol.io/examples" target="_blank" icon="lucide:github"}
  Curious to see MCP in action? Check out Anthropic’s official examples—like watching an open kitchen prepare your favorite dish.
:::

## How to Build an MCP Server: Opening Your Own Kitchen

Want to cook for AI? Here’s how to set up your own MCP server:

### 1. Set Up Your Kitchen (Environment)

```bash
pip install mcp[cli]
mkdir my-mcp-server
cd my-mcp-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
````

### 2. Build the Menu (Server Tools)

```python
from mcp.server import FastMCP

app = FastMCP()

@app.tool()
def search_knowledge_base(query: str, limit: int = 10):
    """
    Search a knowledge base and return matches (like a chef finding recipes).
    """
    return ["Result 1", "Result 2", "Result 3"]
```

### 3. Choose Communication Mode

MCP supports two main transport methods:

* **Stdio** – Like direct voice in the kitchen (good for local integration)
* **HTTP & SSE** – Like digital ordering systems (good for remote)

## Multilingual Support: International Culinary Art

MCP supports multiple programming languages:

* **Python** – Like French cuisine: elegant and popular
* **TypeScript** – Like modern fusion: flexible and fast
* **Java** – Like Italian classics: structured and reliable
* **Kotlin** – Like a modern Italian twist: elegant and practical
* **Others** – Any language that can “cook” (handle I/O) can join

## The Future of Context-Aware AI

MCP is more than a protocol—it’s a bridge between AI and the real world.

In the near future, we may see:

* A wide variety of "dishes" (MCP tools) emerge
* AI platforms speaking a shared protocol (MCP)
* Richer “culinary performances” (agent workflows)
* A vibrant “recipe-sharing” developer community

MCP opens the door to a world where AI truly understands and engages—like a world-class chef mastering both the ingredients and the needs of the customer.

## References

* [Anthropic Model Context Protocol](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
* [Building with MCP](https://www.anthropic.com/news/model-context-protocol)
* [MCP Technical Docs](https://github.com/anthropics/model-context-protocol)
* [MCP Overview & Impact (W\&B)](https://wandb.ai/onlineinference/mcp/reports/The-Model-Context-Protocol-MCP-by-Anthropic-Origins-functionality-and-impact--VmlldzoxMTY5NDI4MQ)
* [WorkOS Blog on MCP](https://workos.com/blog/model-context-protocol)
* [Explainer: MCP vs. API](https://norahsakal.com/blog/mcp-vs-api-model-context-protocol-explained/)
* [Full Protocol Draft](https://docs.google.com/document/d/1VdFB2jKe5YhYCDfU7SBnj2GZ81kz1adNzNlzdLayw0s/edit?usp=drive_link)

