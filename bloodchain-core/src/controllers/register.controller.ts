// ─────────────────────────────────────────────────────
// Bloodchain Core — Register Controller (Public)
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import * as registerService from "../services/register.service";
import { apiSuccess, apiError } from "../lib/apiResponse";

// POST /register — Public donor self-signup (Azure only)
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, name, bloodType } = req.body;
        if (!email || !password || !name) {
            apiError(res, "Missing required fields: email, password, name", 400);
            return;
        }
        const result = await registerService.registerDonor({ email, password, name, bloodType });
        apiSuccess(res, { userId: result.user.id, email: result.user.email, name: result.user.name }, undefined, 201);
    } catch (e) { next(e); }
};
