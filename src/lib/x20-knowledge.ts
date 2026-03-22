// X20AI knowledge base for simulated AI responses

export const X20_INFO = {
  company: "x20ai",
  tagline: "Production-ready AI agents that automate real business tasks",
  deployTime: "3-7 business days",
  price: "€1,499",
  rating: "4.9/5 stars across 47 reviews",
  timeSaved: "40+ hours/month",
  uptime: "99.9%",
  languages: "50+ languages with automatic detection",
  location: "Alicante, Spain",
  agents: ["Voice Agents", "WhatsApp Agents", "Chatbots", "Knowledge Management", "Phone Conversation Handling"],
  integrations: {
    crm: ["GoHighLevel", "HubSpot", "Salesforce", "Pipedrive", "Reapit"],
    communication: ["Twilio", "WhatsApp", "Instagram", "Facebook", "Telnyx"],
    automation: ["n8n", "Make", "Zapier"],
    calendars: ["Google Calendar", "Calendly"],
    data: ["Airtable", "Google Sheets", "Supabase"],
    payments: ["Stripe"],
  },
  features: [
    "Enterprise Infrastructure with 99.9% uptime SLA",
    "Rich integrations with CRMs, ERPs, WhatsApp, Slack, websites",
    "Multilingual - 50+ languages with auto detection",
    "GDPR-ready with encrypted data storage",
    "Real-time dashboards for performance monitoring",
  ],
  stats: {
    questionsHandled: "85%",
    avgResponseTime: "<2 seconds",
    simultaneousCalls: "Unlimited",
  },
};

// Voice AI conversation script
export const VOICE_CONVERSATION: Array<{
  speaker: "caller" | "agent";
  text: string;
  delay: number;
}> = [
  { speaker: "agent", text: "Thank you for calling x20ai. My name is Eva, your AI assistant. How can I help you today?", delay: 1500 },
  { speaker: "caller", text: "Hi, I'm interested in automating my customer service. Can you tell me about your AI agents?", delay: 3000 },
  { speaker: "agent", text: "Absolutely! At x20ai, we build production-ready AI agents that handle real business tasks. We offer voice agents, WhatsApp agents, and chatbots - all deployed in just 3 to 7 business days.", delay: 4500 },
  { speaker: "caller", text: "That's fast. What kind of tasks can they handle?", delay: 2500 },
  { speaker: "agent", text: "Our agents handle customer inquiries, appointment scheduling, lead qualification, knowledge management, and phone conversations. On average, they handle 85% of questions fully automatically with under 2-second response times.", delay: 5000 },
  { speaker: "caller", text: "Impressive. What CRM systems do you integrate with?", delay: 2500 },
  { speaker: "agent", text: "We integrate with all major CRMs including GoHighLevel, HubSpot, Salesforce, Pipedrive, and Reapit. Plus automation tools like n8n, Make, and Zapier. We also connect with WhatsApp, Instagram, Facebook, and more.", delay: 5500 },
  { speaker: "caller", text: "How much does it cost?", delay: 2000 },
  { speaker: "agent", text: "Our AI agent platform starts at just 1,499 euros. This includes configuration, training on your specific data, deployment, and ongoing support. Most clients save over 40 hours per month, which pays for itself very quickly.", delay: 5500 },
  { speaker: "caller", text: "And security? We handle sensitive customer data.", delay: 2500 },
  { speaker: "agent", text: "Great question. We're fully GDPR-compliant with encrypted data storage and access controls. Our infrastructure runs on enterprise-grade cloud with a 99.9% uptime SLA. Security is built into everything we do.", delay: 5000 },
  { speaker: "caller", text: "This sounds exactly what we need. Can we schedule a demo?", delay: 2500 },
  { speaker: "agent", text: "I'd love to set that up for you! I can book you in with one of our specialists. We'll walk you through the platform and show you exactly how the agents would work for your specific business. What day works best for you?", delay: 5500 },
  { speaker: "caller", text: "How about Thursday afternoon?", delay: 2000 },
  { speaker: "agent", text: "Perfect, I've got Thursday afternoon available. I'll send you a calendar invite with a meeting link. Is there anything else I can help you with today?", delay: 4000 },
  { speaker: "caller", text: "No, that's everything. Thanks Eva!", delay: 2000 },
  { speaker: "agent", text: "You're welcome! Looking forward to showing you what x20ai can do for your business. Have a great day!", delay: 3500 },
];

// Chat AI conversation responses
export const CHAT_RESPONSES: Record<string, string> = {
  default: "Thanks for your interest in x20ai! We build production-ready AI agents for voice, WhatsApp, and chat - deployed in 3-7 business days. What would you like to know more about?",
  greeting: "Hey there! Welcome to x20ai. I'm your AI assistant. I can tell you about our voice agents, WhatsApp automation, chatbots, pricing, integrations, or anything else. What are you curious about?",
  pricing: "Our AI agent platform starts at €1,499. This includes full configuration, training on your business data, deployment, and ongoing support. Most clients save 40+ hours per month - the ROI is typically very fast. Want me to break down what's included?",
  integrations: "We integrate with a wide range of tools:\n\n**CRM:** GoHighLevel, HubSpot, Salesforce, Pipedrive, Reapit\n**Communication:** Twilio, WhatsApp, Instagram, Facebook, Telnyx\n**Automation:** n8n, Make, Zapier\n**Calendars:** Google Calendar, Calendly\n**Data:** Airtable, Google Sheets, Supabase\n**Payments:** Stripe\n\nPlus custom REST APIs on request!",
  voice: "Our Voice AI agents handle inbound and outbound calls 24/7. They can qualify leads, book appointments, answer FAQs, and handle multiple calls simultaneously. Average response time is under 2 seconds, and they speak 50+ languages with automatic detection. It's like having a perfect receptionist that never sleeps!",
  whatsapp: "Our WhatsApp agents automate customer conversations on the world's most popular messaging platform. They handle inquiries, send updates, qualify leads, and book appointments - all with natural, human-like responses. Combined with our CRM integrations, every conversation feeds directly into your sales pipeline.",
  chatbot: "Our chatbots can be deployed on your website, app, or any messaging platform. They're trained on your specific business data and handle 85% of customer questions fully automatically. Smart enough to know when to escalate to a human, fast enough to keep customers happy.",
  security: "Security is core to everything we build:\n\n- GDPR-compliant with encrypted data storage\n- Enterprise-grade cloud infrastructure\n- 99.9% uptime SLA\n- Role-based access controls\n- Regular security audits\n- Data processing agreements available\n\nYour customers' data is safe with us.",
  setup: "Getting started is simple - three steps:\n\n1. **Upload your knowledge** - Share documents, connect your CRM, link your tools\n2. **We configure & train** - Our team sets up, trains, and tests the agent on your data\n3. **Go live** - Agent deploys and starts automating immediately\n\nThe whole process takes just 3-7 business days. No technical expertise needed on your end!",
  languages: "Our agents support 50+ languages with automatic language detection. Whether your customers speak English, Spanish, Dutch, German, French, Arabic, Chinese, or any other major language - the agent adapts automatically. Perfect for international businesses!",
  demo: "I'd love to arrange a demo for you! Our specialists will walk you through the platform and show exactly how our AI agents would work for your specific business case. You can book directly through our website at x20ai.com, or I can have someone reach out to you. What works best?",
  results: "Here's what our clients typically see:\n\n- **40+ hours saved** per month on repetitive tasks\n- **85% of questions** handled fully automatically\n- **<2 second** average response time, 24/7\n- **Zero missed leads** - unlimited simultaneous conversations\n- **Scales infinitely** without extra staff\n\nAll backed by our 4.9/5 rating across 47 reviews!",
};

export function getMatchedResponse(input: string): string {
  const lower = input.toLowerCase();
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|hola)/i.test(lower)) return CHAT_RESPONSES.greeting;
  if (/pric|cost|how much|euro|€|package|plan/i.test(lower)) return CHAT_RESPONSES.pricing;
  if (/integrat|crm|connect|hubspot|salesforce|zapier|n8n|make|tool/i.test(lower)) return CHAT_RESPONSES.integrations;
  if (/voice|call|phone|inbound|outbound|receptionist/i.test(lower)) return CHAT_RESPONSES.voice;
  if (/whatsapp|messaging|message/i.test(lower)) return CHAT_RESPONSES.whatsapp;
  if (/chat|chatbot|website|widget/i.test(lower)) return CHAT_RESPONSES.chatbot;
  if (/secur|gdpr|complian|encrypt|safe|privacy/i.test(lower)) return CHAT_RESPONSES.security;
  if (/setup|start|deploy|onboard|how.*(work|begin|get)/i.test(lower)) return CHAT_RESPONSES.setup;
  if (/language|multilingual|dutch|spanish|german|french/i.test(lower)) return CHAT_RESPONSES.languages;
  if (/demo|trial|test|try|see|show/i.test(lower)) return CHAT_RESPONSES.demo;
  if (/result|roi|save|stat|performance|benefit/i.test(lower)) return CHAT_RESPONSES.results;
  return CHAT_RESPONSES.default;
}
