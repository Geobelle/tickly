import { styled } from "nativewind";
import { type ReactNode, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow justify-center px-5 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center pb-6">
            <Text className="text-5xl font-sans-bold text-primary">Tickly</Text>
            <Text className="mt-1 text-base font-sans text-muted-foreground">
              Small steps. Big progress.
            </Text>
            <View className="mt-5 rounded-full border border-border bg-cream px-4 py-2">
              <Text className="text-sm font-sans text-muted-foreground">
                Mascot illustration
              </Text>
            </View>
          </View>
          <View className="w-full max-w-md self-center rounded-[28px] border border-border bg-card p-5 shadow-sm">
            {children}
          </View>
          <Text className="mt-5 text-center text-xs font-sans text-muted-foreground">
            Your account is protected and your progress stays yours.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="mb-5">
      <Text className="text-3xl font-sans-bold text-foreground">{title}</Text>
      <Text className="mt-1 text-base font-sans text-muted-foreground">{subtitle}</Text>
    </View>
  );
}

export function AuthField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoComplete,
  textContentType,
  maxLength,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
  autoComplete?: "email" | "name" | "password" | "new-password" | "one-time-code" | "off";
  textContentType?: "emailAddress" | "name" | "password" | "newPassword" | "oneTimeCode";
  maxLength?: number;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-sm font-sans-bold text-foreground">{label}</Text>
      <View className="relative">
        <TextInputCompat
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9b8b8f"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "email-address" || secureTextEntry ? "none" : label.toLowerCase().includes("name") ? "words" : "none"}
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          maxLength={maxLength}
          className={`h-14 rounded-2xl border bg-background px-4 pr-16 text-base font-sans text-foreground ${error ? "border-destructive" : "border-border"}`}
          accessibilityLabel={label}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            onPress={() => setShowPassword((visible) => !visible)}
            className="absolute right-4 top-0 h-14 justify-center"
          >
            <Text className="font-sans-bold text-primary">{showPassword ? "Hide" : "Show"}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityRole="alert" className="mt-1 text-sm font-sans text-destructive">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const TextInputCompat = styled(TextInput);

export function InlineNotice({ children }: { children: ReactNode }) {
  return (
    <Text accessibilityRole="alert" className="mb-4 rounded-xl bg-blush px-3 py-2 text-sm font-sans text-primary">
      {children}
    </Text>
  );
}
