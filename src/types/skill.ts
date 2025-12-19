export interface BacklogItem {
  id: string;
  title: string;
  createdAt: number;
}

export interface ActiveSkill {
  id: string;
  title: string;
  context: string;
  action: string;
  proficiency: number; // 0 to 100
  startedAt: number;
  practiceLogs: number[]; // timestamps
  notes: SkillNote[];
}

export interface SkillNote {
  id: string;
  text: string;
  createdAt: number;
}

export interface HistoryItem extends ActiveSkill {
  completedAt: number;
}
