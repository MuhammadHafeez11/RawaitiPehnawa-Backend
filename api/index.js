// Vercel serverless function entry point
import app from '../src/server.js';

// Export as serverless function handler
export default (req, res) => {
  return app(req, res);
};