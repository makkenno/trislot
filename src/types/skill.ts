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
}

export interface HistoryItem extends ActiveSkill {
  completedAt: number;
}
