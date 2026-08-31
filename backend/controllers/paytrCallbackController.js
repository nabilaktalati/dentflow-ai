import {
  processPaytrCallback,
} from '../services/paytrCallbackService.js'


export const handlePaytrCallback =
  async (
    req,
    res,
    next,
  ) => {
    try {
      const {
        merchant_oid:
          merchantOid,

        status,

        total_amount:
          totalAmount,

        hash,
      } = req.body


      await processPaytrCallback({
        merchantOid,
        status,
        totalAmount,
        hash,
      })


      return res
        .status(200)
        .type('text/plain')
        .send('OK')
    } catch (error) {
      return next(error)
    }
  }