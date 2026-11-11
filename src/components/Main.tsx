import Search from "./Search";
import Shortlist from "./Shortlist";
import List from "./List";
import Form from "./Form";

import { kitties } from "../data/kitties";
import { useState } from "react";
import type { Kitty } from "../types";

function Main() {
    const [liked, setLiked] = useState<Kitty["id"][]>([1, 3]);

    return (
        <>
            {/* Search & Shortlist */}
            <div className="mt-24 grid gap-8 sm:grid-cols-2">
                {/* Search */}
                <Search />
                {/* Shortlist */}
                <Shortlist kitties={kitties} liked={liked} setLiked={setLiked}/>
            </div>
            {/* Kitten list */}
            <List kitties={kitties} liked={liked} setLiked={setLiked} />
            {/* New Kitten form */}
            <Form />
        </>

    );
}

export default Main;