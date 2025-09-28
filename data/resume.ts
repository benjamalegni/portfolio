export const resume = {
  education: [
    {
      degree: "Bachelor of Science in Systems Engineering",
      university: "Faculty of Exact Sciences, UNICEN",
      location: "Tandil, Buenos Aires, Argentina",
      startDate: "2023-03",
      endDate: "Present",
      description: "",
    },
  ],
  certifications: [
    {
      name: "C1 Advanced",
      organization: "Cambridge Assessment English",
      date: "2022",
      details: "Proficient in spoken English · GPA: 194",
    },
    {
      name: "B2 First",
      organization: "Cambridge Assessment English",
      date: "2022",
      details: "Remarkable in Use of English and Listening · GPA: 196",
    },
  ],
  workExperience: [
     {
       title: "Security Analyst",
       company: "Accenture",
       location: "Buenos Aires, Argentina",
       startDate: "2024-03",
       endDate: "Present",
       description: "",
       achievements: [
         "Achievement 1: Expounded user guides and troubleshooting to request internal access for more than 1700 roles and 450 applications.",
         "Achievement 2: Responsible for user access migration from on-prem servers to centralized compliant system following group policies, SOX regulations and cloud resource management.",
       ],
     },

     {
       title: "Cashier & Support Staff",
       company: "La Esquina de Azu",
       location: "Pinamar, Buenos Aires, Argentina",
       startDate: "2020-01",
       endDate: "2024-03Summer Job)",
       description: "Summer Job involving customer service, cashier, and support staff.",
       achievements: [
         "Achievement 1: Handled cash and card payments while providing friendly service to customers",
         "Achievement 2: Helped with daily operations beyond the cashier role, including restocking, cleaning, and organizing orders",
         "Achievement 3: Assisted with inventory management and ensured the store was well-stocked and organizedApplied communication and active listening skills to understand customer needs and to resolve issues on the spot.",
       ],
     },


  ],
  softSkills: [
    "Collaborative team player: Collaborated effectively in a team environment to design and configure a scalable network infrastructure project for UNICEN using both IPv4 (with VLSM and static routing) and IPv6 (with RIPng).",
    "Communicative: Coordinated with peers; professionally assist cross-functional teams with troubleshooting access, guiding users of internal systems, and supporting data corrections and migrations.",
    "Problem-solver: Identify and solve problems to improve the efficiency of the team.",
  ],
  technicalSkills: {
    languagesTools: [
      "Java",
      "TypeScript/JavaScript",
      "ReactJS",
      "C++",
      "Linux",
      "ExpressJS",
      "GIT",
      "DevOps",
      "Pascal",
    ],
    algorithmAnalysis: "Foundations for algorithm analysis; understanding tools and techniques to design optimized algorithms.",
    mathematicalBackground: ["Calculus", "Algebra", "Discrete mathematics", "Physics"],
    networking: [
      "TCP/IP architecture",
      "IPv4/IPv6",
      "Ethernet protocols",
      "HTTP",
      "Wi‑Fi",
      "Network design for WANs, LANs and wireless systems",
    ],
    sdlc: [
      "UML diagrams",
      "User story mapping",
      "Scrum methodology",
      "Requirement analysis, specification, design, and development",
    ],
  },
  interests: [
    "Music production",
    "Reading fantasy books",
    "Formula 1",
    "Running",
    "Traveling",
    "Learning new languages",
  ],
  contact: {
    name: "Luka Benjamin Malegni",
    location: "Tandil, Buenos Aires, Argentina",
    email: "lukabenjaminmalegni@gmail.com",
    phone: "+54 2267 469069",
    linkedin: "LinkedIn",
  },
} as const 