import { type Furry } from "../types";
import { LikeToggle } from "./LikeToggle";

type FurryCardProps = {
    furry: Furry
};

function ListCard ({ furry }: FurryCardProps) {
    return (
        <li
            key={furry.id}
            className="overflow-clip rounded-lg bg-white shadow-md ring ring-black/5 hover:-translate-y-0.5"
        >
            <img
                className="aspect-square object-cover"
                alt={furry.name}
                src={furry.imagePath}
            />
            <div className="gap flex items-center justify-between p-4 text-sm">
                <div className="flex items-center gap-2">
                    <p className="font-semibold">{furry.name}</p>
                    <span className="text-slate-300">·</span>
                    <p className="text-slate-500">{furry.vibe}</p>
                </div>
                <LikeToggle id={furry.id} />
            </div>
        </li>
    );
}

export default ListCard;