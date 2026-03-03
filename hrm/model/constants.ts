import type { AttendanceStatus, LeaveType, LeaveStatus } from "./types";

export const ATTENDANCE_CONFIG: Record<AttendanceStatus, { label: string; color: string }> = {
  present: { label: "Present", color: "success" },
  absent: { label: "Absent", color: "error" },
  late: { label: "Late", color: "warning" },
  "half-day": { label: "Half Day", color: "info" },
  "work-from-home": { label: "WFH", color: "primary" },
  "on-leave": { label: "On Leave", color: "default" },
};

export const LEAVE_TYPE_CONFIG: Record<LeaveType, { label: string; color: string }> = {
  annual: { label: "Annual Leave", color: "primary" },
  sick: { label: "Sick Leave", color: "error" },
  casual: { label: "Casual Leave", color: "info" },
  maternity: { label: "Maternity Leave", color: "warning" },
  paternity: { label: "Paternity Leave", color: "warning" },
  unpaid: { label: "Unpaid Leave", color: "default" },
};

export const LEAVE_STATUS_CONFIG: Record<LeaveStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "warning" },
  approved: { label: "Approved", color: "success" },
  rejected: { label: "Rejected", color: "error" },
  cancelled: { label: "Cancelled", color: "default" },
};

export const DEFAULT_WORKING_HOURS = { start: "09:00", end: "18:00" };
export const SKILL_LEVELS = [
  { level: 1, label: "Beginner" },
  { level: 2, label: "Elementary" },
  { level: 3, label: "Intermediate" },
  { level: 4, label: "Advanced" },
  { level: 5, label: "Expert" },
] as const;
