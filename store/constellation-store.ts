"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ConstellationTheme, SharedConstellationDraft } from "@/types/constellation";

export type ConstellationStore = SharedConstellationDraft & {
  history: string[][];
  future: string[][];
  completed: boolean;
  setSky: (field: "cityId" | "date" | "time", value: string) => void;
  addStar: (id: string) => void;
  removeStar: (id: string) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  setClosed: (closed: boolean) => void;
  setName: (name: string) => void;
  setTheme: (theme: ConstellationTheme) => void;
  setMeaning: (meaning: string) => void;
  finish: () => void;
  reopen: () => void;
  importDraft: (draft: SharedConstellationDraft) => void;
};

const DEFAULT_DRAFT: SharedConstellationDraft = {
  cityId: "addis",
  date: "2026-11-13",
  time: "21:00",
  starIds: [],
  closed: false,
  name: "",
  theme: "Discovery",
  meaning: "",
};

function pushHistory(state: ConstellationStore, starIds: string[]) {
  return {
    starIds,
    history: [...state.history.slice(-19), state.starIds],
    future: [],
    completed: false,
  };
}

export const useConstellationStore = create<ConstellationStore>()(
  persist(
    (set) => ({
      ...DEFAULT_DRAFT,
      history: [],
      future: [],
      completed: false,
      setSky: (field, value) => set((state) => ({
        [field]: value,
        starIds: [],
        closed: false,
        history: state.starIds.length ? [...state.history.slice(-19), state.starIds] : state.history,
        future: [],
        completed: false,
      })),
      addStar: (id) => set((state) => {
        if (state.starIds.includes(id) || state.starIds.length >= 8) return state;
        return pushHistory(state, [...state.starIds, id]);
      }),
      removeStar: (id) => set((state) => {
        const next = state.starIds.filter((starId) => starId !== id);
        return { ...pushHistory(state, next), closed: next.length >= 3 && state.closed };
      }),
      undo: () => set((state) => {
        const previous = state.history.at(-1);
        if (!previous) return state;
        return {
          starIds: previous,
          closed: previous.length >= 3 && state.closed,
          history: state.history.slice(0, -1),
          future: [state.starIds, ...state.future.slice(0, 19)],
          completed: false,
        };
      }),
      redo: () => set((state) => {
        const next = state.future[0];
        if (!next) return state;
        return {
          starIds: next,
          closed: next.length >= 3 && state.closed,
          history: [...state.history.slice(-19), state.starIds],
          future: state.future.slice(1),
          completed: false,
        };
      }),
      clear: () => set((state) => state.starIds.length ? { ...pushHistory(state, []), closed: false } : state),
      setClosed: (closed) => set((state) => ({ closed: state.starIds.length >= 3 && closed, completed: false })),
      setName: (name) => set({ name: name.slice(0, 40), completed: false }),
      setTheme: (theme) => set({ theme, completed: false }),
      setMeaning: (meaning) => set({ meaning: meaning.slice(0, 160), completed: false }),
      finish: () => set((state) => ({ completed: state.starIds.length >= 3 && Boolean(state.name.trim()) })),
      reopen: () => set({ completed: false }),
      importDraft: (draft) => set({
        ...draft,
        starIds: draft.starIds.slice(0, 8),
        closed: Boolean(draft.closed && draft.starIds.length >= 3),
        name: draft.name.slice(0, 40),
        meaning: draft.meaning.slice(0, 160),
        history: [],
        future: [],
        completed: draft.starIds.length >= 3 && Boolean(draft.name.trim()),
      }),
    }),
    {
      name: "the-sky-constellation-draft",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        cityId: state.cityId,
        date: state.date,
        time: state.time,
        starIds: state.starIds,
        closed: state.closed,
        name: state.name,
        theme: state.theme,
        meaning: state.meaning,
        completed: state.completed,
      }),
    },
  ),
);
