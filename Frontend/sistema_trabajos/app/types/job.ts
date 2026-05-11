import type { FormEvent } from "react";

export type Role = "worker" | "owner" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type Job = {
  id: number;
  title: string;
  description: string;
  type: string;
  location: string;
  payment: string;
  creator: number;
  creator_name: string;
  status: "open" | "assigned" | "closed";
  created_at: string;
};

export type Application = {
  id: number;
  job: number;
  job_title?: string;
  applicant_name?: string;
  status: "pending" | "accepted" | "rejected";
  cover_letter: string;
  created_at: string;
};

export type NotificationItem = {
  id: number;
  recipient: number;
  type: string;
  message: string;
  dedupe_key?: string | null;
  extra_data?: {
    application_id?: number;
    job_id?: number;
  };
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
};

export type NotificationListResponse = {
  items: NotificationItem[];
  total: number;
  limit: number;
  offset: number;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

export type Feedback = {
  tone: "success" | "error" | "info";
  message: string;
};

export type Filters = {
  search: string;
  type: string;
  location: string;
  status: string;
};

export type AuthForm = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type JobForm = {
  title: string;
  type: string;
  location: string;
  payment: string;
  description: string;
};

export type UserStats = {
  workers: number;
  owners: number;
};

export type FormSubmitHandler = (event: FormEvent<HTMLFormElement>) => void;
