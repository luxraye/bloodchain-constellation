// ─────────────────────────────────────────────────────
// Bloodchain Core — Server Entry Point
// The central API Gateway for the Bloodchain Ecosystem
// ─────────────────────────────────────────────────────

import express from "express";
import cors from "cors";
import { PORT, prisma } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import v1Router from "./routes";

const app = express();

// ─── Global Middleware ───────────────────────────────

const allowedOrigins: Array<string | RegExp> = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  /\.onrender\.com$/,
  /\.vercel\.app$/,
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      return callback(null, true);
    }
    // Do NOT throw — throwing makes express respond without CORS headers,
    // which the browser reports as "No 'Access-Control-Allow-Origin' header".
    console.warn("[cors] Blocked origin:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Explicitly answer preflight for every path (defensive).
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "operational",
        service: "Bloodchain Core",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});

// ─── API v1 Routes ───────────────────────────────────

app.use("/api/v1", v1Router);

// ─── Error Handler (must be last) ────────────────────

app.use(errorHandler);

// ─── Start Server ────────────────────────────────────

const start = async () => {
    try {
        // Verify database connection
        await prisma.$connect();
        console.log("✅ Database connected");

        app.listen(PORT, () => {
            const publicUrl =
                process.env.PUBLIC_URL ||
                (process.env.RENDER_EXTERNAL_URL
                    ? process.env.RENDER_EXTERNAL_URL
                    : `http://localhost:${PORT}`);
            console.log(`
╔══════════════════════════════════════════════╗
║         BLOODCHAIN CORE — API GATEWAY        ║
╠══════════════════════════════════════════════╣
║  Status:  OPERATIONAL
║  Port:    ${PORT}
║  API:     ${publicUrl}
║  Health:  ${publicUrl}/health
╚══════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

start();
