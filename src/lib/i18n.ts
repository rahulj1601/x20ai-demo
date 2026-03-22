// x20ai Demo - Internationalization (i18n)
// Languages: English (en), Dutch (nl), Spanish (es)

export type Locale = "en" | "nl" | "es";

export type TranslationSet = {
  nav: {
    home: string;
    voiceAi: string;
    textAi: string;
    dashboard: string;
    getStarted: string;
  };
  home: {
    badge: string;
    heroTitle: string;
    heroTitleAccent: string;
    heroTitleEnd: string;
    subtitle: string;
    tryVoiceDemo: string;
    tryTextDemo: string;
    stats: {
      hoursSaved: string;
      autoResolved: string;
      responseTime: string;
      uptimeSla: string;
    };
    chooseDemo: string;
    chooseDemoSubtitle: string;
    demoCards: {
      voiceTitle: string;
      voiceDescription: string;
      voiceTag: string;
      textTitle: string;
      textDescription: string;
      textTag: string;
      dashboardTitle: string;
      dashboardDescription: string;
      dashboardTag: string;
    };
    launchDemo: string;
    integrationsLabel: string;
  };
  voice: {
    badge: string;
    pageTitle: string;
    subtitle: string;
    startCall: string;
    endCall: string;
    newCall: string;
    ringing: string;
    connectingTo: string;
    voiceAgent: string;
    connected: string;
    callEnded: string;
    callComplete: string;
    duration: string;
    readyToTakeCalls: string;
    pressButtonToStart: string;
    liveTranscript: string;
    recording: string;
    transcriptWillAppear: string;
    connecting: string;
    messages: string;
    sentiment: string;
    positive: string;
    callerSpeaking: string;
    agentSpeaking: string;
    listening: string;
    caller: string;
    aiAgent: string;
  };
  chat: {
    badge: string;
    pageTitle: string;
    subtitle: string;
    assistantName: string;
    online: string;
    typePlaceholder: string;
    welcomeMessage: string;
    suggestions: string[];
  };
  dashboard: {
    badge: string;
    pageTitle: string;
    subtitle: string;
    totalCalls: string;
    messagesHandled: string;
    autoResolved: string;
    satisfaction: string;
    conversationVolume: string;
    conversationVolumeSubtitle: string;
    thisPeriod: string;
    channelDistribution: string;
    liveConversations: string;
    avgResponseTime: string;
    liveConversationsTitle: string;
    recentActivity: string;
    roiSummary: string;
    roiSubtitle: string;
    timeSaved: string;
    costSaved: string;
    roiMultiple: string;
    statusActive: string;
    statusResolved: string;
    statusQueued: string;
    conversations: Array<{
      name: string;
      channel: string;
      status: string;
      duration: string;
      topic: string;
    }>;
    activities: Array<{
      label: string;
      value: string;
      time: string;
      status: "success" | "info" | "warning";
    }>;
  };
  chatResponses: Record<string, string>;
  footer: {
    copyright: string;
    visitSite: string;
    description: string;
  };
  common: {
    allSystemsOperational: string;
    last30Days: string;
    live: string;
    languageLabel: string;
  };
};

export const translations: Record<Locale, TranslationSet> = {
  // ─────────────────────────────────────────────
  // ENGLISH
  // ─────────────────────────────────────────────
  en: {
    nav: {
      home: "Home",
      voiceAi: "Voice AI",
      textAi: "Text AI",
      dashboard: "Dashboard",
      getStarted: "Get Started",
    },
    home: {
      badge: "Interactive AI Agent Demos",
      heroTitle: "Experience ",
      heroTitleAccent: "x20ai",
      heroTitleEnd: " agents in action",
      subtitle:
        "See how production-ready AI agents handle voice calls, text conversations, and deliver real-time analytics. Live in 3-7 business days.",
      tryVoiceDemo: "Try Voice Demo",
      tryTextDemo: "Try Text Demo",
      stats: {
        hoursSaved: "Hours saved/month",
        autoResolved: "Auto-resolved",
        responseTime: "Response time",
        uptimeSla: "Uptime SLA",
      },
      chooseDemo: "Choose a Demo",
      chooseDemoSubtitle:
        "Each demo is a fully simulated experience showing how x20ai agents work in production.",
      demoCards: {
        voiceTitle: "Voice AI Agent",
        voiceDescription:
          "Experience a live simulated phone call with our AI voice agent. Watch real-time transcripts as the agent handles inquiries, qualifies leads, and books appointments.",
        voiceTag: "Live Simulation",
        textTitle: "Text AI Agent",
        textDescription:
          "Chat with our WhatsApp-style AI agent in real time. Ask about services, pricing, integrations - trained on all of x20ai's knowledge base.",
        textTag: "Interactive Chat",
        dashboardTitle: "Analytics Dashboard",
        dashboardDescription:
          "See real-time performance metrics, conversation analytics, and ROI tracking. Animated data visualizations show what managing AI agents looks like.",
        dashboardTag: "Live Metrics",
      },
      launchDemo: "Launch Demo",
      integrationsLabel: "Plugs into what you already use",
    },
    voice: {
      badge: "Voice AI Demo",
      pageTitle: "Live Voice Agent Simulation",
      subtitle: "Watch Eva, x20ai's voice agent, handle a real sales inquiry call",
      startCall: "Start Call",
      endCall: "End Call",
      newCall: "Start New Call",
      ringing: "Ringing...",
      connectingTo: "Connecting to Eva...",
      voiceAgent: "x20ai Voice Agent",
      connected: "Connected",
      callEnded: "Call ended",
      callComplete: "Call Complete",
      duration: "Duration",
      readyToTakeCalls: "Ready to take calls",
      pressButtonToStart: "Press the button to start a simulated call",
      liveTranscript: "Live Transcript",
      recording: "Recording",
      transcriptWillAppear: "Transcript will appear here when the call starts",
      connecting: "Connecting...",
      messages: "Messages",
      sentiment: "Sentiment",
      positive: "Positive",
      callerSpeaking: "Caller is speaking...",
      agentSpeaking: "Eva is speaking...",
      listening: "Listening...",
      caller: "Caller",
      aiAgent: "Eva (AI Agent)",
    },
    chat: {
      badge: "Text AI Demo",
      pageTitle: "Chat with x20ai's Text Agent",
      subtitle: "Ask anything about x20ai's services, pricing, or integrations",
      assistantName: "x20ai Assistant",
      online: "Online",
      typePlaceholder: "Type a message...",
      welcomeMessage:
        "Hey! I'm the x20ai assistant. I can answer questions about our AI agents, pricing, integrations, and more. What would you like to know?",
      suggestions: [
        "What services do you offer?",
        "How much does it cost?",
        "What integrations do you support?",
        "How does setup work?",
        "Tell me about voice agents",
        "Is it GDPR compliant?",
      ],
    },
    dashboard: {
      badge: "Dashboard Demo",
      pageTitle: "Agent Performance",
      subtitle: "Real-time metrics across all x20ai agents",
      totalCalls: "Total Calls",
      messagesHandled: "Messages Handled",
      autoResolved: "Auto-Resolved",
      satisfaction: "Satisfaction",
      conversationVolume: "Conversation Volume",
      conversationVolumeSubtitle: "Daily conversations across all channels",
      thisPeriod: "This period",
      channelDistribution: "Channel Distribution",
      liveConversations: "Live conversations",
      avgResponseTime: "Avg response time",
      liveConversationsTitle: "Live Conversations",
      recentActivity: "Recent Activity",
      roiSummary: "ROI Summary",
      roiSubtitle: "Based on 30-day agent performance",
      timeSaved: "Time Saved",
      costSaved: "Cost Saved",
      roiMultiple: "ROI Multiple",
      statusActive: "Active",
      statusResolved: "Resolved",
      statusQueued: "Queued",
      conversations: [
        { name: "Maria S.", channel: "WhatsApp", status: "Active", duration: "2m 14s", topic: "Pricing inquiry" },
        { name: "Thomas K.", channel: "Voice", status: "Active", duration: "4m 32s", topic: "Integration setup" },
        { name: "Anna P.", channel: "Chatbot", status: "Resolved", duration: "1m 45s", topic: "GDPR compliance" },
        { name: "Jan de V.", channel: "WhatsApp", status: "Active", duration: "0m 58s", topic: "Demo request" },
        { name: "Carlos R.", channel: "Voice", status: "Queued", duration: "0m 12s", topic: "Technical support" },
        { name: "Sophie L.", channel: "Chatbot", status: "Resolved", duration: "3m 21s", topic: "Onboarding help" },
      ],
      activities: [
        { label: "Voice agent resolved billing inquiry", value: "Customer: Thomas K. - Duration: 3m 12s", time: "2m ago", status: "success" },
        { label: "WhatsApp lead qualified and appointment booked", value: "Lead: Maria S. - Booked for Thursday 2pm", time: "5m ago", status: "success" },
        { label: "New integration connected: HubSpot CRM", value: "Auto-sync enabled for contacts and deals", time: "12m ago", status: "info" },
        { label: "Chatbot escalated to human agent", value: "Complex technical query - Ticket #4821", time: "18m ago", status: "warning" },
        { label: "Voice agent handled 3 simultaneous calls", value: "All resolved - Avg duration: 2m 45s", time: "25m ago", status: "success" },
        { label: "Daily report generated", value: "847 conversations, 97% satisfaction score", time: "1h ago", status: "info" },
        { label: "WhatsApp campaign completed", value: "1,200 messages sent - 68% open rate", time: "2h ago", status: "success" },
      ],
    },
    chatResponses: {
      default:
        "Thanks for your interest in x20ai! We build production-ready AI agents for voice, WhatsApp, and chat - deployed in 3-7 business days. What would you like to know more about?",
      greeting:
        "Hey there! Welcome to x20ai. I'm your AI assistant. I can tell you about our voice agents, WhatsApp automation, chatbots, pricing, integrations, or anything else. What are you curious about?",
      pricing:
        "Our AI agent platform starts at \u20ac1,499. This includes full configuration, training on your business data, deployment, and ongoing support. Most clients save 40+ hours per month - the ROI is typically very fast. Want me to break down what's included?",
      integrations:
        "We integrate with a wide range of tools:\n\n**CRM:** GoHighLevel, HubSpot, Salesforce, Pipedrive, Reapit\n**Communication:** Twilio, WhatsApp, Instagram, Facebook, Telnyx\n**Automation:** n8n, Make, Zapier\n**Calendars:** Google Calendar, Calendly\n**Data:** Airtable, Google Sheets, Supabase\n**Payments:** Stripe\n\nPlus custom REST APIs on request!",
      voice:
        "Our Voice AI agents handle inbound and outbound calls 24/7. They can qualify leads, book appointments, answer FAQs, and handle multiple calls simultaneously. Average response time is under 2 seconds, and they speak 50+ languages with automatic detection. It's like having a perfect receptionist that never sleeps!",
      whatsapp:
        "Our WhatsApp agents automate customer conversations on the world's most popular messaging platform. They handle inquiries, send updates, qualify leads, and book appointments - all with natural, human-like responses. Combined with our CRM integrations, every conversation feeds directly into your sales pipeline.",
      chatbot:
        "Our chatbots can be deployed on your website, app, or any messaging platform. They're trained on your specific business data and handle 85% of customer questions fully automatically. Smart enough to know when to escalate to a human, fast enough to keep customers happy.",
      security:
        "Security is core to everything we build:\n\n- GDPR-compliant with encrypted data storage\n- Enterprise-grade cloud infrastructure\n- 99.9% uptime SLA\n- Role-based access controls\n- Regular security audits\n- Data processing agreements available\n\nYour customers' data is safe with us.",
      setup:
        "Getting started is simple - three steps:\n\n1. **Upload your knowledge** - Share documents, connect your CRM, link your tools\n2. **We configure & train** - Our team sets up, trains, and tests the agent on your data\n3. **Go live** - Agent deploys and starts automating immediately\n\nThe whole process takes just 3-7 business days. No technical expertise needed on your end!",
      languages:
        "Our agents support 50+ languages with automatic language detection. Whether your customers speak English, Spanish, Dutch, German, French, Arabic, Chinese, or any other major language - the agent adapts automatically. Perfect for international businesses!",
      demo:
        "I'd love to arrange a demo for you! Our specialists will walk you through the platform and show exactly how our AI agents would work for your specific business case. You can book directly through our website at x20ai.com, or I can have someone reach out to you. What works best?",
      results:
        "Here's what our clients typically see:\n\n- **40+ hours saved** per month on repetitive tasks\n- **85% of questions** handled fully automatically\n- **<2 second** average response time, 24/7\n- **Zero missed leads** - unlimited simultaneous conversations\n- **Scales infinitely** without extra staff\n\nAll backed by our 4.9/5 rating across 47 reviews!",
    },
    footer: {
      copyright: "\u00a9 2026 x20ai. Demo experience.",
      visitSite: "Visit x20ai.com",
      description: "Production-ready AI agents that automate real business tasks. From knowledge management to phone calls - deployed in days, not months.",
    },
    common: {
      allSystemsOperational: "All systems operational",
      last30Days: "Last 30 days",
      live: "Live",
      languageLabel: "Language",
    },
  },

  // ─────────────────────────────────────────────
  // DUTCH
  // ─────────────────────────────────────────────
  nl: {
    nav: {
      home: "Home",
      voiceAi: "Spraak AI",
      textAi: "Tekst AI",
      dashboard: "Dashboard",
      getStarted: "Aan de slag",
    },
    home: {
      badge: "Interactieve AI-agent demo's",
      heroTitle: "Ervaar ",
      heroTitleAccent: "x20ai",
      heroTitleEnd: " agents in actie",
      subtitle:
        "Ontdek hoe productieklare AI-agents telefoongesprekken voeren, chats afhandelen en realtime analyses leveren. Binnen 3-7 werkdagen live.",
      tryVoiceDemo: "Probeer spraakdemo",
      tryTextDemo: "Probeer tekstdemo",
      stats: {
        hoursSaved: "Uren bespaard/maand",
        autoResolved: "Automatisch opgelost",
        responseTime: "Reactietijd",
        uptimeSla: "Uptime SLA",
      },
      chooseDemo: "Kies een demo",
      chooseDemoSubtitle:
        "Elke demo is een volledig gesimuleerde ervaring die laat zien hoe x20ai-agents in de praktijk werken.",
      demoCards: {
        voiceTitle: "Spraak AI-agent",
        voiceDescription:
          "Beleef een live gesimuleerd telefoongesprek met onze AI-spraakagent. Volg het realtime transcript terwijl de agent vragen beantwoordt, leads kwalificeert en afspraken inplant.",
        voiceTag: "Live simulatie",
        textTitle: "Tekst AI-agent",
        textDescription:
          "Chat in realtime met onze WhatsApp-achtige AI-agent. Stel vragen over diensten, prijzen en integraties - getraind op de volledige kennisbank van x20ai.",
        textTag: "Interactieve chat",
        dashboardTitle: "Analyse dashboard",
        dashboardDescription:
          "Bekijk realtime prestatiemetrics, gespreksanalyses en ROI-tracking. Geanimeerde datavisualisaties laten zien hoe het beheer van AI-agents eruitziet.",
        dashboardTag: "Live metrics",
      },
      launchDemo: "Start demo",
      integrationsLabel: "Sluit aan op wat je al gebruikt",
    },
    voice: {
      badge: "Spraak AI demo",
      pageTitle: "Live spraakagent simulatie",
      subtitle: "Bekijk hoe Eva, de spraakagent van x20ai, een verkoopgesprek voert",
      startCall: "Bel starten",
      endCall: "Gesprek beëindigen",
      newCall: "Nieuw gesprek",
      ringing: "Gaat over...",
      connectingTo: "Verbinden met Eva...",
      voiceAgent: "x20ai Spraakagent",
      connected: "Verbonden",
      callEnded: "Gesprek beëindigd",
      callComplete: "Gesprek afgerond",
      duration: "Duur",
      readyToTakeCalls: "Klaar om gesprekken aan te nemen",
      pressButtonToStart: "Druk op de knop om een gesimuleerd gesprek te starten",
      liveTranscript: "Live transcript",
      recording: "Opname",
      transcriptWillAppear: "Het transcript verschijnt hier zodra het gesprek begint",
      connecting: "Verbinden...",
      messages: "Berichten",
      sentiment: "Sentiment",
      positive: "Positief",
      callerSpeaking: "Beller spreekt...",
      agentSpeaking: "Eva spreekt...",
      listening: "Luistert...",
      caller: "Beller",
      aiAgent: "Eva (AI-agent)",
    },
    chat: {
      badge: "Tekst AI demo",
      pageTitle: "Chat met de tekstagent van x20ai",
      subtitle: "Stel vragen over de diensten, prijzen of integraties van x20ai",
      assistantName: "x20ai Assistent",
      online: "Online",
      typePlaceholder: "Typ een bericht...",
      welcomeMessage:
        "Hoi! Ik ben de x20ai-assistent. Ik kan je alles vertellen over onze AI-agents, prijzen, integraties en meer. Wat wil je weten?",
      suggestions: [
        "Welke diensten bieden jullie aan?",
        "Wat kost het?",
        "Welke integraties ondersteunen jullie?",
        "Hoe werkt de installatie?",
        "Vertel me over spraakagents",
        "Is het AVG-conform?",
      ],
    },
    dashboard: {
      badge: "Dashboard demo",
      pageTitle: "Agentprestaties",
      subtitle: "Realtime metrics van alle x20ai-agents",
      totalCalls: "Totaal gesprekken",
      messagesHandled: "Berichten afgehandeld",
      autoResolved: "Automatisch opgelost",
      satisfaction: "Tevredenheid",
      conversationVolume: "Gespreksvolume",
      conversationVolumeSubtitle: "Dagelijkse gesprekken over alle kanalen",
      thisPeriod: "Deze periode",
      channelDistribution: "Kanaalverdeling",
      liveConversations: "Live gesprekken",
      avgResponseTime: "Gem. reactietijd",
      liveConversationsTitle: "Live gesprekken",
      recentActivity: "Recente activiteit",
      roiSummary: "ROI-overzicht",
      roiSubtitle: "Gebaseerd op 30 dagen agentprestaties",
      timeSaved: "Tijd bespaard",
      costSaved: "Kosten bespaard",
      roiMultiple: "ROI-factor",
      statusActive: "Actief",
      statusResolved: "Opgelost",
      statusQueued: "Wachtrij",
      conversations: [
        { name: "Maria S.", channel: "WhatsApp", status: "Actief", duration: "2m 14s", topic: "Prijsinformatie" },
        { name: "Thomas K.", channel: "Spraak", status: "Actief", duration: "4m 32s", topic: "Integratie-installatie" },
        { name: "Anna P.", channel: "Chatbot", status: "Opgelost", duration: "1m 45s", topic: "AVG-naleving" },
        { name: "Jan de V.", channel: "WhatsApp", status: "Actief", duration: "0m 58s", topic: "Demo-aanvraag" },
        { name: "Carlos R.", channel: "Spraak", status: "Wachtrij", duration: "0m 12s", topic: "Technische ondersteuning" },
        { name: "Sophie L.", channel: "Chatbot", status: "Opgelost", duration: "3m 21s", topic: "Hulp bij onboarding" },
      ],
      activities: [
        { label: "Spraakagent heeft factuurvraag opgelost", value: "Klant: Thomas K. - Duur: 3m 12s", time: "2m geleden", status: "success" },
        { label: "WhatsApp-lead gekwalificeerd en afspraak ingepland", value: "Lead: Maria S. - Ingepland voor donderdag 14:00", time: "5m geleden", status: "success" },
        { label: "Nieuwe integratie verbonden: HubSpot CRM", value: "Automatische synchronisatie ingeschakeld voor contacten en deals", time: "12m geleden", status: "info" },
        { label: "Chatbot doorgeschakeld naar medewerker", value: "Complexe technische vraag - Ticket #4821", time: "18m geleden", status: "warning" },
        { label: "Spraakagent heeft 3 gelijktijdige gesprekken afgehandeld", value: "Allemaal opgelost - Gem. duur: 2m 45s", time: "25m geleden", status: "success" },
        { label: "Dagelijks rapport gegenereerd", value: "847 gesprekken, 97% tevredenheidsscore", time: "1u geleden", status: "info" },
        { label: "WhatsApp-campagne afgerond", value: "1.200 berichten verstuurd - 68% geopend", time: "2u geleden", status: "success" },
      ],
    },
    chatResponses: {
      default:
        "Bedankt voor je interesse in x20ai! Wij bouwen productieklare AI-agents voor spraak, WhatsApp en chat - live binnen 3-7 werkdagen. Waar wil je meer over weten?",
      greeting:
        "Hoi! Welkom bij x20ai. Ik ben je AI-assistent. Ik kan je vertellen over onze spraakagents, WhatsApp-automatisering, chatbots, prijzen, integraties en meer. Waar ben je benieuwd naar?",
      pricing:
        "Ons AI-agentplatform begint vanaf \u20ac1.499. Dit is inclusief volledige configuratie, training op jouw bedrijfsgegevens, implementatie en doorlopende ondersteuning. De meeste klanten besparen meer dan 40 uur per maand, dus de investering verdient zich snel terug. Zal ik uitleggen wat er allemaal inbegrepen is?",
      integrations:
        "We integreren met een breed scala aan tools:\n\n**CRM:** GoHighLevel, HubSpot, Salesforce, Pipedrive, Reapit\n**Communicatie:** Twilio, WhatsApp, Instagram, Facebook, Telnyx\n**Automatisering:** n8n, Make, Zapier\n**Agenda's:** Google Calendar, Calendly\n**Data:** Airtable, Google Sheets, Supabase\n**Betalingen:** Stripe\n\nPlus maatwerk REST API's op aanvraag!",
      voice:
        "Onze Spraak AI-agents handelen inkomende en uitgaande gesprekken af, 24 uur per dag, 7 dagen per week. Ze kunnen leads kwalificeren, afspraken inplannen, veelgestelde vragen beantwoorden en meerdere gesprekken tegelijk voeren. De gemiddelde reactietijd is minder dan 2 seconden, en ze spreken meer dan 50 talen met automatische herkenning. Het is alsof je een perfecte receptionist hebt die nooit slaapt!",
      whatsapp:
        "Onze WhatsApp-agents automatiseren klantgesprekken op het populairste berichtenplatform ter wereld. Ze beantwoorden vragen, sturen updates, kwalificeren leads en plannen afspraken in - allemaal met natuurlijke, menselijke antwoorden. In combinatie met onze CRM-integraties stroomt elk gesprek rechtstreeks je salesfunnel in.",
      chatbot:
        "Onze chatbots kunnen worden ingezet op je website, app of elk berichtenplatform. Ze zijn getraind op jouw specifieke bedrijfsgegevens en handelen 85% van de klantvragen volledig automatisch af. Slim genoeg om te weten wanneer ze moeten doorschakelen naar een medewerker, snel genoeg om klanten tevreden te houden.",
      security:
        "Beveiliging zit in alles wat we bouwen:\n\n- AVG-conform met versleutelde gegevensopslag\n- Enterprise-grade cloudinfrastructuur\n- 99,9% uptime SLA\n- Rolgebaseerde toegangscontrole\n- Regelmatige beveiligingsaudits\n- Verwerkersovereenkomsten beschikbaar\n\nDe gegevens van jouw klanten zijn veilig bij ons.",
      setup:
        "Aan de slag gaan is simpel - drie stappen:\n\n1. **Deel je kennis** - Upload documenten, koppel je CRM, verbind je tools\n2. **Wij configureren en trainen** - Ons team stelt de agent in, traint hem en test alles\n3. **Ga live** - De agent wordt uitgerold en begint direct met automatiseren\n\nHet hele proces duurt slechts 3-7 werkdagen. Geen technische kennis nodig aan jouw kant!",
      languages:
        "Onze agents ondersteunen meer dan 50 talen met automatische taalherkenning. Of je klanten nu Nederlands, Engels, Spaans, Duits, Frans, Arabisch of Chinees spreken - de agent past zich automatisch aan. Perfect voor internationale bedrijven!",
      demo:
        "Ik regel graag een demo voor je! Onze specialisten nemen het platform met je door en laten precies zien hoe onze AI-agents voor jouw specifieke bedrijf zouden werken. Je kunt direct boeken via onze website op x20ai.com, of ik kan iemand naar je laten bellen. Wat heeft je voorkeur?",
      results:
        "Dit is wat onze klanten doorgaans zien:\n\n- **40+ uur bespaard** per maand op repetitieve taken\n- **85% van de vragen** volledig automatisch afgehandeld\n- **<2 seconden** gemiddelde reactietijd, 24/7\n- **Geen gemiste leads** - onbeperkt gelijktijdige gesprekken\n- **Schaalt oneindig** zonder extra personeel\n\nOndersteund door onze 4,9/5 beoordeling over 47 reviews!",
    },
    footer: {
      copyright: "\u00a9 2026 x20ai. Demo-ervaring.",
      visitSite: "Bezoek x20ai.com",
      description: "Productieklare AI-agents die echte bedrijfstaken automatiseren. Van kennisbeheer tot telefoongesprekken - live binnen dagen, niet maanden.",
    },
    common: {
      allSystemsOperational: "Alle systemen operationeel",
      last30Days: "Laatste 30 dagen",
      live: "Live",
      languageLabel: "Taal",
    },
  },

  // ─────────────────────────────────────────────
  // SPANISH
  // ─────────────────────────────────────────────
  es: {
    nav: {
      home: "Inicio",
      voiceAi: "Voz IA",
      textAi: "Texto IA",
      dashboard: "Panel",
      getStarted: "Empezar",
    },
    home: {
      badge: "Demos interactivas de agentes IA",
      heroTitle: "Experimenta los agentes de ",
      heroTitleAccent: "x20ai",
      heroTitleEnd: " en acci\u00f3n",
      subtitle:
        "Descubre c\u00f3mo los agentes de IA listos para producci\u00f3n gestionan llamadas telef\u00f3nicas, conversaciones de texto y ofrecen an\u00e1lisis en tiempo real. Operativos en 3-7 d\u00edas h\u00e1biles.",
      tryVoiceDemo: "Probar demo de voz",
      tryTextDemo: "Probar demo de texto",
      stats: {
        hoursSaved: "Horas ahorradas/mes",
        autoResolved: "Resuelto autom\u00e1ticamente",
        responseTime: "Tiempo de respuesta",
        uptimeSla: "SLA de disponibilidad",
      },
      chooseDemo: "Elige una demo",
      chooseDemoSubtitle:
        "Cada demo es una experiencia totalmente simulada que muestra c\u00f3mo funcionan los agentes de x20ai en producci\u00f3n.",
      demoCards: {
        voiceTitle: "Agente de voz IA",
        voiceDescription:
          "Vive una llamada telef\u00f3nica simulada en directo con nuestro agente de voz IA. Sigue la transcripci\u00f3n en tiempo real mientras el agente atiende consultas, cualifica leads y agenda citas.",
        voiceTag: "Simulaci\u00f3n en vivo",
        textTitle: "Agente de texto IA",
        textDescription:
          "Chatea en tiempo real con nuestro agente IA estilo WhatsApp. Pregunta sobre servicios, precios e integraciones - entrenado con toda la base de conocimiento de x20ai.",
        textTag: "Chat interactivo",
        dashboardTitle: "Panel de an\u00e1lisis",
        dashboardDescription:
          "Consulta m\u00e9tricas de rendimiento en tiempo real, an\u00e1lisis de conversaciones y seguimiento del ROI. Visualizaciones animadas que muestran c\u00f3mo es gestionar agentes de IA.",
        dashboardTag: "M\u00e9tricas en vivo",
      },
      launchDemo: "Iniciar demo",
      integrationsLabel: "Se conecta con lo que ya usas",
    },
    voice: {
      badge: "Demo de voz IA",
      pageTitle: "Simulaci\u00f3n en vivo del agente de voz",
      subtitle: "Observa c\u00f3mo Eva, la agente de voz de x20ai, gestiona una llamada de ventas real",
      startCall: "Iniciar llamada",
      endCall: "Finalizar llamada",
      newCall: "Nueva llamada",
      ringing: "Llamando...",
      connectingTo: "Conectando con Eva...",
      voiceAgent: "Agente de voz x20ai",
      connected: "Conectado",
      callEnded: "Llamada finalizada",
      callComplete: "Llamada completada",
      duration: "Duraci\u00f3n",
      readyToTakeCalls: "Lista para recibir llamadas",
      pressButtonToStart: "Pulsa el bot\u00f3n para iniciar una llamada simulada",
      liveTranscript: "Transcripci\u00f3n en vivo",
      recording: "Grabando",
      transcriptWillAppear: "La transcripci\u00f3n aparecer\u00e1 aqu\u00ed cuando comience la llamada",
      connecting: "Conectando...",
      messages: "Mensajes",
      sentiment: "Sentimiento",
      positive: "Positivo",
      callerSpeaking: "El interlocutor est\u00e1 hablando...",
      agentSpeaking: "Eva est\u00e1 hablando...",
      listening: "Escuchando...",
      caller: "Interlocutor",
      aiAgent: "Eva (Agente IA)",
    },
    chat: {
      badge: "Demo de texto IA",
      pageTitle: "Chatea con el agente de texto de x20ai",
      subtitle: "Pregunta lo que quieras sobre los servicios, precios o integraciones de x20ai",
      assistantName: "Asistente x20ai",
      online: "En l\u00ednea",
      typePlaceholder: "Escribe un mensaje...",
      welcomeMessage:
        "\u00a1Hola! Soy el asistente de x20ai. Puedo responder tus preguntas sobre nuestros agentes de IA, precios, integraciones y mucho m\u00e1s. \u00bfQu\u00e9 te gustar\u00eda saber?",
      suggestions: [
        "\u00bfQu\u00e9 servicios ofrecen?",
        "\u00bfCu\u00e1nto cuesta?",
        "\u00bfQu\u00e9 integraciones soportan?",
        "\u00bfC\u00f3mo funciona la implementaci\u00f3n?",
        "Cu\u00e9ntame sobre los agentes de voz",
        "\u00bfCumple con el RGPD?",
      ],
    },
    dashboard: {
      badge: "Demo del panel",
      pageTitle: "Rendimiento de los agentes",
      subtitle: "M\u00e9tricas en tiempo real de todos los agentes x20ai",
      totalCalls: "Total de llamadas",
      messagesHandled: "Mensajes gestionados",
      autoResolved: "Resuelto autom\u00e1ticamente",
      satisfaction: "Satisfacci\u00f3n",
      conversationVolume: "Volumen de conversaciones",
      conversationVolumeSubtitle: "Conversaciones diarias en todos los canales",
      thisPeriod: "Este periodo",
      channelDistribution: "Distribuci\u00f3n por canal",
      liveConversations: "Conversaciones en vivo",
      avgResponseTime: "Tiempo medio de respuesta",
      liveConversationsTitle: "Conversaciones en vivo",
      recentActivity: "Actividad reciente",
      roiSummary: "Resumen de ROI",
      roiSubtitle: "Basado en el rendimiento de los agentes en 30 d\u00edas",
      timeSaved: "Tiempo ahorrado",
      costSaved: "Coste ahorrado",
      roiMultiple: "Multiplicador ROI",
      statusActive: "Activo",
      statusResolved: "Resuelto",
      statusQueued: "En cola",
      conversations: [
        { name: "Mar\u00eda S.", channel: "WhatsApp", status: "Activo", duration: "2m 14s", topic: "Consulta de precios" },
        { name: "Thomas K.", channel: "Voz", status: "Activo", duration: "4m 32s", topic: "Configuraci\u00f3n de integraci\u00f3n" },
        { name: "Anna P.", channel: "Chatbot", status: "Resuelto", duration: "1m 45s", topic: "Cumplimiento RGPD" },
        { name: "Jan de V.", channel: "WhatsApp", status: "Activo", duration: "0m 58s", topic: "Solicitud de demo" },
        { name: "Carlos R.", channel: "Voz", status: "En cola", duration: "0m 12s", topic: "Soporte t\u00e9cnico" },
        { name: "Sophie L.", channel: "Chatbot", status: "Resuelto", duration: "3m 21s", topic: "Ayuda con onboarding" },
      ],
      activities: [
        { label: "Agente de voz resolvi\u00f3 consulta de facturaci\u00f3n", value: "Cliente: Thomas K. - Duraci\u00f3n: 3m 12s", time: "Hace 2m", status: "success" },
        { label: "Lead de WhatsApp cualificado y cita agendada", value: "Lead: Mar\u00eda S. - Agendada para jueves 14:00", time: "Hace 5m", status: "success" },
        { label: "Nueva integraci\u00f3n conectada: HubSpot CRM", value: "Sincronizaci\u00f3n autom\u00e1tica activada para contactos y oportunidades", time: "Hace 12m", status: "info" },
        { label: "Chatbot escal\u00f3 a agente humano", value: "Consulta t\u00e9cnica compleja - Ticket #4821", time: "Hace 18m", status: "warning" },
        { label: "Agente de voz gestion\u00f3 3 llamadas simult\u00e1neas", value: "Todas resueltas - Duraci\u00f3n media: 2m 45s", time: "Hace 25m", status: "success" },
        { label: "Informe diario generado", value: "847 conversaciones, 97% de satisfacci\u00f3n", time: "Hace 1h", status: "info" },
        { label: "Campa\u00f1a de WhatsApp completada", value: "1.200 mensajes enviados - 68% tasa de apertura", time: "Hace 2h", status: "success" },
      ],
    },
    chatResponses: {
      default:
        "\u00a1Gracias por tu inter\u00e9s en x20ai! Creamos agentes de IA listos para producci\u00f3n para voz, WhatsApp y chat, operativos en 3-7 d\u00edas h\u00e1biles. \u00bfSobre qu\u00e9 te gustar\u00eda saber m\u00e1s?",
      greeting:
        "\u00a1Hola! Bienvenido a x20ai. Soy tu asistente de IA. Puedo contarte sobre nuestros agentes de voz, automatizaci\u00f3n de WhatsApp, chatbots, precios, integraciones y mucho m\u00e1s. \u00bfQu\u00e9 te interesa?",
      pricing:
        "Nuestra plataforma de agentes IA empieza en \u20ac1.499. Esto incluye la configuraci\u00f3n completa, el entrenamiento con los datos de tu negocio, la implementaci\u00f3n y soporte continuo. La mayor\u00eda de los clientes ahorran m\u00e1s de 40 horas al mes, as\u00ed que el retorno de la inversi\u00f3n es muy r\u00e1pido. \u00bfQuieres que te detalle lo que incluye?",
      integrations:
        "Nos integramos con una amplia variedad de herramientas:\n\n**CRM:** GoHighLevel, HubSpot, Salesforce, Pipedrive, Reapit\n**Comunicaci\u00f3n:** Twilio, WhatsApp, Instagram, Facebook, Telnyx\n**Automatizaci\u00f3n:** n8n, Make, Zapier\n**Calendarios:** Google Calendar, Calendly\n**Datos:** Airtable, Google Sheets, Supabase\n**Pagos:** Stripe\n\n\u00a1Adem\u00e1s de APIs REST personalizadas bajo demanda!",
      voice:
        "Nuestros agentes de voz IA gestionan llamadas entrantes y salientes las 24 horas del d\u00eda, los 7 d\u00edas de la semana. Pueden cualificar leads, agendar citas, responder preguntas frecuentes y atender m\u00faltiples llamadas a la vez. El tiempo medio de respuesta es inferior a 2 segundos y hablan m\u00e1s de 50 idiomas con detecci\u00f3n autom\u00e1tica. \u00a1Es como tener una recepcionista perfecta que nunca duerme!",
      whatsapp:
        "Nuestros agentes de WhatsApp automatizan las conversaciones con clientes en la plataforma de mensajer\u00eda m\u00e1s popular del mundo. Responden consultas, env\u00edan actualizaciones, cualifican leads y agendan citas, todo con respuestas naturales y humanas. Combinado con nuestras integraciones de CRM, cada conversaci\u00f3n alimenta directamente tu pipeline de ventas.",
      chatbot:
        "Nuestros chatbots se pueden implementar en tu web, app o cualquier plataforma de mensajer\u00eda. Est\u00e1n entrenados con los datos espec\u00edficos de tu negocio y resuelven el 85% de las consultas de forma totalmente autom\u00e1tica. Lo suficientemente inteligentes para saber cu\u00e1ndo escalar a un humano, lo suficientemente r\u00e1pidos para mantener contentos a tus clientes.",
      security:
        "La seguridad es parte fundamental de todo lo que construimos:\n\n- Cumplimiento del RGPD con almacenamiento cifrado\n- Infraestructura cloud de nivel empresarial\n- SLA de disponibilidad del 99,9%\n- Control de acceso basado en roles\n- Auditor\u00edas de seguridad peri\u00f3dicas\n- Acuerdos de tratamiento de datos disponibles\n\nLos datos de tus clientes est\u00e1n seguros con nosotros.",
      setup:
        "Empezar es muy sencillo - tres pasos:\n\n1. **Comparte tu conocimiento** - Sube documentos, conecta tu CRM, enlaza tus herramientas\n2. **Nosotros configuramos y entrenamos** - Nuestro equipo configura, entrena y prueba el agente con tus datos\n3. **Sal a producci\u00f3n** - El agente se despliega y empieza a automatizar de inmediato\n\nTodo el proceso lleva solo 3-7 d\u00edas h\u00e1biles. \u00a1No necesitas conocimientos t\u00e9cnicos!",
      languages:
        "Nuestros agentes soportan m\u00e1s de 50 idiomas con detecci\u00f3n autom\u00e1tica. Ya sea que tus clientes hablen espa\u00f1ol, ingl\u00e9s, neerland\u00e9s, alem\u00e1n, franc\u00e9s, \u00e1rabe o chino, el agente se adapta autom\u00e1ticamente. \u00a1Perfecto para negocios internacionales!",
      demo:
        "\u00a1Me encantar\u00eda organizar una demo para ti! Nuestros especialistas te guiar\u00e1n por la plataforma y te mostrar\u00e1n exactamente c\u00f3mo funcionar\u00edan nuestros agentes de IA en tu caso concreto. Puedes reservar directamente en nuestra web x20ai.com, o puedo hacer que alguien te contacte. \u00bfQu\u00e9 prefieres?",
      results:
        "Esto es lo que nuestros clientes suelen experimentar:\n\n- **M\u00e1s de 40 horas ahorradas** al mes en tareas repetitivas\n- **85% de las consultas** resueltas de forma totalmente autom\u00e1tica\n- **Menos de 2 segundos** de tiempo medio de respuesta, 24/7\n- **Cero leads perdidos** - conversaciones simult\u00e1neas ilimitadas\n- **Escalabilidad infinita** sin personal adicional\n\n\u00a1Todo respaldado por nuestra valoraci\u00f3n de 4,9/5 en 47 rese\u00f1as!",
    },
    footer: {
      copyright: "\u00a9 2026 x20ai. Experiencia demo.",
      visitSite: "Visita x20ai.com",
      description: "Agentes de IA listos para produccion que automatizan tareas empresariales reales. Desde gestion del conocimiento hasta llamadas telefonicas - desplegados en dias, no meses.",
    },
    common: {
      allSystemsOperational: "Todos los sistemas operativos",
      last30Days: "\u00daltimos 30 d\u00edas",
      live: "En vivo",
      languageLabel: "Idioma",
    },
  },
};

// ─────────────────────────────────────────────
// VOICE CONVERSATION SCRIPTS
// ─────────────────────────────────────────────

export const VOICE_CONVERSATION: Record<
  Locale,
  Array<{ speaker: "caller" | "agent"; text: string; delay: number }>
> = {
  en: [
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
  ],
  nl: [
    { speaker: "agent", text: "Bedankt voor het bellen met x20ai. Mijn naam is Eva, uw AI-assistent. Waarmee kan ik u helpen?", delay: 1500 },
    { speaker: "caller", text: "Hallo, ik ben geinteresseerd in het automatiseren van onze klantenservice. Kunt u me meer vertellen over jullie AI-agents?", delay: 3000 },
    { speaker: "agent", text: "Natuurlijk! Bij x20ai bouwen we productieklare AI-agents die echte bedrijfstaken uitvoeren. We bieden spraakagents, WhatsApp-agents en chatbots, allemaal operationeel binnen 3 tot 7 werkdagen.", delay: 4500 },
    { speaker: "caller", text: "Dat is snel. Wat voor taken kunnen ze precies aan?", delay: 2500 },
    { speaker: "agent", text: "Onze agents beantwoorden klantvragen, plannen afspraken in, kwalificeren leads, beheren kennis en voeren telefoongesprekken. Gemiddeld handelen ze 85% van alle vragen volledig automatisch af, met een reactietijd van minder dan 2 seconden.", delay: 5000 },
    { speaker: "caller", text: "Indrukwekkend. Met welke CRM-systemen integreren jullie?", delay: 2500 },
    { speaker: "agent", text: "We integreren met alle grote CRM-systemen, waaronder GoHighLevel, HubSpot, Salesforce, Pipedrive en Reapit. Daarnaast ook automatiseringstools zoals n8n, Make en Zapier. En we koppelen met WhatsApp, Instagram, Facebook en meer.", delay: 5500 },
    { speaker: "caller", text: "Wat kost het?", delay: 2000 },
    { speaker: "agent", text: "Ons AI-agentplatform begint vanaf 1.499 euro. Dat is inclusief configuratie, training op uw specifieke bedrijfsgegevens, implementatie en doorlopende ondersteuning. De meeste klanten besparen meer dan 40 uur per maand, dus de investering verdient zich snel terug.", delay: 5500 },
    { speaker: "caller", text: "En hoe zit het met beveiliging? We werken met gevoelige klantgegevens.", delay: 2500 },
    { speaker: "agent", text: "Goede vraag. We zijn volledig AVG-conform met versleutelde gegevensopslag en toegangscontroles. Onze infrastructuur draait op enterprise-grade cloud met een uptime SLA van 99,9%. Beveiliging zit in alles wat we doen.", delay: 5000 },
    { speaker: "caller", text: "Dit klinkt precies als wat we nodig hebben. Kunnen we een demo inplannen?", delay: 2500 },
    { speaker: "agent", text: "Dat regel ik graag voor u! Ik kan een afspraak maken met een van onze specialisten. We nemen het hele platform met u door en laten precies zien hoe de agents voor uw bedrijf zouden werken. Welke dag komt u het beste uit?", delay: 5500 },
    { speaker: "caller", text: "Hoe zit het met donderdagmiddag?", delay: 2000 },
    { speaker: "agent", text: "Prima, donderdagmiddag heb ik beschikbaar. Ik stuur u een agenda-uitnodiging met een vergaderlink. Kan ik u verder nog ergens mee helpen?", delay: 4000 },
    { speaker: "caller", text: "Nee, dat was het. Bedankt Eva!", delay: 2000 },
    { speaker: "agent", text: "Graag gedaan! Ik kijk ernaar uit om u te laten zien wat x20ai voor uw bedrijf kan betekenen. Fijne dag nog!", delay: 3500 },
  ],
  es: [
    { speaker: "agent", text: "Gracias por llamar a x20ai. Me llamo Eva, soy su asistente de IA. \u00bfEn qu\u00e9 puedo ayudarle hoy?", delay: 1500 },
    { speaker: "caller", text: "Hola, me interesa automatizar nuestra atenci\u00f3n al cliente. \u00bfPuede contarme sobre sus agentes de IA?", delay: 3000 },
    { speaker: "agent", text: "\u00a1Por supuesto! En x20ai creamos agentes de IA listos para producci\u00f3n que realizan tareas reales de negocio. Ofrecemos agentes de voz, agentes de WhatsApp y chatbots, todos operativos en solo 3 a 7 d\u00edas h\u00e1biles.", delay: 4500 },
    { speaker: "caller", text: "Eso es r\u00e1pido. \u00bfQu\u00e9 tipo de tareas pueden gestionar?", delay: 2500 },
    { speaker: "agent", text: "Nuestros agentes atienden consultas de clientes, programan citas, cualifican leads, gestionan conocimiento y mantienen conversaciones telef\u00f3nicas. De media, resuelven el 85% de las consultas de forma completamente autom\u00e1tica con tiempos de respuesta inferiores a 2 segundos.", delay: 5000 },
    { speaker: "caller", text: "Impresionante. \u00bfCon qu\u00e9 sistemas de CRM se integran?", delay: 2500 },
    { speaker: "agent", text: "Nos integramos con todos los CRM principales, incluyendo GoHighLevel, HubSpot, Salesforce, Pipedrive y Reapit. Adem\u00e1s de herramientas de automatizaci\u00f3n como n8n, Make y Zapier. Tambi\u00e9n conectamos con WhatsApp, Instagram, Facebook y m\u00e1s.", delay: 5500 },
    { speaker: "caller", text: "\u00bfCu\u00e1nto cuesta?", delay: 2000 },
    { speaker: "agent", text: "Nuestra plataforma de agentes IA empieza en solo 1.499 euros. Esto incluye la configuraci\u00f3n, el entrenamiento con sus datos espec\u00edficos, el despliegue y soporte continuo. La mayor\u00eda de los clientes ahorran m\u00e1s de 40 horas al mes, as\u00ed que la inversi\u00f3n se recupera muy r\u00e1pidamente.", delay: 5500 },
    { speaker: "caller", text: "\u00bfY la seguridad? Manejamos datos sensibles de clientes.", delay: 2500 },
    { speaker: "agent", text: "Excelente pregunta. Cumplimos totalmente con el RGPD, con almacenamiento cifrado y controles de acceso. Nuestra infraestructura funciona sobre cloud de nivel empresarial con un SLA de disponibilidad del 99,9%. La seguridad est\u00e1 integrada en todo lo que hacemos.", delay: 5000 },
    { speaker: "caller", text: "Esto suena justo a lo que necesitamos. \u00bfPodemos agendar una demo?", delay: 2500 },
    { speaker: "agent", text: "\u00a1Con mucho gusto! Puedo reservarle una sesi\u00f3n con uno de nuestros especialistas. Le mostraremos toda la plataforma y c\u00f3mo funcionar\u00edan los agentes para su negocio en particular. \u00bfQu\u00e9 d\u00eda le viene mejor?", delay: 5500 },
    { speaker: "caller", text: "\u00bfQu\u00e9 tal el jueves por la tarde?", delay: 2000 },
    { speaker: "agent", text: "Perfecto, tengo disponibilidad el jueves por la tarde. Le enviar\u00e9 una invitaci\u00f3n de calendario con el enlace de la reuni\u00f3n. \u00bfHay algo m\u00e1s en lo que pueda ayudarle?", delay: 4000 },
    { speaker: "caller", text: "No, eso es todo. \u00a1Gracias Eva!", delay: 2000 },
    { speaker: "agent", text: "\u00a1De nada! Estoy deseando mostrarle todo lo que x20ai puede hacer por su negocio. \u00a1Que tenga un buen d\u00eda!", delay: 3500 },
  ],
};

// ─────────────────────────────────────────────
// HELPER: useTranslation
// ─────────────────────────────────────────────

export function useTranslation(locale: Locale): TranslationSet {
  return translations[locale];
}

// ─────────────────────────────────────────────
// HELPER: getMatchedResponse (locale-aware)
// ─────────────────────────────────────────────

// Keywords per locale for matching chat input to response keys
const KEYWORD_PATTERNS: Record<Locale, Record<string, RegExp>> = {
  en: {
    greeting: /^(hi|hello|hey|good morning|good afternoon|good evening|howdy|hola)/i,
    pricing: /pric|cost|how much|euro|€|package|plan/i,
    integrations: /integrat|crm|connect|hubspot|salesforce|zapier|n8n|make|tool/i,
    voice: /voice|call|phone|inbound|outbound|receptionist/i,
    whatsapp: /whatsapp|messaging|message/i,
    chatbot: /chat|chatbot|website|widget/i,
    security: /secur|gdpr|complian|encrypt|safe|privacy/i,
    setup: /setup|start|deploy|onboard|how.*(work|begin|get)/i,
    languages: /language|multilingual|dutch|spanish|german|french/i,
    demo: /demo|trial|test|try|see|show/i,
    results: /result|roi|save|stat|performance|benefit/i,
  },
  nl: {
    greeting: /^(hoi|hallo|hey|goedemorgen|goedemiddag|goedeavond|dag)/i,
    pricing: /prij|kost|hoeveel|euro|€|pakket|tarief/i,
    integrations: /integrat|crm|koppel|hubspot|salesforce|zapier|n8n|make|tool/i,
    voice: /spraak|bel|telefoon|inkomend|uitgaand|receptionist/i,
    whatsapp: /whatsapp|berichten|bericht/i,
    chatbot: /chat|chatbot|website|widget/i,
    security: /beveilig|avg|gdpr|complian|versleutel|veilig|privacy/i,
    setup: /installat|start|implementat|onboard|hoe.*(werk|begin)/i,
    languages: /taal|talen|meertalig|nederlands|spaans|duits|frans/i,
    demo: /demo|proef|test|probeer|laat.*zien|toon/i,
    results: /resultaat|roi|bespaar|statistiek|prestatie|voordeel/i,
  },
  es: {
    greeting: /^(hola|buenos d[ií]as|buenas tardes|buenas noches|hey|saludos)/i,
    pricing: /preci|cost|cu[aá]nto|euro|€|paquete|tarifa|plan/i,
    integrations: /integra|crm|conect|hubspot|salesforce|zapier|n8n|make|herramienta/i,
    voice: /voz|llamad|tel[eé]fono|entrante|saliente|recepcionista/i,
    whatsapp: /whatsapp|mensajer[ií]a|mensaje/i,
    chatbot: /chat|chatbot|web|widget/i,
    security: /segur|rgpd|gdpr|cumpli|cifra|privacidad/i,
    setup: /config|empez|implement|desplieg|c[oó]mo.*(funcion|empez|inici)/i,
    languages: /idiom|lengu|multiling|espa[nñ]ol|ingl[eé]s|neerland|alem[aá]n|franc[eé]s/i,
    demo: /demo|prueba|test|probar|ver|mostr/i,
    results: /resultado|roi|ahorr|estad[ií]stica|rendimiento|beneficio/i,
  },
};

export function getMatchedResponse(input: string, locale: Locale): string {
  const lower = input.toLowerCase();
  const patterns = KEYWORD_PATTERNS[locale];
  const responses = translations[locale].chatResponses;

  for (const [key, regex] of Object.entries(patterns)) {
    if (regex.test(lower)) {
      return responses[key];
    }
  }

  return responses.default;
}
