import { createApi } from "unsplash-js";

export const QUOTE_API = "https://api.quotable.io";
export const unsplash = createApi({
    accessKey: process.env.REACT_APP_UNSPLASH_SECRET_KEY
})