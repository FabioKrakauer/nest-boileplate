import * as dotenv from 'dotenv';
import { resolve as rv } from 'node:path';

dotenv.config({ path: rv(__dirname, './.env.test') });
