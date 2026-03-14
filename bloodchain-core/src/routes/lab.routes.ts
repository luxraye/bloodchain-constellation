import { Router } from 'express';
import * as labController from '../controllers/lab.controller';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

// Apply Authentication to all Lab Routes
router.use(requireAuth);

// Enforce Casbin RBAC for all these routes
router.use(requireRole("LAB_TECH", "LAB_SUPERVISOR", "SUPER_ADMIN", "ADMIN", "LAB"));

// Endpoints
router.get("/scan/:code", labController.scanUnit);
router.post("/tti-screen", labController.ttiScreen);
router.post("/split", labController.splitComponent);

export default router;
