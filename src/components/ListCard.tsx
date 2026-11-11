import type { Dispatch, SetStateAction } from "react";
import { type Kitty } from "../types";
import { LikeToggle } from "./LikeToggle";

type KittyCardProps = {
    kitty: Kitty,
    liked: Kitty["id"][],
    setLiked: Dispatch<SetStateAction<Kitty["id"][]>>
};

function ListCard ({ kitty, liked, setLiked }: KittyCardProps) {
    return (
        <li
            key={kitty.id}
            className="overflow-clip rounded-lg bg-white shadow-md ring ring-black/5 hover:-translate-y-0.5"
        >
            <img
                className="aspect-square object-cover"
                alt={kitty.name}
                src={kitty.imagePath}
            />
            <div className="gap flex items-center justify-between p-4 text-sm">
                <div className="flex items-center gap-2">
                    <p className="font-semibold">{kitty.name}</p>
                    <span className="text-slate-300">·</span>
                    <p className="text-slate-500">{kitty.vibe}</p>
                </div>
                <LikeToggle id={kitty.id} liked={liked} setLiked={setLiked}/>
            </div>
        </li>
    );
}

export default ListCard;