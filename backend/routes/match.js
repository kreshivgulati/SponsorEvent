/**
 * Matching Routes
 * GET /api/match/:sponsorId
 */

import express from "express";
import Event from "../models/Event.js";
import Sponsor from "../models/Sponsor.js";
import { authenticateToken } from "../middleware/auth.js"
const router = express.Router();

/**
 * GET /api/match/:sponsorId
 * Get matched events for a sponsor
 */
router.get("/:sponsorId", authenticateToken, async (req, res, next) => {
  try {
    const { sponsorId } = req.params;

    // Get sponsor from DB
    const sponsor = await Sponsor.findById(sponsorId);
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found",
      });
    }

    // Get all events
    const events = await Event.find();
    if (!events.length) {
      return res.json({
        success: true,
        sponsor,
        matches: [],
        message: "No events available",
      });
    }

    // Calculate match scores
    const matches = events.map((event) => {
      const breakdown = calculateMatchScore(event, sponsor);
      const totalScore = Object.values(breakdown).reduce(
        (sum, v) => sum + v,
        0
      );

      return {
        event,
        matchScore: totalScore,
        matchPercentage: Math.min(100, totalScore),
        breakdown,
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      sponsor,
      matches,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Match scoring logic
 */
function calculateMatchScore(event, sponsor) {
  const breakdown = {
    category: 0,
    audience: 0,
    budget: 0,
    location: 0,
  };

  if (sponsor.preferredCategories?.includes(event.category)) {
    breakdown.category = 40;
  }

  if (event.audienceSize >= sponsor.minAudience) {
    breakdown.audience = 30;
  }

  if (event.requiredBudget <= sponsor.maxBudget) {
    breakdown.budget = 20;
  }

  const eventLocation = event.location?.toLowerCase().trim();
  const sponsorLocation = sponsor.preferredLocation?.toLowerCase().trim();

  if (
    sponsorLocation === "any" ||
    eventLocation === sponsorLocation ||
    eventLocation?.includes(sponsorLocation) ||
    sponsorLocation?.includes(eventLocation)
  ) {
    breakdown.location = 10;
  }

  return breakdown;
}

export default router;
