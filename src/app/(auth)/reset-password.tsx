import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { AuthField, AuthShell, AuthTitle, InlineNotice } from "../../../components/auth/AuthShell";
import { getAuthErrorMessage, isValidEmail } from "../../../lib/auth";

type Stage = "email" | "code" | "password";

export default function ResetPassword() {
  const { signIn, fetchStatus } = useSignIn();
  const posthog = usePostHog();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<Stage>("email");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const busy = fetchStatus === "fetching";

  const sendCode = async () => {
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setNotice("");
    const { error: createError } = await signIn.create({ identifier: email.trim() });
    if (createError) {
      setNotice(getAuthErrorMessage(createError) ?? "We couldn’t start password recovery. Check your email and try again.");
      return;
    }
    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendError) {
      setNotice(getAuthErrorMessage(sendError) ?? "We couldn’t send a reset code. Please try again shortly.");
      return;
    }
    posthog?.capture("password_reset_requested");
    setStage("code");
  };

  const verifyCode = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError("");
    setNotice("");
    const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
    if (verifyError) {
      setError(getAuthErrorMessage(verifyError) ?? "That code didn’t work. Check it and try again.");
      return;
    }
    if (signIn.status === "needs_new_password") setStage("password");
    else setNotice("We need one more step to verify this request. Please try again or contact support.");
  };

  const setNewPassword = async () => {
    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    setError("");
    setNotice("");
    const { error: passwordError } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });
    if (passwordError) {
      setError(getAuthErrorMessage(passwordError) ?? "We couldn’t update your password. Please try again.");
      return;
    }
    posthog?.capture("password_reset_completed");
    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setNotice(getAuthErrorMessage(finalizeError) ?? "Your password was updated, but we couldn’t finish signing you in.");
        return;
      }
      router.replace("/(tabs)");
    } else {
      setNotice("Your password has been updated. Return to sign in to continue.");
      setStage("email");
    }
  };

  const resendCode = async () => {
    setNotice("");
    const { error: resendError } = await signIn.resetPasswordEmailCode.sendCode();
    setNotice(resendError ? getAuthErrorMessage(resendError) ?? "We couldn’t send a new code." : "A fresh code is on its way.");
  };

  const returnToSignIn = async () => {
    await signIn.reset();
    router.replace("/(auth)/sign-in");
  };

  const titles: Record<Stage, { title: string; subtitle: string }> = {
    email: { title: "Reset your password", subtitle: "We’ll email you a secure code to get back in." },
    code: { title: "Check your inbox", subtitle: `Enter the 6-digit reset code sent to ${email}.` },
    password: { title: "Choose a new password", subtitle: "Use at least 8 characters to keep your account secure." },
  };

  return (
    <AuthShell>
      <AuthTitle {...titles[stage]} />
      {notice ? <InlineNotice>{notice}</InlineNotice> : null}
      {stage === "email" ? (
        <>
          <AuthField label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} error={error} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
          <PrimaryButton title="Send reset code" onPress={sendCode} busy={busy} />
        </>
      ) : null}
      {stage === "code" ? (
        <>
          <AuthField label="Reset code" placeholder="6-digit code" value={code} onChangeText={(value) => setCode(value.replace(/\D/g, ""))} error={error} keyboardType="number-pad" autoComplete="one-time-code" textContentType="oneTimeCode" maxLength={6} />
          <PrimaryButton title="Verify code" onPress={verifyCode} busy={busy} />
          <Pressable accessibilityRole="button" disabled={busy} onPress={resendCode} className="mt-4 items-center"><Text className="font-sans-bold text-primary">Resend code</Text></Pressable>
        </>
      ) : null}
      {stage === "password" ? (
        <>
          <AuthField label="New password" placeholder="At least 8 characters" value={password} onChangeText={setPassword} error={error} secureTextEntry autoComplete="new-password" textContentType="newPassword" />
          <PrimaryButton title="Update password" onPress={setNewPassword} busy={busy} />
        </>
      ) : null}
      <View className="mt-5 flex-row justify-center">
        <Pressable accessibilityRole="link" disabled={busy} onPress={returnToSignIn}>
          <Text className="font-sans-bold text-primary">Back to sign in</Text>
        </Pressable>
      </View>
      <View nativeID="clerk-captcha" />
    </AuthShell>
  );
}

function PrimaryButton({ title, onPress, busy }: { title: string; onPress: () => void; busy: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy, busy }} disabled={busy} onPress={onPress} className={`h-14 flex-row items-center justify-center rounded-full bg-primary px-5 ${busy ? "opacity-60" : "active:opacity-80"}`}>
      {busy ? <ActivityIndicator color="#fff8f3" /> : <Text className="text-lg font-sans-bold text-background">{title}</Text>}
    </Pressable>
  );
}
