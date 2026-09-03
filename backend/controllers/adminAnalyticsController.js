import {
  getAdminAnalyticsSummary,
} from '../services/adminAnalyticsService.js'


export const getAdminDashboardAnalytics =
  async (req, res, next) => {
    try {
      const analytics =
        await getAdminAnalyticsSummary()

      return res.status(200).json({
        success: true,
        data: analytics,
      })
    } catch (error) {
      next(error)
    }
  }