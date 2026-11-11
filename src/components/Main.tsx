import Search from "./Search";
import List from "./List";
import Form from "./Form";

import { furs } from "../data/furs";
import { useState } from "react";
import type { Furry } from "../types";
import { Shortlist } from "./Shortlist";

function Main() {
    const [liked, setLiked] = useState<Furry["id"][]>([1, 3]);

    return (
        <>
            {/* Search & Shortlist */}
            <div className="mt-24 grid gap-8 sm:grid-cols-2">
                {/* Search */}
                <Search />
                {/* Shortlist */}
                <Shortlist />
            </div>
            {/* Kitten list */}
            <List furs={furs} liked={liked} setLiked={setLiked} />
            {/* New Kitten form */}
            <Form />
        </>

    );
}

export default Main;