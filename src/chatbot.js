// ─────────────────────────────────────────────────────────
// RESUME KNOWLEDGE BASE — Soumik Chatterjee
// ─────────────────────────────────────────────────────────

export const RESUME_DATA = {
  name: "Soumik Chatterjee",
  title: "AI/ML Enthusiast | Full Stack Developer | Team Leader",
  summary:
    "Motivated and dedicated B.Tech student in Artificial Intelligence & Machine Learning with a strong foundation in AI/ML, full stack development, and problem solving. Passionate about building intelligent solutions that create real-world impact. Experienced in hackathons, team collaboration, and delivering innovative projects.",

  contact: {
    phone: "9051611468",
    email: "soumik7484@gmail.com",
    location: "Sodepur, West Bengal, India",
    linkedin: "linkedin.com/in/soumik-chatterjee-810aa1386",
    github: "github.com/soumik7484-art",
  },

  education: {
    college: {
      name: "Narula Institute of Technology",
      degree: "B.Tech in Artificial Intelligence & Machine Learning (AIML)",
      years: "2025 – 2029",
      status: "2nd Year, 3rd Semester",
      cgpa: "8.58 (After 1st Semester)",
    },
    higherSecondary: {
      name: "Ramakrishna Vivekananda Mission, Barrackpore",
      board: "WBBSE — Higher Secondary",
      year: "2025",
      percentage: "85%",
    },
    secondary: {
      name: "Ramakrishna Vivekananda Mission, Barrackpore",
      board: "WBBSE — Secondary (10th)",
      year: "2023",
      percentage: "87%",
    },
  },

  skills: {
    programmingLanguages: ["Python", "C", "C++", "Java", "SQL", "JavaScript (Basic)"],
    aiMl: ["Machine Learning", "Deep Learning", "Computer Vision", "OCR", "Prompt Engineering"],
    webDevelopment: ["HTML", "CSS", "React.js", "Node.js", "Express.js", "MongoDB", "REST APIs"],
    toolsPlatforms: ["Git", "GitHub", "VS Code", "Flask", "Figma", "Postman", "SQL"],
  },

  projects: [
    {
      name: "Medi AI – AI Medical Assistant",
      description:
        "An AI-powered medical assistant that scans prescriptions, medical reports, and injury images. Uses OCR and AI models to extract information and provide meaningful, easy-to-understand results for better healthcare accessibility.",
      techStack: ["Python", "Flask", "OCR", "AI/ML", "MERN Stack"],
    },
    {
      name: "Legal AI – AI Legal Document Analyzer",
      description:
        "An AI system that scans legal documents and identifies risky or dangerous clauses. Helps users understand legal agreements by highlighting important sections and potential risks.",
      techStack: ["Python", "OCR", "NLP", "AI Models"],
    },
  ],

  experience: [
    "Participated in 3 Hackathons and secured a significant position in INNOVATEX under MAKAUT.",
    "Led teams in multiple hackathons, managing brainstorming, development, and final presentation.",
    "Served as Class Representative, coordinating with faculty and peers and ensuring effective communication.",
  ],

  certifications: ["Google Skill Certificate"],
  languages: ["English", "Bengali", "Hindi", "Spanish"],
  strengths: ["Problem Solving", "Team Leadership", "Communication", "Quick Learner", "Adaptability", "Time Management", "Critical Thinking"],
  interests: ["Artificial Intelligence", "Machine Learning", "Full Stack Development", "Computer Vision", "Hackathons", "Open Source"],
};

// ─────────────────────────────────────────────────────────
// KNOWLEDGE BASE — Q&A pairs with keywords
// ─────────────────────────────────────────────────────────
const r = RESUME_DATA;

const KB = [
  // ── Greetings ──────────────────────────────────────────
  {
    keys: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy", "what's up", "sup"],
    answer: () =>
      `Hi there! 👋 I'm Soumik's AI assistant, trained on his resume.\n\nAsk me anything about:\n• **Skills** & tech stack\n• **Education** (school/college)\n• **Projects** he built\n• **Experience** & hackathons\n• **Contact** details\n• How to **hire** him`,
  },

  // ── Who is Soumik ──────────────────────────────────────
  {
    keys: ["who is soumik", "who are you", "tell me about soumik", "about soumik", "introduce", "describe soumik", "about yourself"],
    answer: () =>
      `**${r.name}** — ${r.title}\n\n${r.summary}`,
  },

  // ── College / University ───────────────────────────────
  {
    keys: [
      "college", "university", "narula", "nit", "b.tech", "btech", "aiml",
      "artificial intelligence machine learning", "engineering", "current study",
      "studying", "where do you study", "which college", "your college", "semester", "year",
    ],
    answer: () =>
      `🎓 **College:**\n\n**${r.education.college.name}**\n${r.education.college.degree}\n📅 ${r.education.college.years}\n📊 ${r.education.college.status}\n⭐ CGPA: ${r.education.college.cgpa}`,
  },

  // ── School ─────────────────────────────────────────────
  {
    keys: [
      "school", "secondary", "10th", "class 10", "hs", "higher secondary", "12th",
      "class 12", "wbbse", "barrackpore", "ramakrishna", "vivekananda", "mission",
      "high school", "which school", "your school",
    ],
    answer: () =>
      `🏫 **School Background:**\n\n**Higher Secondary (12th):**\n${r.education.higherSecondary.name}\n${r.education.higherSecondary.board} | ${r.education.higherSecondary.year}\n📊 Percentage: ${r.education.higherSecondary.percentage}\n\n**Secondary (10th):**\n${r.education.secondary.name}\n${r.education.secondary.board} | ${r.education.secondary.year}\n📊 Percentage: ${r.education.secondary.percentage}`,
  },

  // ── Education (general) ────────────────────────────────
  {
    keys: [
      "education", "academic", "qualification", "degree", "study", "student",
      "cgpa", "marks", "percentage", "result", "score", "gpa", "grade",
    ],
    answer: () =>
      `🎓 **Education Background:**\n\n**${r.education.college.name}**\n${r.education.college.degree} (${r.education.college.years})\n${r.education.college.status} | CGPA: ${r.education.college.cgpa}\n\n**${r.education.higherSecondary.name}**\n${r.education.higherSecondary.board} | ${r.education.higherSecondary.year}\nPercentage: ${r.education.higherSecondary.percentage}\n\n**${r.education.secondary.name}**\n${r.education.secondary.board} | ${r.education.secondary.year}\nPercentage: ${r.education.secondary.percentage}`,
  },

  // ── Contact ────────────────────────────────────────────
  {
    keys: ["contact", "email", "phone", "number", "reach", "get in touch", "linkedin", "github", "location", "address", "where is", "sodepur", "west bengal"],
    answer: () =>
      `📬 **Contact Soumik:**\n\n📧 Email: **${r.contact.email}**\n📱 Phone: **${r.contact.phone}**\n📍 Location: **${r.contact.location}**\n💼 LinkedIn: **${r.contact.linkedin}**\n🐙 GitHub: **${r.contact.github}**`,
  },

  // ── Skills general ─────────────────────────────────────
  {
    keys: ["skills", "technologies", "tech stack", "expertise", "abilities", "what do you know", "what can you do", "tools", "what technologies"],
    answer: () =>
      `💡 **Soumik's Skills:**\n\n**Programming:** ${r.skills.programmingLanguages.join(", ")}\n\n**AI/ML:** ${r.skills.aiMl.join(", ")}\n\n**Web Dev:** ${r.skills.webDevelopment.join(", ")}\n\n**Tools:** ${r.skills.toolsPlatforms.join(", ")}`,
  },

  // ── Python / AI / ML ───────────────────────────────────
  {
    keys: ["python", "machine learning", "deep learning", "ai", "ml", "neural", "artificial intelligence", "computer vision", "ocr", "prompt engineering"],
    answer: () =>
      `🤖 **AI/ML Expertise:**\n\n${r.skills.aiMl.join(" • ")}\n\nSoumik primarily codes in **Python** and has built real AI projects:\n• *Medi AI* — medical image & prescription analysis\n• *Legal AI* — legal document risk detection`,
  },

  // ── Web dev ────────────────────────────────────────────
  {
    keys: ["web", "react", "frontend", "backend", "fullstack", "full stack", "node", "mongodb", "html", "css", "javascript", "mern", "express", "rest api"],
    answer: () =>
      `🌐 **Web Development Skills:**\n\n${r.skills.webDevelopment.join(" • ")}\n\nSoumik builds complete full-stack apps using the **MERN stack** (MongoDB, Express, React, Node.js).`,
  },

  // ── Projects ───────────────────────────────────────────
  {
    keys: ["project", "built", "created", "made", "work", "app", "application", "medi ai", "legal ai", "what have you made", "portfolio"],
    answer: () =>
      `🛠️ **Projects by Soumik:**\n\n${r.projects
        .map(p => `**${p.name}**\n${p.description}\n*Stack:* ${p.techStack.join(", ")}`)
        .join("\n\n")}`,
  },

  // ── Experience / Hackathons ────────────────────────────
  {
    keys: ["experience", "hackathon", "competition", "leadership", "team", "innovatex", "makaut", "class representative", "intern", "led", "achievement"],
    answer: () =>
      `🏆 **Experience & Leadership:**\n\n${r.experience.map(e => `• ${e}`).join("\n")}`,
  },

  // ── Certifications ─────────────────────────────────────
  {
    keys: ["certification", "certificate", "google", "certified", "course", "credential"],
    answer: () =>
      `📜 **Certifications:**\n\n${r.certifications.map(c => `• ${c}`).join("\n")}`,
  },

  // ── Languages spoken ───────────────────────────────────
  {
    keys: ["language", "speak", "bengali", "hindi", "english", "spanish", "tongue", "fluent"],
    answer: () =>
      `🗣️ **Languages Soumik speaks:**\n\n${r.languages.join("  •  ")}`,
  },

  // ── Strengths ──────────────────────────────────────────
  {
    keys: ["strength", "quality", "personality", "trait", "problem solving", "soft skill"],
    answer: () =>
      `⭐ **Soumik's Strengths:**\n\n${r.strengths.map(s => `• ${s}`).join("\n")}`,
  },

  // ── Interests ──────────────────────────────────────────
  {
    keys: ["interest", "hobby", "passion", "like", "enjoy", "love", "free time", "open source"],
    answer: () =>
      `❤️ **Soumik's Interests:**\n\n${r.interests.map(i => `• ${i}`).join("\n")}`,
  },

  // ── Hire / Available ───────────────────────────────────
  {
    keys: ["hire", "available", "job", "opportunity", "internship", "freelance", "collaborate", "work with", "recruit", "open to"],
    answer: () =>
      `✅ Yes! Soumik is **open to opportunities** — internships, freelance projects, and collaborations.\n\nReach out at:\n📧 **${r.contact.email}**\n💼 **${r.contact.linkedin}**`,
  },

  // ── Resume / Download ──────────────────────────────────
  {
    keys: ["resume", "cv", "download", "pdf"],
    answer: () =>
      `📄 You can **download Soumik's resume** using the button in the Resume section on this portfolio, or directly:\n👉 **/resume.pdf**`,
  },
];

// ─────────────────────────────────────────────────────────
// MAIN ANSWER FUNCTION
// ─────────────────────────────────────────────────────────
export function getAnswer(input) {
  const q = input.toLowerCase().trim();
  if (!q) return null;

  // Find the first matching KB entry
  for (const entry of KB) {
    if (entry.keys.some((k) => q.includes(k))) {
      return entry.answer();
    }
  }

  // Off-topic fallback — friendly redirect
  return `🙂 I'm only trained on Soumik's resume and professional info. I can't answer that!\n\nBut feel free to ask me about:\n• 🎓 **School & College** — education background\n• 💡 **Skills** — tech stack & tools\n• 🛠️ **Projects** — what he's built\n• 🏆 **Experience** — hackathons & leadership\n• 📬 **Contact** — how to reach him\n• 📄 **Resume** — download it!`;
}
