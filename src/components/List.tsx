import type { Dispatch, SetStateAction } from "react";
import { type Kitty } from "../types";
import ListCard from "./ListCard";

export function List({
        kitties, 
        liked, 
        setLiked
    }: { 
        kitties: Kitty[],
        liked: Kitty["id"][],
        setLiked: Dispatch<SetStateAction<Kitty["id"][]>> 
    } ) {
    return (
        <>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                { kitties.map(
                    (kitty) => (
                       <ListCard 
                            key={kitty.id} 
                            kitty={kitty} 
                            liked={liked} setLiked={setLiked}
                        />
                    )
                ) }
            </ul>
        </>
    );
}

export default List;