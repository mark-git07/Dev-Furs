import { Heart } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import type { Furry } from "../types";

export function LikeToggle({
        id,
        liked, 
        setLiked
    }: { 
        id: Furry["id"];
        liked: Furry["id"][];
        setLiked: Dispatch<SetStateAction<Furry["id"][]>>;
    } ) {
    return (
        <button 
            className="group"
            onClick={() =>
                liked.includes(id)
                    ? setLiked(liked.filter((likedId) => likedId !== id))
                    : setLiked([...liked, id])
            }
        >
            <Heart className={
                    liked.includes(id)
                        ? "fill-pink-500 stroke-none"
                        : "stroke-slate-200 group-hover:stroke-slate-300"
                } />
        </button>
    );
}