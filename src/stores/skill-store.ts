import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { indexedDBStorage } from "../lib/indexeddb-storage";
import type { ActiveSkill, BacklogItem } from "../types/skill";

interface SkillState {
  mode: "backlog" | "active";
  backlog: BacklogItem[];
  activeSkills: ActiveSkill[];

  setMode: (mode: "backlog" | "active") => void;
  addBacklogItem: (title: string) => void;
  moveToActive: (itemId: string) => void;
  moveToBacklog: (skillId: string) => void;
  updateActiveSkill: (id: string, updates: Partial<ActiveSkill>) => void;
  deleteBacklogItem: (id: string) => void;
  deleteActiveSkill: (id: string) => void;
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set, get) => ({
      mode: "active",
      backlog: [],
      activeSkills: [],

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
          // Ideally invoke a toast or error here, handled by UI logic usually
          // For now, we simply return
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
          createdAt: Date.now(), // Reset date or keep original? Keeping new date for sort order at top
        };

        set((state) => ({
          activeSkills: state.activeSkills.filter((s) => s.id !== skillId),
          backlog: [newItem, ...state.backlog],
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
    }),
    {
      name: "skill-storage",
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);
