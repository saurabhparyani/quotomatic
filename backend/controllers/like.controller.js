// import user model
import User, { findOne } from "../model/User.model";

export async function getAUser(req, res) {
    try {
        const { userId } = req.params;
        const user = await findOne({ userId });
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export async function likeAQuote(req, res) {
    try {
        const { userId, likedQuote } = req.body;
        const user = await findOne({ userId });

        // If the user doesn't exist
        if (!user) {
            const newUser = new User({
                userId,
                likes: [
                    likedQuote
                ]
            })
            await newUser.save()
            return res.status(200).json(newUser)
        }

        // If the user exists
        // check if quote already exists
        let sameQuote = user.likes.filter(quote => quote.quotation === likedQuote.quotation)
        if (sameQuote.length) {
            return res.status(200).json(user)
        }
        user.likes.push(likedQuote)
        await user.save();
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}