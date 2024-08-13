import { z } from "zod";

const CreateAccountValidator = z.object({
    name: z.string().min(4, "Username must have at least 4 characters"),
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(8, "password must be at least 8 characters long")
        .refine((val) => /[A-Z]/.test(val), "password must contain at least one uppercase letter")
        .refine((val) => /[a-z]/.test(val), "password must contain at least one lowercase letter")
        .refine((val) => /[0-9]/.test(val), "password must contain at least one number")
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "password must contain at least one special character"),
});

export default CreateAccountValidator;
