export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DentFlow AI API is running',
    data: {
      service: 'dentflow-api',
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    },
  })
}