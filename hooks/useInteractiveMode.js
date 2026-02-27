import { create } from 'zustand';
import { storage } from '#imports';

/**
 * Interactive mode store using zustand
 * Manages the state of interactive mode and provides actions
 */
const useInteractiveModeStore = create((set, get) => ({
  // State
  isInteractiveMode: false,
  isLoading: true,
  
  // Actions
  setInteractiveMode: (value) => set({ isInteractiveMode: value }),
  
  toggleInteractiveMode: () => set((state) => ({ 
    isInteractiveMode: !state.isInteractiveMode 
  })),
  
  initialize: async () => {
    try {
      const interactiveModeStore = storage.defineItem('local:interactiveMode', {
        fallback: false,
      });
      const value = await interactiveModeStore.getValue();
      set({ isInteractiveMode: value, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize interactive mode:', error);
      set({ isInteractiveMode: false, isLoading: false });
    }
  },
  
  saveInteractiveMode: async (value) => {
    try {
      const interactiveModeStore = storage.defineItem('local:interactiveMode', {
        fallback: false,
      });
      await interactiveModeStore.setValue(value);
      set({ isInteractiveMode: value });
    } catch (error) {
      console.error('Failed to save interactive mode:', error);
    }
  },
}));

export default useInteractiveModeStore;
