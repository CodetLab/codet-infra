import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

/* =========================
   USERS
========================= */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   APPS / TENANTS
========================= */

export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  slug: text("slug").notNull().unique(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   USER <-> APP RELATION
========================= */

export const userApps = pgTable("user_apps", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  appId: integer("app_id")
    .notNull()
    .references(() => apps.id),

  role: text("role").default("user"),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   USER SETTINGS
========================= */

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id),

  theme: text("theme").default("light"),

  language: text("language").default("es"),

  shortcuts: jsonb("shortcuts").default({}),

  preferences: jsonb("preferences").default({}),

  twoFactorEnabled: boolean("two_factor_enabled").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   API KEYS
========================= */

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),

  appId: integer("app_id")
    .notNull()
    .references(() => apps.id),

  keyHash: text("key_hash").notNull().unique(),

  name: text("name").notNull(),

  active: boolean("active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   EMAILS
========================= */

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),

  appId: integer("app_id")
    .notNull()
    .references(() => apps.id),

  to: text("to").notNull(),

  subject: text("subject").notNull(),

  body: text("body").notNull(),

  status: text("status").default("pending"),

  error: text("error"),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   COURSES
========================= */

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),

  appId: integer("app_id")
    .notNull()
    .references(() => apps.id),

  title: text("title").notNull(),

  description: text("description").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   LESSONS
========================= */

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),

  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),

  title: text("title").notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});