import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import * as fs from 'fs';

//log routes
// import { addLogRouter } from './routes/logs/addLog';
// import { getLogsRouter } from './routes/logs/getLogs';

import { errorHandler, NotFoundError } from '@phibase/common-v2';

//security
const xss = require('xss-clean');
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secured: process.env.NODE_ENV !== 'test',
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  }),
);


fs.readdirSync(__dirname + '/routes').forEach(module => {
  fs.readdirSync(__dirname + '/routes/' + module).forEach(router => {
    if (router.split('.').pop() === 'ts') {
      let createdRouter = require(`./routes/${module}/${router}`)

      var routerName = Object.keys(createdRouter)[0];

      app.use(createdRouter[routerName]);
    }
  })
});

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

/**
 * Security
 */
/** Sanitizing */
app.use(mongoSanitize());
/** Securing headers */
app.use(helmet());

/** Securing XSS exploit */
app.use(xss());


/** HTTP request limiter */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs (1 windowMS = 60000 ms)
});

// apply to all requests
// Limit request only on production
if (process.env.NODE_ENV === 'production') {
  app.use(limiter);
}


/** Securing HTTP param pollution exploit */
app.use(hpp());

/** Enabling CORS */
app.use(cors({
  origin: '*'
})); // Disable if not needed

export { app };
