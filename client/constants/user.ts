import type { UserRole } from "@/lib/auth/session-storage";

export type UserDepartment =
  | "College of Medicine and Health Sciences"
  | "College of Business and Economics"
  | "College of Natural and Computational Sciences"
  | "College of Social Sciences and Humanities"
  | "College of Agriculture and Environmental Sciences"
  | "College of Veterinary Medicine and Animal Sciences"
  | "College of Education"
  | "College of Informatics"
  | "Institute of Technology"
  | "Institute of Biotechnology"
  | "School of Law";

export const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: "ADMIN", value: "ADMIN" },
  { label: "LECTURER", value: "LECTURER" },
  { label: "OFFICER", value: "OFFICER" },
  { label: "COMMITTEE", value: "COMMITTEE" },
];

export const departmentRoles = new Set<UserRole>(["LECTURER", "COMMITTEE"]);

export const departmentOptions: Array<{ label: string; value: UserDepartment | "" }> = [
  { label: "Choose department", value: "" },
  {
    label: "College of Medicine and Health Sciences",
    value: "College of Medicine and Health Sciences",
  },
  {
    label: "College of Business and Economics",
    value: "College of Business and Economics",
  },
  {
    label: "College of Natural and Computational Sciences",
    value: "College of Natural and Computational Sciences",
  },
  {
    label: "College of Social Sciences and Humanities",
    value: "College of Social Sciences and Humanities",
  },
  {
    label: "College of Agriculture and Environmental Sciences",
    value: "College of Agriculture and Environmental Sciences",
  },
  {
    label: "College of Veterinary Medicine and Animal Sciences",
    value: "College of Veterinary Medicine and Animal Sciences",
  },
  { label: "College of Education", value: "College of Education" },
  { label: "College of Informatics", value: "College of Informatics" },
  { label: "Institute of Technology", value: "Institute of Technology" },
  { label: "Institute of Biotechnology", value: "Institute of Biotechnology" },
  { label: "School of Law", value: "School of Law" },
];
