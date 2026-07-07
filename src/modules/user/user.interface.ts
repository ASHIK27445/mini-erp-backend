export type Role = "admin" | "manager" | "employee";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}