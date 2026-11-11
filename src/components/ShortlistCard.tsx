import type { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { type Furry } from "../types";

type FurryCardProps = {
    id: Furry["id"],
    Furry: Furry,
    liked: Furry["id"][],
    setLiked: Dispatch<SetStateAction<Furry["id"][]>>
};

export function ShortlistCard({ id, Furry, liked, setLiked }: FurryCardProps) {
    return (
        <>
            <li className="relative flex items-center overflow-clip rounded-md bg-white shadow-sm ring ring-black/5 transition duration-100 starting:scale-0 starting:opacity-0">
                <img
                    height={32}
                    width={32}
                    alt={Furry.name}
                    className="aspect-square w-8 object-cover"
                    src={Furry.imagePath}
                />
                <p className="px-3 text-sm text-slate-800">{Furry.name}</p>
                <button className="group h-full border-l border-slate-100 px-2 hover:bg-slate-100">
                    <X 
                        onClick={() =>  
                            liked.includes(id) 
                                ? setLiked(liked.filter((likedId) => likedId !== id)) 
                                : setLiked([...liked, id]) }
                        className="size-4 stroke-slate-400 group-hover:stroke-red-400"
                    />
                </button>
            </li>
        </>
    );
}