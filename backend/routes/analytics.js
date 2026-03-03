import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Event from "../models/Event.js";
import Interest from "../models/Interest.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// Get organizer analytics
router.get("/organizer", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all events for this organizer
    const events = await Event.find({ organizer: userId });
    
    // Get all interests for these events
    const eventIds = events.map(e => e._id);
    // FIXED: Changed ₹in to $in (MongoDB operator always uses $)
    const interests = await Interest.find({ event: { $in: eventIds } });
    
    // Get all chats for these events
    const chats = await Chat.find({ event: { $in: eventIds } });

    // Calculate metrics
    const totalEvents = events.length;
    const totalInterests = interests.length;
    const totalChats = chats.length;
    
    // Calculate average budget (in rupees)
    const totalBudget = events.reduce((sum, e) => sum + (e.budget || 0), 0);
    const averageBudget = totalEvents > 0 ? totalBudget / totalEvents : 0;
    
    // Calculate total attendees
    const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
    
    // Get top categories
    const categoryCount = {};
    events.forEach(e => {
      if (e.type) {
        categoryCount[e.type] = (categoryCount[e.type] || 0) + 1;
      }
    });
    
    const topCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Calculate sponsorship metrics (all in rupees)
    const totalPotential = totalBudget * 0.3; // Assume 30% of budget comes from sponsors
    const averagePerEvent = totalEvents > 0 ? totalPotential / totalEvents : 0;
    const conversionRate = totalInterests > 0 
      ? Math.round((totalChats / totalInterests) * 100) 
      : 0;
    const responseRate = 82; // This would come from actual response time data

    // Get recent interests
    const recentInterests = await Interest.find({ event: { $in: eventIds } })
      .populate("event", "title")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedRecentInterests = recentInterests.map(i => ({
      event: i.event.title,
      sponsors: i.sponsors?.length || 1,
      date: new Date(i.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }));

    // Events by month (last 6 months)
    const eventsByMonth = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = events.filter(e => {
        const eventDate = new Date(e.startDate);
        return eventDate.getMonth() === month.getMonth() &&
               eventDate.getFullYear() === month.getFullYear();
      }).length;
      
      eventsByMonth.push({
        month: months[month.getMonth()],
        count
      });
    }

    res.json({
      success: true,
      analytics: {
        totalEvents,
        totalInterests,
        totalChats,
        totalViews: totalEvents * 150, // Mock views data
        averageBudget, // in rupees
        totalAttendees,
        topCategories,
        recentInterests: formattedRecentInterests,
        eventsByMonth,
        sponsorshipMetrics: {
          totalPotential, // in rupees
          averagePerEvent, // in rupees
          conversionRate,
          responseRate,
        }
      }
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

export default router;