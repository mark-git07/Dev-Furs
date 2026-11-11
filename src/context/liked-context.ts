import { createContext, use, type Dispatch, type SetStateAction } from "react";
import type { Furry } from "../types";

export const LikedContext = createContext<{
    liked: Furry["id"][];
    setLiked: Dispatch<SetStateAction<Furry["id"][]>>;
}>({
    liked: [],
    setLiked: () => {},
});

export function useLiked() {
    const context = use(LikedContext);

    if(! context) {
        throw new Error("The useLiked hook must be used within the LikedContext wrapper/provider.");
    }

    return context;
}