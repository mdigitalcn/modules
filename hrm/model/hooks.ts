"use client";

import { useState, useCallback, useMemo } from "react";
import type { AttendanceRecord, LeaveBalance, Goal, Employee } from "./types";
import { DEFAULT_WORKING_HOURS } from "./constants";

/** Clock in/out state management */
export function useClockInOut(workingHours = DEFAULT_WORKING_HOURS) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const clockIn = useCallback(() => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
  }, []);

  const clockOut = useCallback(() => {
    setIsCheckedIn(false);
    if (checkInTime) setElapsed(Math.round((Date.now() - checkInTime.getTime()) / 60000));
  }, [checkInTime]);

  const isLate = useMemo(() => {
    if (!checkInTime) return false;
    const [h, m] = workingHours.start.split(":").map(Number);
    const start = new Date(checkInTime);
    start.setHours(h, m, 0, 0);
    return checkInTime > start;
  }, [checkInTime, workingHours.start]);

  return { isCheckedIn, checkInTime, elapsed, clockIn, clockOut, isLate };
}

/** Leave balance summary */
export function useLeaveBalanceSummary(balances: LeaveBalance[]) {
  const totalRemaining = useMemo(() => balances.reduce((sum, b) => sum + b.remaining, 0), [balances]);
  const totalUsed = useMemo(() => balances.reduce((sum, b) => sum + b.used, 0), [balances]);
  const totalEntitled = useMemo(() => balances.reduce((sum, b) => sum + b.total, 0), [balances]);
  return { totalRemaining, totalUsed, totalEntitled, balances };
}

/** Goal progress tracking */
export function useGoalProgress(goals: Goal[]) {
  const completed = useMemo(() => goals.filter((g) => g.status === "completed").length, [goals]);
  const overdue = useMemo(() => goals.filter((g) => g.status === "overdue").length, [goals]);
  const inProgress = useMemo(() => goals.filter((g) => g.status === "in-progress").length, [goals]);
  const averageProgress = useMemo(() => goals.length ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0, [goals]);
  return { completed, overdue, inProgress, total: goals.length, averageProgress };
}

/** Employee directory filters */
export function useEmployeeFilters() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (search) p.search = search;
    if (department) p.department = department;
    if (status) p.status = status;
    return p;
  }, [search, department, status]);

  const reset = useCallback(() => { setSearch(""); setDepartment(null); setStatus(null); }, []);

  return { search, setSearch, department, setDepartment, status, setStatus, params, reset };
}
