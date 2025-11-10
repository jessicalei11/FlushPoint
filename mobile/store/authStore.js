import { create } from "zustand";

export const userAuthStore = create ((set) => ({
    user: { name: "john"},

    sayHello: () => console.log("hello"),
}));