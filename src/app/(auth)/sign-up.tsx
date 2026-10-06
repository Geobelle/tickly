import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import {
  AuthField,
  AuthShell,
  AuthTitle,
  InlineNotice,
} from "../../../components/auth/AuthShell";
import { getAuthErrorMessage, isValidEmail } from "../../../lib/auth";

export default function SignUp() {
  const { signUp, fetchStatus } = useSignUp();
  const posthog = usePostHog();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"details" | "verify">("details");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const busy = fetchStatus === "fetching";

  const createAccount = async () => {
    const nextErrors: Record<string, string | undefined> = {
      name:
        name.trim().length >= 2
          ? undefined
          : "Enter your name so we know what to call you.",
      email: isValidEmail(email) ? undefined : "Enter a valid email address.",
      password:
        password.length >= 8
          ? undefined
          : "Use at least 8 characters for your password.",
      confirmation:
        confirmation === password ? undefined : "Your passwords don’t match.",
    };
    setErrors(nextErrors);
    setNotice("");
    if (Object.values(nextErrors).some(Boolean)) return;

    const [firstName, ...lastNameParts] = name.trim().split(/\s+/);
    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
      firstName,
      lastName: lastNameParts.join(" ") || undefined,
    });
    if (error) {
      setNotice(
        getAuthErrorMessage(error) ??
          "We couldn’t create your account. Please try again.",
      );
      return;
    }
    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setNotice(
        getAuthErrorMessage(sendError) ??
          "Your details are saved. We couldn’t send a code yet; try again.",
      );
      return;
    }
    setStage("verify");
  };

  const verifyEmail = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setErrors({ code: "Enter the 6-digit code from your email." });
      return;
    }
    setErrors({});
    setNotice("");
    const { error } = await signUp.verifications.verifyEmailCode({
      code: code.trim(),
    });
    if (error) {
      setErrors({
        code:
          getAuthErrorMessage(error) ??
          "That code didn’t work. Check it and try again.",
      });
      return;
    }
    if (signUp.status !== "complete") {
      setNotice(
        "One more step is needed before we can finish creating your account. Please try again or contact support.",
      );
      return;
    }
    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      setNotice(
        getAuthErrorMessage(finalizeError) ??
          "Your email is verified, but we couldn’t open your account yet.",
      );
      return;
    }
    posthog?.capture("account_created");
    router.replace("/(tabs)");
  };

  const resendCode = async () => {
    setNotice("");
    const { error } = await signUp.verifications.sendEmailCode();
    if (error)
      setNotice(
        getAuthErrorMessage(error) ??
          "We couldn’t send a new code. Please try again shortly.",
      );
    else setNotice("A fresh code is on its way.");
  };

  const editDetails = async () => {
    await signUp.reset();
    setCode("");
    setErrors({});
    setNotice("");
    setStage("details");
  };

  return (
    <AuthShell>
      <AuthTitle
        title={
          stage === "details" ? "Create your account" : "Verify your email"
        }
        subtitle={
          stage === "details"
            ? "Let’s build better habits together."
            : `We sent a 6-digit code to ${email}.`
        }
      />
      {notice ? <InlineNotice>{notice}</InlineNotice> : null}
      {stage === "details" ? (
        <>
          <AuthField
            label="Full name"
            placeholder="e.g. Your Name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoComplete="name"
            textContentType="name"
          />
          <AuthField
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <AuthField
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <AuthField
            label="Confirm password"
            placeholder="Enter your password again"
            value={confirmation}
            onChangeText={setConfirmation}
            error={errors.confirmation}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <Text className="mb-5 -mt-1 text-xs font-sans text-muted-foreground">
            We’ll send a short code to verify your email address.
          </Text>
          <PrimaryButton
            title="Create account"
            onPress={createAccount}
            busy={busy}
          />
          <View className="mt-5 flex-row justify-center">
            <Text className="font-sans text-muted-foreground">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable accessibilityRole="link">
                <Text className="font-sans-bold text-primary">Sign in</Text>
              </Pressable>
            </Link>
          </View>
        </>
      ) : (
        <>
          <AuthField
            label="Verification code"
            placeholder="6-digit code"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, ""))}
            error={errors.code}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
          />
          <PrimaryButton
            title="Verify email"
            onPress={verifyEmail}
            busy={busy}
          />
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={resendCode}
            className="mt-4 items-center"
          >
            <Text className="font-sans-bold text-primary">Resend code</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={editDetails}
            className="mt-3 items-center"
          >
            <Text className="font-sans text-muted-foreground">
              Back to your details
            </Text>
          </Pressable>
        </>
      )}
      {/* Clerk mounts its bot protection challenge here on web. */}
      <View nativeID="clerk-captcha" />
    </AuthShell>
  );
}

function PrimaryButton({
  title,
  onPress,
  busy,
}: {
  title: string;
  onPress: () => void;
  busy: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: busy, busy }}
      disabled={busy}
      onPress={onPress}
      className={`h-14 flex-row items-center justify-center rounded-full bg-primary px-5 ${busy ? "opacity-60" : "active:opacity-80"}`}
    >
      {busy ? (
        <ActivityIndicator color="#fff8f3" />
      ) : (
        <Text className="text-lg font-sans-bold text-background">{title}</Text>
      )}
    </Pressable>
  );
}
