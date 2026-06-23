import { handle } from 'hono/aws-lambda'

import './utils/env';
import app from './app'

export const handler = handle(app)