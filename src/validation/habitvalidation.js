import { z } from "zod";
import mongoose from "mongoose";

export const habitvalidation = z.object({
   userId: z.string().refine( userId => mongoose.isValidObjectId( userId), {
    message: "Invalid userId",
  }),

  title: z.string().trim().min(1, { message: "Minimum 1 letter is required" }),

  goalType: z.enum(["daily", "monthly", "weekley"], {
    required_error: "Goal type is required",
    invalid_type_error: "Goal type must be one of: daily, monthly, weekly",
  }),

  createdAt: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val);
      }
      return val;
    },
    z.date({ invalid_type_error: "Invalid date" }).optional()
  ),
});
