
import { z } from "zod";

// Schema for the form
export const employeeFormSchema = z.object({
  firstName: z.string().min(1, "Bitte geben Sie einen Vornamen ein"),
  lastName: z.string().min(1, "Bitte geben Sie einen Nachnamen ein"),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  position: z.string().min(1, "Bitte geben Sie eine Position ein"),
  cluster: z.string().min(1, "Bitte wählen Sie einen Cluster"),
  entryDate: z.string().min(1, "Bitte geben Sie ein Eintrittsdatum an"),
  budget: z.coerce.number().min(0, "Das Budget darf nicht negativ sein"),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
