export type Interest = 'data' | 'ml' | 'web' | 'automation';
export type Level = 'beginner' | 'basic' | 'comfortable';
export type Goal = 'skill' | 'portfolio' | 'internship' | 'explore';
export type Lang = 'python' | 'javascript' | 'any';

export interface Selections {
  interest: Interest;
  level: Level;
  goal: Goal;
  lang: Lang;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  problem: string;
  why: string;
  difficulty: 'Beginner' | 'Beginner+' | 'Intermediate';
  stack: string[];
  steps: [string, string, string];
  extension: string;
  workshopLearning: string;
  interests: Interest[];
  levels: Level[];
  goals: Goal[];
  langs: Exclude<Lang, 'any'>[];
}

export const INTEREST_LABELS: Record<Interest, string> = {
  data: 'Data Analytics',
  ml: 'AI and Machine Learning',
  web: 'Web Development',
  automation: 'Productivity and Automation',
};
export const LEVEL_LABELS: Record<Level, string> = {
  beginner: 'Complete beginner',
  basic: 'Basic coding knowledge',
  comfortable: 'Comfortable with coding',
};
export const GOAL_LABELS: Record<Goal, string> = {
  skill: 'Learn a practical skill',
  portfolio: 'Build a portfolio project',
  internship: 'Prepare for internships',
  explore: 'Explore AI',
};
export const LANG_LABELS: Record<Lang, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  any: 'No preference',
};

export const PROJECTS: ProjectTemplate[] = [
  {
    id: 'placement-insights',
    title: 'Student Placement Insights Dashboard',
    description:
      'A small dashboard that loads a sample placement dataset and highlights which skills, CGPA ranges and branches appear most often among placed students.',
    problem: 'Students often guess which skills matter for placements instead of looking at data.',
    why: 'Turns a familiar question into a data story you can explain confidently in interviews.',
    difficulty: 'Beginner',
    stack: ['Python', 'pandas', 'Matplotlib', 'Google Colab'],
    steps: [
      'Load a public sample placement CSV into Google Colab with pandas.',
      'Clean the columns and compute simple group-by summaries.',
      'Plot 3 charts and write one insight under each chart.',
    ],
    extension: 'Add a simple logistic-regression model that estimates placement likelihood from a few features.',
    workshopLearning: 'How to load a dataset, ask a question of it, and present one chart-backed insight.',
    interests: ['data'],
    levels: ['beginner', 'basic'],
    goals: ['portfolio', 'internship', 'skill'],
    langs: ['python'],
  },
  {
    id: 'sentiment-classifier',
    title: 'Beginner Sentiment Classifier',
    description:
      'A tiny model that reads short reviews or feedback comments and labels them as positive, negative or neutral.',
    problem: 'Reading hundreds of feedback comments by hand is slow and inconsistent.',
    why: 'Introduces the full ML loop — data, training, prediction — with an outcome anyone can understand.',
    difficulty: 'Beginner+',
    stack: ['Python', 'scikit-learn', 'Google Colab'],
    steps: [
      'Load a small labelled review dataset.',
      'Convert text to features with TF-IDF and train a logistic-regression classifier.',
      'Test it on your own sentences and inspect where it is wrong.',
    ],
    extension: 'Wrap the model in a Gradio interface so friends can try it in the browser.',
    workshopLearning: 'What “training a model” actually means and how to check whether predictions make sense.',
    interests: ['ml'],
    levels: ['beginner', 'basic'],
    goals: ['explore', 'skill', 'portfolio'],
    langs: ['python'],
  },
  {
    id: 'idea-explorer',
    title: 'AI Project Idea Explorer',
    description:
      'A web page where users choose interests and skill level and receive a matched project suggestion — like the tool you are using right now.',
    problem: 'Beginners struggle to pick a first project that matches their skills.',
    why: 'Shows you can combine UI, simple recommendation logic and good product thinking.',
    difficulty: 'Beginner+',
    stack: ['HTML', 'CSS', 'JavaScript'],
    steps: [
      'Write a small list of project templates as JavaScript objects.',
      'Build a form with dropdowns for interest and level.',
      'Score templates against the selections and render the best match.',
    ],
    extension: 'Replace rule-based scoring with an LLM API call and compare the results.',
    workshopLearning: 'How a simple recommender works and how to turn logic into an interactive page.',
    interests: ['web', 'ml'],
    levels: ['beginner', 'basic'],
    goals: ['portfolio', 'explore'],
    langs: ['javascript'],
  },
  {
    id: 'study-planner',
    title: 'Smart Study Planner',
    description:
      'A planner that takes your subjects, exam dates and free hours and produces a balanced day-by-day study schedule.',
    problem: 'Students under-plan weak subjects and cram close to exams.',
    why: 'A useful tool you will actually use, with clear logic you can explain.',
    difficulty: 'Beginner',
    stack: ['JavaScript', 'HTML', 'LocalStorage'],
    steps: [
      'Collect subjects, difficulty ratings and exam dates in a form.',
      'Allocate hours using a weighted rule (difficulty × days remaining).',
      'Display the schedule and save it in the browser.',
    ],
    extension: 'Use an LLM to generate short revision checklists for each session.',
    workshopLearning: 'How to translate a real problem into rules and inputs a program can work with.',
    interests: ['automation', 'web'],
    levels: ['beginner', 'basic'],
    goals: ['skill', 'explore'],
    langs: ['javascript', 'python'],
  },
  {
    id: 'resume-keyword',
    title: 'Resume Keyword Matcher',
    description:
      'Paste a job description and your resume text; the tool highlights missing keywords and a simple match score.',
    problem: 'Students send the same resume everywhere without tailoring it.',
    why: 'Directly useful during internship season and teaches basic text processing.',
    difficulty: 'Beginner+',
    stack: ['Python', 'scikit-learn (TF-IDF)', 'Streamlit'],
    steps: [
      'Tokenise both texts and remove common stop-words.',
      'Compute overlap and cosine similarity using TF-IDF vectors.',
      'Show missing keywords in a Streamlit page.',
    ],
    extension: 'Group keywords into skill categories using a small embedding model.',
    workshopLearning: 'How computers compare text and why similarity scores are only a rough signal.',
    interests: ['ml', 'automation'],
    levels: ['basic', 'comfortable'],
    goals: ['internship', 'portfolio'],
    langs: ['python'],
  },
  {
    id: 'expense-insights',
    title: 'Hostel Expense Insights',
    description:
      'Upload a monthly expense sheet and get category totals, trends and a simple next-month spending estimate.',
    problem: 'Students rarely know where their monthly money goes.',
    why: 'Practises cleaning messy data and drawing honest conclusions from it.',
    difficulty: 'Beginner',
    stack: ['Python', 'pandas', 'Plotly'],
    steps: [
      'Create or load an expense CSV with date, category and amount.',
      'Group by category and month to find patterns.',
      'Fit a simple trend line to estimate next month.',
    ],
    extension: 'Auto-categorise free-text expense notes with a keyword or ML classifier.',
    workshopLearning: 'Basic data cleaning, aggregation and the limits of simple forecasts.',
    interests: ['data', 'automation'],
    levels: ['beginner'],
    goals: ['skill', 'explore'],
    langs: ['python'],
  },
  {
    id: 'faq-bot',
    title: 'College FAQ Chat Assistant',
    description:
      'A browser chat widget that answers common college questions (fees deadlines, library hours) by matching against a curated FAQ list.',
    problem: 'The same questions get asked repeatedly in college groups.',
    why: 'Shows the foundation of retrieval-based assistants without needing paid APIs.',
    difficulty: 'Intermediate',
    stack: ['JavaScript', 'React', 'Fuse.js (fuzzy search)'],
    steps: [
      'Write 20 FAQ question–answer pairs as JSON.',
      'Use fuzzy search to find the closest question to user input.',
      'Render a chat interface with a fallback “I am not sure” reply.',
    ],
    extension: 'Swap fuzzy search for embeddings and add an LLM to rephrase answers.',
    workshopLearning: 'How retrieval works and why assistants need a fallback when confidence is low.',
    interests: ['web', 'ml'],
    levels: ['basic', 'comfortable'],
    goals: ['portfolio', 'internship'],
    langs: ['javascript'],
  },
  {
    id: 'attendance-automation',
    title: 'Attendance Report Automator',
    description:
      'A script that reads a raw attendance spreadsheet and produces per-student percentages and a shortage alert list.',
    problem: 'Class representatives spend hours computing attendance manually.',
    why: 'Automation projects demonstrate clear time saved — a strong interview story.',
    difficulty: 'Beginner',
    stack: ['Python', 'openpyxl / pandas'],
    steps: [
      'Read the attendance sheet into a DataFrame.',
      'Compute attendance percentage per student and subject.',
      'Export a formatted report highlighting students below 75%.',
    ],
    extension: 'Schedule the script to run weekly and email the report.',
    workshopLearning: 'How to automate a repetitive task end-to-end with a short script.',
    interests: ['automation', 'data'],
    levels: ['beginner', 'basic'],
    goals: ['skill', 'internship'],
    langs: ['python'],
  },
  {
    id: 'image-sorter',
    title: 'Image Classifier for Waste Sorting',
    description:
      'Use a pre-trained image model to classify photos of waste as recyclable, organic or other.',
    problem: 'Waste segregation on campus is often done incorrectly.',
    why: 'Introduces transfer learning — a core modern AI technique — with a social-impact angle.',
    difficulty: 'Intermediate',
    stack: ['Python', 'TensorFlow / Keras', 'Google Colab'],
    steps: [
      'Load a pre-trained MobileNet model in Colab.',
      'Fine-tune the last layer on a small labelled image set.',
      'Evaluate accuracy and test with your own photos.',
    ],
    extension: 'Deploy as a web demo with TensorFlow.js running in the browser.',
    workshopLearning: 'Why pre-trained models let beginners build useful AI with small datasets.',
    interests: ['ml'],
    levels: ['comfortable', 'basic'],
    goals: ['portfolio', 'internship', 'explore'],
    langs: ['python', 'javascript'],
  },
  {
    id: 'job-tracker',
    title: 'Internship Application Tracker',
    description:
      'A small web app to log applications, statuses and follow-up dates, with a chart of your pipeline.',
    problem: 'Applicants lose track of where they applied and when to follow up.',
    why: 'A complete CRUD app plus a dashboard — practical and easy to demo.',
    difficulty: 'Beginner+',
    stack: ['JavaScript', 'React', 'LocalStorage', 'Chart.js'],
    steps: [
      'Build a form to add applications with company, role and status.',
      'Store entries in LocalStorage and list them in a table.',
      'Add a chart that shows counts by status.',
    ],
    extension: 'Add AI-generated follow-up email drafts based on application status.',
    workshopLearning: 'How to structure a small app: data model, UI and persistence.',
    interests: ['web', 'automation', 'data'],
    levels: ['basic', 'comfortable'],
    goals: ['internship', 'portfolio', 'skill'],
    langs: ['javascript'],
  },
];

/** Deterministic scoring: higher is a better match. */
export function scoreProject(p: ProjectTemplate, s: Selections): number {
  let score = 0;
  if (p.interests[0] === s.interest) score += 6;
  else if (p.interests.includes(s.interest)) score += 4;
  if (p.levels.includes(s.level)) score += 3;
  if (p.goals[0] === s.goal) score += 2.5;
  else if (p.goals.includes(s.goal)) score += 1.5;
  if (s.lang === 'any') score += 1;
  else if (p.langs.includes(s.lang)) score += 2;
  // Penalise hard projects for complete beginners.
  if (s.level === 'beginner' && p.difficulty === 'Intermediate') score -= 3;
  return score;
}

/** Ranked list of projects for given selections (stable tie-break by id). */
export function rankProjects(s: Selections): ProjectTemplate[] {
  return [...PROJECTS].sort((a, b) => scoreProject(b, s) - scoreProject(a, s) || a.id.localeCompare(b.id));
}

/** Returns the n-th ranked recommendation, cycling through the top matches. */
export function recommend(s: Selections, attempt = 0): ProjectTemplate {
  const ranked = rankProjects(s);
  const pool = ranked.slice(0, 4);
  return pool[attempt % pool.length];
}

export function getProject(id: string | undefined): ProjectTemplate | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function projectToText(p: ProjectTemplate): string {
  return [
    `AI Project Idea: ${p.title}`,
    '',
    p.description,
    '',
    `Problem: ${p.problem}`,
    `Why it is useful: ${p.why}`,
    `Difficulty: ${p.difficulty}`,
    `Suggested stack: ${p.stack.join(', ')}`,
    '',
    'Steps:',
    ...p.steps.map((st, i) => `${i + 1}. ${st}`),
    '',
    `Extension: ${p.extension}`,
    `In a 60-minute intro workshop you could learn: ${p.workshopLearning}`,
    '',
    '— Generated with AI Sprint (curated templates, no external AI API)',
  ].join('\n');
}
