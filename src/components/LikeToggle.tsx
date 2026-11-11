import { Heart } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import type { Kitty } from "../types";

export function LikeToggle({
        id,
        liked, 
        setLiked
    }: { 
        id: Kitty["id"];
        liked: Kitty["id"][];
        setLiked: Dispatch<SetStateAction<Kitty["id"][]>>;
    } ) {
    return (
        <button 
            className="group"
            onClick={() => { liked.includes(id) ? setLiked(liked.filter((likedId) => likedId !== id)) : setLiked([...liked, id]) }}
        >
            <Heart className={
                    liked.includes(id)
                        ? "fill-pink-500 stroke-none"
                        : "stroke-slate-200 group-hover:stroke-slate-300"
                } />
        </button>
    );
}