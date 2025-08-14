import {z} from "zod";

export const UserValidation = z.object({
    username : z.string().trim().lowercase().min(3, "Username must be 3 letters  long"),
    fullname : z.string().trim().min(3, "Username must be 3 letters  long"),
     email: z.string().email("Invalid email format"),
     password:z.string().min(6,"Minimum 6 leetcors wrongs")
});
