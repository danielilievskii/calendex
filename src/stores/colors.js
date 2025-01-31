import { defineStore } from "pinia";

export const useColorStore = defineStore("colors", {
    state: () => ({
        red: {
            border: "border-red-500",
            background_light: "bg-red-100",
            background: "bg-red-500",
        },
        orange: {
            border: "border-orange-500",
            background_light: "bg-orange-100",
            background: "bg-orange-500",
        },
        yellow: {
            border: "border-yellow-500",
            background_light: "bg-yellow-100",
            background: "bg-yellow-500",
        },
        green: {
            border: "border-green-500",
            background_light: "bg-green-100",
            background: "bg-green-500",
        },
        teal: {
            border: "border-teal-500",
            background_light: "bg-teal-100",
            background: "bg-teal-500",
        },
        blue: {
            border: "border-blue-500",
            background_light: "bg-blue-100",
            background: "bg-blue-500",
        },
        purple: {
            border: "border-purple-500",
            background_light: "bg-purple-100",
            background: "bg-purple-500",
        },
        pink: {
            border: "border-pink-500",
            background_light: "bg-pink-100",
            background: "bg-pink-500",
        },
        gray: {
            border: "border-gray-500",
            background_light: "bg-gray-100",
            background: "bg-gray-500",
        },
    }),

    getters: {
        getBackgroundColor: (state) => (color) => {
            return state[color].background
        },

        getBackgroundLightColor: (state) => (color) => {
            return state[color].background_light
        },
        getBorderColor: (state) => (color) => {
            return state[color].border
        },
    }
});
