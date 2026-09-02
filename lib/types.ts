export type CategoryType = 'sirali' | 'dongu' | 'kosul' | 'hata_ayiklama' | 'robotik';

export type SimulationType = 
  | 'sandwich' 
  | 'flower' 
  | 'teeth' 
  | 'robot_grid' 
  | 'tea' 
  | 'weather' 
  | 'school_bag'
  | 'morning_routine'
  | 'cake_baking'
  | 'traffic_light'
  | 'generic';

export interface AlgorithmStep {
  id: string;
  text: string;
  iconName: string; // Lucide icon identifier
  categoryColor: string; // Tailwind color string
  decisionRationale: string; // Pedagogical explanation for why this step is taken
  consequenceIfSkipped?: string; // What happens if this step is omitted or out of order
  loopCount?: number; // If inside a loop
  isCondition?: boolean;
  conditionValue?: string;
}

export interface GridItem {
  x: number;
  y: number;
  type: 'robot' | 'star' | 'obstacle' | 'strawberry' | 'coin' | 'flag' | 'key' | 'door';
}

export interface Level {
  id: string;
  title: string;
  gradeLevel: '1-2' | '3-4';
  category: CategoryType;
  difficulty: 'Kolay' | 'Orta' | 'Usta';
  scenario: string; // The child-friendly story/challenge
  mascotTip: string;
  simulationType: SimulationType;
  gridConfig?: {
    width: number;
    height: number;
    startPos: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' };
    targetPos: { x: number; y: number };
    items: GridItem[];
  };
  availableSteps: AlgorithmStep[];
  correctStepOrder: string[]; // array of step IDs
  // Alternative valid solutions if any
  alternativeValidOrders?: string[][];
  loopPattern?: {
    repeatCount: number;
    repeatedStepIds: string[];
  };
  conditionTarget?: {
    condition: string;
    expectedStepId: string;
  };
  // Decision Analysis provided at the end
  pedagogicalAnalysis: {
    coreConcept: string; // e.g. "Algoritmada Sıralama İlkesi"
    summary: string;
    whyItWorks: string;
    realLifeAnalogy: string;
    computerScienceConcept: string;
    stepByStepAnalysis: {
      stepNumber: number;
      stepTitle: string;
      whyImportant: string;
      criticalDecision: string;
    }[];
  };
}

export interface UserStats {
  solvedLevelIds: string[];
  totalStars: number;
  streak: number;
  totalAttempts: number;
  firstTimeCorrect: number;
  badges: Badge[];
  currentGrade: 'all' | '1-2' | '3-4';
  currentCategory: 'all' | CategoryType;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface VerificationResult {
  isCorrect: boolean;
  score: number;
  matchedCount: number;
  totalCount: number;
  userSteps: AlgorithmStep[];
  correctSteps: AlgorithmStep[];
  feedbackMessage: string;
  mistakeExplanation?: string;
  analysis: Level['pedagogicalAnalysis'];
}
