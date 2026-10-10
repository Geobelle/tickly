import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { HOME_TASK, getLocalDateKey, TASK_HISTORY } from "../../../constant/data";

const SafeAreaView = styled(RNSafeAreaView);
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_KEY = getLocalDateKey(new Date());

function dateAt(year: number, month: number, day: number) {
  return new Date(year, month, day, 12, 0, 0, 0);
}

function monthStart(date: Date) {
  return dateAt(date.getFullYear(), date.getMonth(), 1);
}

function isSameMonth(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth()
  );
}

function formatMonth(date: Date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function formatSelectedDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Calender() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return dateAt(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(new Date()));

  const selectedKey = getLocalDateKey(selectedDate);
  const isToday = selectedKey === TODAY_KEY;
  const historicalIds = TASK_HISTORY[selectedKey];
  const selectedTasks = useMemo(() => {
    if (isToday) return HOME_TASK;
    if (!historicalIds) return [];

    return HOME_TASK.filter((task) => historicalIds.includes(task.id));
  }, [historicalIds, isToday]);

  const completedIds = useMemo(() => {
    if (isToday) {
      return new Set(
        HOME_TASK.filter((task) => task.status === "completed").map(
          (task) => task.id,
        ),
      );
    }
    return new Set(historicalIds ?? []);
  }, [historicalIds, isToday]);

  const monthOffset = (monthStart(visibleMonth).getDay() + 6) % 7;
  const daysInMonth = dateAt(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const cellCount = Math.ceil((monthOffset + daysInMonth) / 7) * 7;
  const calendarCells = Array.from({ length: cellCount }, (_, index) => {
    const day = index - monthOffset + 1;
    return day > 0 && day <= daysInMonth
      ? dateAt(visibleMonth.getFullYear(), visibleMonth.getMonth(), day)
      : null;
  });
  const completedCount = completedIds.size;
  const hasRecordedHistory = isToday || historicalIds !== undefined;
  const showProgress = hasRecordedHistory && selectedTasks.length > 0;

  const changeMonth = (offset: number) => {
    const nextMonth = dateAt(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + offset,
      1,
    );
    setVisibleMonth(nextMonth);
    const nextDate = isSameMonth(nextMonth, new Date())
      ? new Date()
      : dateAt(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    setSelectedDate(
      dateAt(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        nextDate.getDate(),
      ),
    );
  };

  const nextMonth = dateAt(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    1,
  );
  const canGoForward = nextMonth <= monthStart(new Date());

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 16, paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-4xl font-sans-bold text-primary">Calendar</Text>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-2xl font-sans-bold text-foreground">
            {formatMonth(visibleMonth)}
          </Text>
          <View className="flex-row items-center gap-1">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={() => changeMonth(-1)}
              className="h-10 w-10 items-center justify-center rounded-full active:bg-muted"
            >
              <ChevronLeft size={23} color="#6f2943" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next month"
              accessibilityState={{ disabled: !canGoForward }}
              disabled={!canGoForward}
              onPress={() => changeMonth(1)}
              className={`h-10 w-10 items-center justify-center rounded-full ${canGoForward ? "active:bg-muted" : "opacity-30"}`}
            >
              <ChevronRight size={23} color="#6f2943" />
            </Pressable>
          </View>
        </View>

        <View className="mt-3 flex-row">
          {WEEKDAYS.map((weekday) => (
            <Text
              key={weekday}
              className="w-[14.2857%] py-2 text-center font-sans-bold text-muted-foreground"
            >
              {weekday}
            </Text>
          ))}
        </View>

        <View className="flex-row flex-wrap">
          {calendarCells.map((date, index) => {
            if (!date) {
              return <View key={`blank-${index}`} className="aspect-square w-[14.2857%]" />;
            }

            const dateKey = getLocalDateKey(date);
            const disabled = dateKey > TODAY_KEY;
            const selected = dateKey === selectedKey;
            const hasCompletedTasks =
              dateKey === TODAY_KEY
                ? HOME_TASK.some((task) => task.status === "completed")
                : (TASK_HISTORY[dateKey]?.length ?? 0) > 0;

            return (
              <Pressable
                key={dateKey}
                accessibilityRole="button"
                accessibilityLabel={`${formatSelectedDate(date)}${hasCompletedTasks ? ", tasks completed" : ""}`}
                accessibilityState={{ selected, disabled }}
                disabled={disabled}
                onPress={() => setSelectedDate(date)}
                className="aspect-square w-[14.2857%] items-center justify-center"
              >
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${selected ? "bg-primary" : hasCompletedTasks ? "bg-sage" : ""}`}
                >
                  <Text
                    className={`font-sans-bold ${selected ? "text-background" : disabled ? "text-border" : "text-foreground"}`}
                  >
                    {date.getDate()}
                  </Text>
                </View>
                {hasCompletedTasks && !selected ? (
                  <View className="absolute bottom-1 h-1 w-1 rounded-full bg-success" />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View className="mt-5 overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
          <View className="px-5 pb-4 pt-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-sans-bold text-foreground">
                {formatSelectedDate(selectedDate)}
              </Text>
              {showProgress ? (
                <Text className="font-sans-bold text-muted-foreground">
                  {completedCount}/{HOME_TASK.length}
                </Text>
              ) : null}
            </View>
            {showProgress ? (
              <View className="h-2.5 overflow-hidden rounded-full bg-muted">
                <View
                  className="h-full rounded-full bg-success"
                  style={{ width: `${(completedCount / HOME_TASK.length) * 100}%` }}
                />
              </View>
            ) : null}
          </View>

          {selectedTasks.length > 0 ? (
            <View className="px-4 pb-2">
              {selectedTasks.map((task) => {
                const isCompleted = completedIds.has(task.id);

                if (!isToday && !isCompleted) return null;

                return (
                  <View
                    key={task.id}
                    className="min-h-[62px] flex-row items-center gap-3 border-t border-muted px-1 py-2"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-cream">
                      <Image
                        source={task.icon}
                        style={{ width: 25, height: 25 }}
                        resizeMode="contain"
                        accessibilityLabel={`${task.name} icon`}
                      />
                    </View>
                    <Text className="flex-1 font-sans-bold text-foreground">
                      {task.name}
                    </Text>
                    <View
                      className={`h-7 w-7 items-center justify-center rounded-full ${isCompleted ? "bg-success" : "border-2 border-border bg-card"}`}
                    >
                      {isCompleted ? (
                        <Text className="font-sans-bold text-background">✓</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="items-center px-7 pb-7 pt-2">
              <Text className="text-center text-base font-sans-bold text-foreground">
                {hasRecordedHistory
                  ? "No tasks completed on this day"
                  : "No completed tasks recorded for this day"}
              </Text>
              <Text className="mt-1 text-center font-sans text-muted-foreground">
                Every little step counts. Keep going! 🌱
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
