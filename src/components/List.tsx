import type { Dispatch, SetStateAction } from "react";
import { type Furry } from "../types";
import ListCard from "./ListCard";

export function List({
        furs, 
        liked, 
        setLiked
    }: { 
        furs: Furry[],
        liked: Furry["id"][],
        setLiked: Dispatch<SetStateAction<Furry["id"][]>> 
    } ) {
    return (
        <>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                { furs.map(
                    (Furry) => (
                       <ListCard 
                            key={Furry.id} 
                            furry={Furry} 
                            liked={liked} setLiked={setLiked}
                        />
                    )
                ) }
            </ul>
        </>
    );
}

export default List;