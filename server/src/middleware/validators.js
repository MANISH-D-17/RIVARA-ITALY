import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  req.body = parsed.data;
  next();
};
