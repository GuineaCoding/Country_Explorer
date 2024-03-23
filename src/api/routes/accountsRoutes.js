import express from "express";
import { accountsHandlers } from "./accountsHandlers.js";

const router = express.Router();

router.post("/users", accountsHandlers.createUser);
router.get("/users/:email", accountsHandlers.getUserByEmail);
router.put('/users/:email', accountsHandlers.updateUser);
router.post('/users/:email/analytics', accountsHandlers.updateUserAnalytics);

export default router;
