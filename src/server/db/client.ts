import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export interface LearnerRow {
	id: string;
	email: string;
	password_hash: string;
	display_name: string;
	target_course: string;
	daily_goal_minutes: number;
	created_at: string;
}

export interface SessionRow {
	token: string;
	learner_id: string;
	expires_at: string;
}

export interface ProgressRow {
	id: string;
	learner_id: string;
	lesson_id: string;
	score: number;
	accuracy: number;
	completed_at: string;
}

export interface ConceptReviewRow {
	id: string;
	learner_id: string;
	concept_id: string;
	repetitions: number;
	interval_days: number;
	ease_factor: number;
	last_reviewed_at: string;
	next_review_at: string;
}

let dbInstance: DatabaseSync | null = null;

export function getDatabase(dbPath?: string): DatabaseSync {
	if (dbInstance && !dbPath) {
		return dbInstance;
	}

	const resolvedPath =
		dbPath ||
		(process.env.NODE_ENV === "test"
			? ":memory:"
			: path.join(process.cwd(), ".data", "mingo.db"));

	if (resolvedPath !== ":memory:") {
		const dir = path.dirname(resolvedPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	}

	const db = new DatabaseSync(resolvedPath);
	db.exec("PRAGMA foreign_keys = ON;");

	// Initialize tables
	db.exec(`
    CREATE TABLE IF NOT EXISTS learners (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      target_course TEXT NOT NULL DEFAULT 'es-en',
      daily_goal_minutes INTEGER NOT NULL DEFAULT 15,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      accuracy INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL,
      UNIQUE(learner_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS concept_reviews (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
      concept_id TEXT NOT NULL,
      repetitions INTEGER NOT NULL DEFAULT 0,
      interval_days REAL NOT NULL DEFAULT 1.0,
      ease_factor REAL NOT NULL DEFAULT 2.5,
      last_reviewed_at TEXT NOT NULL,
      next_review_at TEXT NOT NULL,
      UNIQUE(learner_id, concept_id)
    );
  `);

	if (!dbPath) {
		dbInstance = db;
	}

	return db;
}
