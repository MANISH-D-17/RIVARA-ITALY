import { Router } from 'express';
import { googleAuth, login, refresh, register } from '../controllers/authController.js';
import { loginSchema, registerSchema, validate } from '../middleware/validators.js';

const r = Router();
r.post('/register', validate(registerSchema), register);
r.post('/login', validate(loginSchema), login);
r.post('/google', googleAuth);
r.post('/refresh', refresh);
export default r;
