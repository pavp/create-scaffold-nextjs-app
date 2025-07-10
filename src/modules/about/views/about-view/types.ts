import { z } from 'zod';

export const FormPersonalInfoInputSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'common.textField.validate.required' })
    .max(20, { message: 'common.textField.validate.maxLength' }),
  surname: z
    .string()
    .min(1, { message: 'common.textField.validate.required' })
    .max(20, { message: 'common.textField.validate.maxLength' }),
  email: z
    .string()
    .min(1, { message: 'common.textField.validate.required' })
    .email({ message: 'common.textField.validate.email' }),
});

export type FormPersonalInfoInput = z.infer<typeof FormPersonalInfoInputSchema>;
