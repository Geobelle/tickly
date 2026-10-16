import { apiRequest } from "./api";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  repeat: string;
  createdAt?: string;
  isActive: boolean;
}

interface CreateHabitInput {
  name: string;
  icon: string;
  repeat: string;
}

export async function getHabits(token: string): Promise<Habit[]> {
  const data = await apiRequest("/api/habits", token);
  return data.habits;
}

export async function createHabit(
  token: string,
  habit: CreateHabitInput,
): Promise<Habit> {
  const data = await apiRequest("/api/habits", token, {
    method: "POST",
    body: JSON.stringify(habit),
  });

  return data.habit;
}

export async function updateHabitCompletion(
  token: string,
  habitId: string,
  date: string,
  completed: boolean,
) {
  return apiRequest(
    `/api/habits/${encodeURIComponent(habitId)}/completion`,
    token,
    {
      method: "PUT",
      body: JSON.stringify({ date, completed }),
    },
  );
}

export async function getHabitCompletions(
  token: string,
  date: string,
): Promise<{ habitId: string; completed: boolean }[]> {
  const data = await apiRequest(
    `/api/habits/completions?date=${encodeURIComponent(date)}`,
    token,
  );

  return data.completions;
}
