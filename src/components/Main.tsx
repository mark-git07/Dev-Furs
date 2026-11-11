import { useState } from "react";

import Form from "./Form";
import List from "./List";
import Search from "./Search";
import Shortlist from "./Shortlist";

import { furs } from "../data/furs";
import type { Furry } from "../types";
import { LikedContext } from "../context/liked-context";

function Main() {
    const [liked, setLiked] = useState<Furry["id"][]>([1, 3]);

    return (
        <>
            <LikedContext value={{ liked, setLiked }}>
                <div className="mt-24 grid gap-8 sm:grid-cols-2">
                    <Search />
                    <Shortlist furs={furs} />
                </div>
                <List furs={furs} />
            </LikedContext>
            <Form />
        </>

    );
}

export default Main;