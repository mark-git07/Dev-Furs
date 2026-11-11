import type { Dispatch, SetStateAction } from "react";
import { Heart } from "lucide-react";

import { type Furry } from "../types";
import { ShortlistCard } from "./ShortlistCard";

function Shortlist({ 
    furs,
    liked,
    setLiked
    } : {
        furs: Furry[],
        liked: Furry["id"][],
        setLiked: Dispatch<SetStateAction<Furry["id"][]>> 
    }) {

    const isLiked = furs.filter(
        Furry => liked.includes(Furry.id)
    );

    return (
        <>
            <div>
                <h2 className="flex items-center gap-2 font-medium">
                    <span>Your shortlist</span>
                    <Heart className="fill-pink-500 stroke-none" />
                </h2>
                <ul className="mt-4 flex flex-wrap gap-4">
                    { isLiked.map( 
                        (Furry) => (<ShortlistCard id={Furry.id} Furry={Furry} liked={liked} setLiked={setLiked} />) 
                    )}
                </ul>
                </div>
        </>
    );
}

export default Shortlist;