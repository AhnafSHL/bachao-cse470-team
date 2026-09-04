import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import {
  connectDB,
  disconnectDB,
} from './config/db.js';

import {
  notFound,
  errorHandler,
} from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import helpRequestRoutes from './routes/helpRequestRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import shelterRoutes from './routes/shelterRoutes.js';
import missingPersonRoutes from './routes/missingPersonRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN || true,

    credentials: true,
  })
);

app.use(express.json());

if (
  process.env.NODE_ENV !==
  'production'
) {
  app.use(morgan('dev'));
}

app.get(
  '/api/health',
  (req, res) =>
    res.json({
      status: 'ok',
      app: 'Bachao',
      time: new Date(),
    })
);

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/requests',
  helpRequestRoutes
);

app.use(
  '/api/volunteer',
  volunteerRoutes
);

app.use(
  '/api/ratings',
  ratingRoutes
);

app.use(
  '/api/campaigns',
  campaignRoutes
);

app.use(
  '/api/shelters',
  shelterRoutes
);

app.use(
  '/api/missing',
  missingPersonRoutes
);

app.use(
  '/api/dashboard',
  dashboardRoutes
);

app.use(notFound);
app.use(errorHandler);

const PORT =
  process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(
      PORT,
      () =>
        console.log(
          `🚀 Bachao API running on http://localhost:${PORT}`
        )
    );

    const shutdown = async () => {
      console.log(
        '\nShutting down...'
      );

      server.close();

      await disconnectDB();

      process.exit(0);
    };

    process.on(
      'SIGINT',
      shutdown
    );

    process.on(
      'SIGTERM',
      shutdown
    );
  } catch (err) {
    console.error(
      '❌ Failed to start server:',
      err
    );

    process.exit(1);
  }
};

start();