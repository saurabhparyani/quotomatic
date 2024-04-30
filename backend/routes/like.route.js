import { Router } from "express";
const router = Router();
import { likeAQuote, getAUser } from "../controllers/like.controller";

router.post("/", likeAQuote)
router.get("/:userId", getAUser)

export default router;