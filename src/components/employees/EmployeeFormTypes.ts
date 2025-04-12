
import { z } from "zod";

// Defined values for Cluster and competence level
export const availableClusters = [
  "Adoption",
  "Backoffice",
  "Development",
  "Finance",
  "Geschäftsleitung",
  "Human Resources",
  "Marketing",
  "Projektmanagement",
  "Sales",
  "Secure Modern Workplace",
  "Sustainability",
] as const;

export const competenceLevels = [
  "Junior",
  "Expierienced",
  "Senior",
] as const;

// Schema for the employee form
export const employeeFormSchema = z.object({
  firstName: z.string().min(1, "Bitte geben Sie einen Vornamen ein"),
  lastName: z.string().min(1, "Bitte geben Sie einen Nachnamen ein"),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  position: z.string().min(1, "Bitte geben Sie eine Position ein"),
  cluster: z.enum(availableClusters, {
    errorMap: () => ({ message: "Bitte wählen Sie einen Cluster" })
  }),
  competenceLevel: z.enum(competenceLevels, {
    errorMap: () => ({ message: "Bitte wählen Sie ein Kompetenzlevel" })
  }),
  entryDate: z.string().min(1, "Bitte geben Sie ein Eintrittsdatum an"),
  budget: z.coerce.number().min(0, "Das Budget darf nicht negativ sein"),
  profileImage: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
