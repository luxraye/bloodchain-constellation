// ─────────────────────────────────────────────────────
// Bloodchain Core — Configuration
// ─────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// Prisma Client Singleton
const prisma = new PrismaClient();

const PORT = parseInt(process.env.PORT || "4000", 10);
const DATABASE_URL = process.env.DATABASE_URL || "";

export { prisma, PORT, DATABASE_URL };
