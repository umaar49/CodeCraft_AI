# CodeCraft AI 🚀

An autonomous, multi-agent application development platform that leverages **LangGraph** and Generative AI to transform natural language prompts into fully functional, production-ready web applications. This project demonstrates a sophisticated "Plan-Architect-Code" workflow, moving beyond simple code snippets to complete, multi-file software engineering.

---

## 🚀 Deployment

- **Backend:** Engineered with **FastAPI** and orchestrated using **LangGraph** for stateful multi-step reasoning.
- **Hosting:** Containerized with **Docker** and deployed on **Hugging Face Spaces** .
- **LLM Agnostic:** Supports a multi-model strategy including **Llama-3.3-70b**, **Qwen**, and **GPT** to provide varying levels of engineering depth.
- **Frontend:** Integrated real-time preview environment allowing users to view and interact with generated code instantly via **FastAPI StaticFiles**.

---

## 💡 Importance of the Project

- **Rapid Prototyping:** In modern software development, speed-to-market is everything. CodeCraft AI reduces the time from idea to functional prototype from hours to seconds.
- **Architectural Sophistication:** Unlike standard LLM chats, this system utilizes a stateful architecture that maintains a persistent "Project Root" memory, allowing agents to understand file dependencies and system integration.
- **Model Benchmarking:** The project highlights the performance gap between models, proving that while small models work for prototyping, high-tier LLMs produce outstanding, production-grade results.
- **Zero-Config Deployment:** By using Docker and automated project resetting, the system provides a "Clean Boot" environment for every new application request.

---

## 🧠 The Agentic Pipeline

CodeCraft AI utilizes a sequential and stateful architectural pattern managed by LangGraph to ensure software integrity:

### 1. The Planner (Product Manager)
- **Purpose:** Feature scoping and roadmap generation.
- **How it works:** This node analyzes the user's intent to define the app's tech stack (Tailwind, JS, etc.) and core features. It creates a high-level **Plan** that ensures the UI is modern, responsive, and functional before any code is written.

### 2. The Architecture Agent (System Designer)
- **Purpose:** File structuring and task breakdown.
- **How it works:** The Architect takes the Plan and maps it to a specific file structure (e.g., `index.html`, `app.js`). It creates explicit engineering tasks for each file, defining variable names, function signatures, and how different components will interact.

### 3. The Coder Agent (Lead Engineer)
- **Purpose:** Implementation and File I/O.
- **How it works:** Operating in a loop, the Coder implements each task defined by the Architect. It writes 100% complete, bug-free code wrapped in specific tags for extraction. It manages the **Project Root**, writing files directly to the directory and ensuring the final output is a cohesive, working application.

---

## 🛠️ Technical Stack

### Backend
- **Orchestration:** LangGraph (Stateful Agent Workflows)
- **Framework:** FastAPI (Python)
- **Models:** Llama-3.3-70b (Groq), Qwen-2.5, GPT-4o
- **Throttling:** `InMemoryRateLimiter` (Managing API throughput and RPM limits)
- **Logic:** Pydantic V2 (Structured Data Validation & Schema Enforcement)
- **Environment:** Docker (Debian-slim / Python 3.10)

### Frontend & Preview
- **Framework:** react.js
- **Styling:** Tailwind CSS (via CDN for instant generation)
- **Preview:** FastAPI StaticFiles mounting for real-time app interaction
- **Components:** Google Fonts integration (Inter/Poppins), Hero Icons, and Responsive Grid Layouts

---

## 🎓 Acknowledgments & Disclaimer

- **Educational Purpose:** Developed as a showcase for building autonomous software engineering agents and managing complex state in AI pipelines.
- **Expertise:** This project bridges the gap between high-level Software Engineering and resource-constrained system design.
- **Reliability:** Built with a "Hardware Reset" mindset—every build triggers a full directory wipe and state refresh to ensure zero contamination between projects.

---

## Live Demo

- https://code-craft-ai-sp1x.vercel.app/

