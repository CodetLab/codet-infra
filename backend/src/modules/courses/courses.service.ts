import { db } from "../../core/db";
import { courses } from "../../core/db/schema";

// create-course.dto.ts

type CreateCourseDTO = {
  title: string;
  description: string;
  appId: number;
}

export const coursesService = {
  getAll: () => db.select().from(courses),

  create: (data: CreateCourseDTO) =>
    db.insert(courses).values(data),
};