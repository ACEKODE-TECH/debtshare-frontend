import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveGroupState {
  activeGroupId: string | null;
  setActiveGroup: (id: string) => void;
  clearActiveGroup: () => void;
}

export const useActiveGroupStore = create<ActiveGroupState>()(
  persist(
    (set) => ({
      activeGroupId: null,
      setActiveGroup: (id) => set({ activeGroupId: id }),
      clearActiveGroup: () => set({ activeGroupId: null }),
    }),
    {
      name: "debtshare-active-group",
    },
  ),
);
