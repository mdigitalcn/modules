import type { Employee, AttendanceRecord, LeaveRequest, LeaveBalance, Goal, Department, OnboardingStep } from "./types";

export function createHrmApi(config: { baseUrl: string; headers?: () => Record<string, string> }) {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...config.headers?.(), ...options?.headers } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  return {
    // Employees
    getEmployees: (params?: Record<string, string>) => request<{ items: Employee[]; total: number }>(`/employees${params ? "?" + new URLSearchParams(params) : ""}`),
    getEmployee: (id: string) => request<Employee>(`/employees/${id}`),
    updateEmployee: (id: string, data: Partial<Employee>) => request<Employee>(`/employees/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    // Attendance
    getAttendance: (employeeId: string, month?: string) => request<AttendanceRecord[]>(`/employees/${employeeId}/attendance${month ? `?month=${month}` : ""}`),
    checkIn: (employeeId: string) => request<AttendanceRecord>(`/employees/${employeeId}/attendance/check-in`, { method: "POST" }),
    checkOut: (employeeId: string) => request<AttendanceRecord>(`/employees/${employeeId}/attendance/check-out`, { method: "POST" }),

    // Leave
    getLeaveBalance: (employeeId: string) => request<LeaveBalance[]>(`/employees/${employeeId}/leave/balance`),
    getLeaveRequests: (employeeId: string) => request<LeaveRequest[]>(`/employees/${employeeId}/leave`),
    requestLeave: (employeeId: string, data: { type: string; startDate: string; endDate: string; reason: string }) => request<LeaveRequest>(`/employees/${employeeId}/leave`, { method: "POST", body: JSON.stringify(data) }),
    approveLeave: (requestId: string) => request<LeaveRequest>(`/leave/${requestId}/approve`, { method: "POST" }),
    rejectLeave: (requestId: string, reason: string) => request<LeaveRequest>(`/leave/${requestId}/reject`, { method: "POST", body: JSON.stringify({ reason }) }),

    // Goals
    getGoals: (employeeId: string) => request<Goal[]>(`/employees/${employeeId}/goals`),
    createGoal: (employeeId: string, data: Partial<Goal>) => request<Goal>(`/employees/${employeeId}/goals`, { method: "POST", body: JSON.stringify(data) }),
    updateGoal: (goalId: string, data: Partial<Goal>) => request<Goal>(`/goals/${goalId}`, { method: "PATCH", body: JSON.stringify(data) }),

    // Departments
    getDepartments: () => request<Department[]>("/departments"),

    // Onboarding
    getOnboardingSteps: (employeeId: string) => request<OnboardingStep[]>(`/employees/${employeeId}/onboarding`),
    completeOnboardingStep: (employeeId: string, stepId: string) => request<OnboardingStep>(`/employees/${employeeId}/onboarding/${stepId}/complete`, { method: "POST" }),
  };
}

export type HrmApi = ReturnType<typeof createHrmApi>;
