export const ok = (res, data, status = 200, meta) =>
  res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });

export const fail = (res, message, status = 500, details) =>
  res.status(status).json({ success: false, message, ...(details ? { details } : {}) });

