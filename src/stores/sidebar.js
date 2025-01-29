import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        isSidebarCollapsed: false,
    }),
    actions: {
        toggleSidebar() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
    },
});