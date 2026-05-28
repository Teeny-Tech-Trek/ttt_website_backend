// seed.js (Teeny Tech Trek)
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Business = require("../models/business.model");
const Service = require("../models/service.model");
const TrainingData = require("../models/trainingData.model");
const Topic = require("../models/topic.model");

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await Business.deleteMany();
    await Service.deleteMany();
    await TrainingData.deleteMany();
    await Topic.deleteMany();

    // Create a business
    const business = await Business.create({
      name: "Teeny Tech Trek",
      industry: "AI & Automation Services",
      description:
        "Teeny Tech Trek is a boutique AI solutions studio that helps small teams ship real outcomes fast. We build custom AI chatbots and virtual assistants, agentic workflows, smart process automations, and lightweight AI apps—prioritizing clarity over complexity and ‘Small Teams, Big Impact.’",
      contactEmail: "anisha.singla@teenytechtrek.com",
      phoneNumber: "+91 98558 06696 / +1 647-864-5465",
      address:
        "Remote-first\nChandigarh–Mohali, Punjab, India\nToronto, Ontario, Canada",
      profileCompletion: 92
    });

    // Create services
    await Service.insertMany([
      {
        name: "AI Chatbots & Virtual Assistants",
        description:
          "Context-aware GPT bots for support, onboarding, and internal knowledge. Integrations with websites, WhatsApp/voice, Slack, CRMs, and data sources. Guardrails, analytics, and handoff to human included.",
        startingPrice: 499,
        pricingUnit: "/month",
        category: "Standard",
        business: business._id
      },
      {
        name: "Agentic AI Workflows",
        description:
          "Autonomous agents (LangChain/CrewAI) that retrieve data, summarize, make decisions, and execute multi-step tasks across your tools (CRM, sheets, email, APIs).",
        startingPrice: 899,
        pricingUnit: "/month",
        category: "Enterprise",
        business: business._id
      },
      {
        name: "Smart Process Automation",
        description:
          "Automation pipelines that remove manual busywork—lead enrichment, CRM hygiene, alerts, reporting, and back-office syncing—using Python, APIs, Zapier, and Make.",
        startingPrice: 549,
        pricingUnit: "/month",
        category: "Premium",
        business: business._id
      },
      {
        name: "Lightweight AI Apps & Micro-SaaS",
        description:
          "Rapid MVPs and internal tools with Streamlit/FastAPI/Next.js. RAG knowledge assistants, dashboards, and micro-SaaS prototypes to validate fast and scale later.",
        startingPrice: 999,
        pricingUnit: "/month",
        category: "Enterprise",
        business: business._id
      }
    ]);

    // Create training data
    await TrainingData.create({
      keywords: [
        "AI agents",
        "agentic workflows",
        "RAG knowledge base",
        "WhatsApp chatbot",
        "voice concierge",
        "automation",
        "Zapier",
        "Make",
        "Python",
        "Streamlit",
        "FastAPI",
        "LangChain",
        "CrewAI",
        "vector database",
        "Pinecone",
        "FAISS",
        "CRM integration",
        "support deflection",
        "lead qualification",
        "India-first"
      ],
      commonQuestions: [
        "How does your 4-week pilot work?",
        "Can you integrate with our CRM and WhatsApp?",
        "What tech stack do you use for agents and RAG?",
        "How do you handle data security and privacy?",
        "What are your pricing options and timelines?"
      ],
      tone: "Confident, Clear & Friendly (India-first)",
      business: business._id
    });

    // Create topics/FAQs
    await Topic.insertMany([
      {
        name: "General Information",
        description: "About our company, mission, and coverage",
        type: "faq",
        faqs: [
          {
            question: "What does Teeny Tech Trek do?",
            answer:
              "We build custom AI chatbots, agentic workflows, automations, and lightweight apps that deliver measurable business outcomes for small, nimble teams."
          },
          {
            question: "Where do you operate?",
            answer:
              "We’re remote-first, serving clients across India, the Middle East, North America, and beyond."
          },
          {
            question: "What industries do you focus on?",
            answer:
              "We’re vertical-agnostic with strong traction in real estate, logistics, financial services, professional services, and D2C."
          },
          {
            question: "Typical delivery timelines?",
            answer:
              "We prefer 4-week pilots (two 14-day sprints) to prove value fast, then scale with ongoing improvements."
          }
        ],
        business: business._id
      },
      {
        name: "Services",
        description: "Questions about our AI services and capabilities",
        type: "faq",
        faqs: [
          {
            question: "What’s included in your AI Chatbots & Virtual Assistants?",
            answer:
              "Intent design, grounding/guardrails, integrations (site, WhatsApp/voice, Slack, CRM), analytics, and human handoff. We can add tools for lookups and actions."
          },
          {
            question: "What are Agentic AI Workflows?",
            answer:
              "Autonomous agents that research, retrieve data, summarize, decide, and execute tasks across your stack—e.g., lead enrichment → scoring → CRM update → alert."
          },
          {
            question: "Do you build RAG knowledge assistants?",
            answer:
              "Yes. We set up secure vector search over your docs, with citations and refusal rules for high trust."
          },
          {
            question: "Do you support voice and phone integrations?",
            answer:
              "Yes—voice IVR, call summaries, and voice bots are available through partnered telephony APIs."
          }
        ],
        business: business._id
      },
      {
        name: "Pricing & Engagement",
        description: "How we price, pilot, and scale",
        type: "faq",
        faqs: [
          {
            question: "Do you offer a pilot engagement?",
            answer:
              "Yes. Our 4-week pilot proves impact quickly. If it doesn’t move the needle, you can pause without long lock-ins."
          },
          {
            question: "What are your pricing models?",
            answer:
              "Fixed pilots, tiered monthly retainers for run/operate, and custom quotes for complex builds. All costs are transparent."
          },
          {
            question: "Any hidden fees?",
            answer:
              "No. Infra or third-party costs (e.g., model, vector DB, telephony) are itemized upfront."
          }
        ],
        business: business._id
      },
      {
        name: "Security & Compliance",
        description: "Data privacy, storage, and model policy",
        type: "faq",
        faqs: [
          {
            question: "How do you handle data security?",
            answer:
              "Least-privilege access, encrypted transport, and segregated environments. We avoid storing PII unless required and minimize data retention."
          },
          {
            question: "Where is data stored?",
            answer:
              "Your data stays within your chosen cloud/services. We prefer your tenants for vector DBs, storage, and logs."
          },
          {
            question: "Do you use our data to train public models?",
            answer:
              "No. Client data is not used to train public models. We can configure private fine-tuning where needed."
          },
          {
            question: "Will you sign an NDA?",
            answer:
              "Yes. We work under NDA and follow your compliance requirements."
          }
        ],
        business: business._id
      },
      {
        name: "Implementation & Support",
        description: "Rollout, handover, and SLAs",
        type: "faq",
        faqs: [
          {
            question: "What does handover include?",
            answer:
              "Architecture docs, prompt graphs/flows, environment variables, runbooks, and training for your team."
          },
          {
            question: "Do you offer ongoing support?",
            answer:
              "Yes—monitoring, drift checks, prompt/intent updates, and monthly improvements under a support SLA."
          },
          {
            question: "Can you work inside our repos and infra?",
            answer:
              "Yes. We can build in your GitHub, cloud, and CI/CD for full ownership on your side."
          }
        ],
        business: business._id
      }
    ]);

    console.log("✅ All data seeded successfully for Teeny Tech Trek!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
