// Wraps an async controller so any thrown error / rejected promise is passed
// to Express's error-handling middleware instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
