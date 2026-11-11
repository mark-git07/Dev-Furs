import { type Furry } from "../types";
import ListCard from "./ListCard";

export function List({
        furs
    }: { 
        furs: Furry[]
    } ) {
    return (
        <>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                { furs.map(
                    (Furry) => (
                       <ListCard key={Furry.id} furry={Furry}
                        />
                    )
                ) }
            </ul>
        </>
    );
}

export default List;