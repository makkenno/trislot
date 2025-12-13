import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { indexedDBStorage } from "../lib/indexeddb-storage";
import type { ActiveSkill, BacklogItem, HistoryItem } from "../types/skill";

interface SkillState {
  mode: "backlog" | "active" | "history";
  backlog: BacklogItem[];
  activeSkills: ActiveSkill[];
  history: HistoryItem[];

  setMode: (mode: "backlog" | "active" | "history") => void;
  addBacklogItem: (title: string) => void;
  moveToActive: (itemId: string) => void;
  moveToBacklog: (skillId: string) => void;
  moveToHistory: (skillId: string) => void;
  updateActiveSkill: (id: string, updates: Partial<ActiveSkill>) => void;
  deleteBacklogItem: (id: string) => void;
  deleteActiveSkill: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set, get) => ({
      mode: "active",
      backlog: [],
      activeSkills: [],
      history: [],

      setMode: (mode) => set({ mode }),

      addBacklogItem: (title) => {
        const newItem: BacklogItem = {
          id: crypto.randomUUID(),
          title,
          createdAt: Date.now(),
        };
        set((state) => ({ backlog: [newItem, ...state.backlog] }));
      },

      moveToActive: (itemId) => {
        const { backlog, activeSkills } = get();
        if (activeSkills.length >= 3) {
          console.warn("Cannot have more than 3 active skills.");
          return;
        }

        const item = backlog.find((i) => i.id === itemId);
        if (!item) return;

        const newSkill: ActiveSkill = {
          id: item.id,
          title: item.title,
          context: "",
          action: "",
          proficiency: 0,
          startedAt: Date.now(),
        };

        set((state) => ({
          backlog: state.backlog.filter((i) => i.id !== itemId),
          activeSkills: [...state.activeSkills, newSkill],
        }));
      },

      moveToBacklog: (skillId) => {
        const { activeSkills } = get();
        const skill = activeSkills.find((s) => s.id === skillId);
        if (!skill) return;

        const newItem: BacklogItem = {
          id: skill.id,
          title: skill.title,
          createdAt: Date.now(),
        };

        set((state) => ({
          activeSkills: state.activeSkills.filter((s) => s.id !== skillId),
          backlog: [newItem, ...state.backlog],
        }));
      },

      moveToHistory: (skillId) => {
        const { activeSkills } = get();
        const skill = activeSkills.find((s) => s.id === skillId);
        if (!skill) return;

        const historyItem: HistoryItem = {
          ...skill,
          completedAt: Date.now(),
          proficiency: 100, // Ensure it's marked as complete
        };

        set((state) => ({
          activeSkills: state.activeSkills.filter((s) => s.id !== skillId),
          history: [historyItem, ...state.history],
        }));
      },

      updateActiveSkill: (id, updates) => {
        set((state) => ({
          activeSkills: state.activeSkills.map((skill) =>
            skill.id === id ? { ...skill, ...updates } : skill,
          ),
        }));
      },

      deleteBacklogItem: (id) => {
        set((state) => ({
          backlog: state.backlog.filter((i) => i.id !== id),
        }));
      },

      deleteActiveSkill: (id) => {
        set((state) => ({
          activeSkills: state.activeSkills.filter((s) => s.id !== id),
        }));
      },

      deleteHistoryItem: (id) => {
        set((state) => ({
          history: state.history.filter((i) => i.id !== id),
        }));
      },
    }),
    {
      name: "skill-storage",
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);
