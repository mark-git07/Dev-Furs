import { Heart } from "lucide-react";
import type { Furry } from "../types";
import { useLiked } from "../context/liked-context";

export function LikeToggle({
        id
    }: { 
        id: Furry["id"];
    } ) {
    const { liked, setLiked } = useLiked();

    return (
        <button 
            className="group"
            onClick={() =>
                liked.includes(id)
                    ? setLiked(liked.filter((likedId: number) => likedId !== id))
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