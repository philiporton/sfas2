/** nextjs server actions */

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

export const registerNewUser = async (formData: FormData) => {
    console.log("Hello from server!");

    const rawFormDataSchema = z
        .object({
            // extra keys are stripped out
            verificationCode: z.string(),
            name: z.string(),
            primaryEmail: z.string(),
            verifyPrimaryEmail: z.string(),
            secondaryEmail: z.string(),
            verifySecondaryEmail: z.string()
        })
        .partial({
            // below are the only fields that can be blank
            secondaryEmail: true,
            verifySecondaryEmail: true
        });

    const rawFormData = rawFormDataSchema.parse({
        verificationCode: formData.get("verificationCode")?.toString().trim(),
        name: formData.get("name")?.toString().trim(),
        primaryEmail: formData.get("primaryEmail")?.toString().trim(),
        verifyPrimaryEmail: formData
            .get("verifyPrimaryEmail")
            ?.toString()
            .trim(),
        secondaryEmail: formData.get("secondaryEmail")?.toString().trim(),
        verifySecondaryEmail: formData
            .get("verifySecondaryEmail")
            ?.toString()
            .trim()
    });

    console.log(`Got form data!\n${JSON.stringify(rawFormData)}`);
    revalidatePath("/registration");
};
