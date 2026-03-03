export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  department: string;
  designation: string;
  employeeId: string;
  status: "active" | "onboarding" | "on-leave" | "terminated";
  joinDate: string;
  manager?: { id: string; name: string };
  skills: Skill[];
  metadata?: Record<string, unknown>;
}

export interface Skill {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  category: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "work-from-home" | "on-leave";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  breakMinutes?: number;
  totalHours?: number;
  notes?: string;
}

export type LeaveType = "annual" | "sick" | "casual" | "maternity" | "paternity" | "unpaid";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  approvedBy?: string;
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  progress: number;
  status: "not-started" | "in-progress" | "completed" | "overdue";
  dueDate: string;
  milestones?: { title: string; completed: boolean }[];
}

export interface Department {
  id: string;
  name: string;
  head?: { id: string; name: string };
  employeeCount: number;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface HrmConfig {
  baseUrl: string;
  workingHours?: { start: string; end: string };
}
