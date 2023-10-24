
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv'
dotenv.config();

export const port = process.env.PORT || 8080;
export const public_url = process.env.PUBLIC_URL || "http://localhost"

export const prisma = new PrismaClient();