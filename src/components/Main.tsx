import { useState } from "react";

import Form from "./Form";
import List from "./List";
import Search from "./Search";
import Shortlist from "./Shortlist";

import { furs } from "../data/furs";
import type { Furry } from "../types";

function Main() {
    const [liked, setLiked] = useState<Furry["id"][]>([1, 3]);

    return (
        <>
            {/* Search & Shortlist */}
            <div className="mt-24 grid gap-8 sm:grid-cols-2">
                {/* Search */}
                <Search />
                {/* Shortlist */}
                <Shortlist furs={furs} liked={liked} setLiked={setLiked}/>
            </div>
            {/* Kitten list */}
            <List furs={furs} liked={liked} setLiked={setLiked} />
            {/* New Kitten form */}
            <Form />
        </>

    );
}

export default Main;