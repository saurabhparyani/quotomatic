import { QUOTE_API, unsplash } from "./apis";

// fetch quote
export const fetchRandomQuote = async () => {
    try {

        const res = await fetch(`${QUOTE_API}/quotes/random`);
        const result = await res.json();
        const { content, author } = await result[0];
        const keywords = await content.trim().replace(/[,.]/g, "").split(" ");
        const longestKeyword = keywords.reduce((pre, cur) => pre.length > cur.length ? pre : cur);
        const unsplashResponse = await unsplash.search.getPhotos({
            query: longestKeyword, pages: 1, perPage: 1
        })
        const image = unsplashResponse.response.results[0].urls.regular
        return { content, author, image, error: "" }
    } catch (error) {
        return {
            error: "Something Went Wrong! Please check internet connection or refresh!",
            content: "",
            author: "",
            image: ""
        }
    }
}