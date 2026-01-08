import {neon } from "@neondatabase/serverless";
import "dotenv/config";

//Creates a SQL connection using  the database URL
export const db = neon(process.env.DATABASE_URL);