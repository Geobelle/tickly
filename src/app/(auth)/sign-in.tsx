import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { AuthField, AuthShell, AuthTitle, InlineNotice } from "../../../components/auth/AuthShell";
import { getAuthErrorMessage, isValidEmail } from "../../../lib/auth";

type Stage = "password" | "second-factor";
type SecondFactor = "email_code" | "phone_code" | "totp" | "backup_code";

export default function SignIn() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<Stage>("password");
  const [secondFactor, setSecondFactor] = useState<SecondFactor>("email_code");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; code?: string }>({});
  const busy = fetchStatus === "fetching";

  const finishSignIn = async () => {
    const { error } = await signIn.finalize();
    if (error) {
      setNotice(getAuthErrorMessage(error) ?? "We couldn’t finish signing you in. Please try again.");
      return;
    }
    router.replace("/(tabs)");
  };

  const requestSecondFactor = async () => {
    const factors = signIn.supportedSecondFactors ?? [];
    const preferred: SecondFactor[] = ["email_code", "phone_code", "totp", "backup_code"];
    const selected = preferred.find((strategy) => factors.some((factor) => factor.strategy === strategy));
    if (!selected) {
      setNotice("Your account needs another verification method that isn’t available here. Please contact support.");
      return;
    }
    setSecondFactor(selected);
    if (selected === "email_code" || selected === "phone_code") {
      const { error } = selected === "email_code"
        ? await signIn.mfa.sendEmailCode()
        : await signIn.mfa.sendPhoneCode();
      if (error) {
        setNotice(getAuthErrorMessage(error) ?? "We couldn’t send a verification code. Please try again.");
        return;
      }
    }
    setStage("second-factor");
  };

  const submit = async () => {
    const nextErrors = {
      email: isValidEmail(email) ? undefined : "Enter a valid email address.",
      password: password ? undefined : "Enter your password.",
    };
    setErrors(nextErrors);
    setNotice("");
    if (nextErrors.email || nextErrors.password) return;

    const { error } = await signIn.password({ emailAddress: email.trim(), password });
    if (error) {
      setNotice(getAuthErrorMessage(error) ?? "We couldn’t sign you in. Check your details and try again.");
      return;
    }
    if (signIn.status === "complete") {
      await finishSignIn();
      return;
    }
    if (signIn.status === "needs_client_trust") {
      await requestSecondFactor();
      return;
    }
    if (signIn.status === "needs_second_factor") {
      await requestSecondFactor();
      return;
    }
    setNotice("This account needs another verification step. Please try again or contact support for help.");
  };

  const verifyCode = async () => {
    const cleanCode = code.trim();
    const isBackupCode = secondFactor === "backup_code";
    if (isBackupCode ? cleanCode.length < 4 : !/^\d{6}$/.test(cleanCode)) {
      setErrors({ code: isBackupCode ? "Enter your backup code." : "Enter the 6-digit verification code." });
      return;
    }
    setErrors({});
    setNotice("");
    const { error } = secondFactor === "email_code"
      ? await signIn.mfa.verifyEmailCode({ code: cleanCode })
      : secondFactor === "phone_code"
        ? await signIn.mfa.verifyPhoneCode({ code: cleanCode })
        : secondFactor === "totp"
          ? await signIn.mfa.verifyTOTP({ code: cleanCode })
          : await signIn.mfa.verifyBackupCode({ code: cleanCode });
    if (error) {
      setErrors({ code: getAuthErrorMessage(error) ?? "That code didn’t work. Check it and try again." });
      return;
    }
    if (signIn.status === "complete") await finishSignIn();
    else setErrors({ code: "Another verification step is needed. Please try again or contact support." });
  };

  const resendCode = async () => {
    if (secondFactor === "email_code" || secondFactor === "phone_code") {
      const { error } = secondFactor === "email_code"
        ? await signIn.mfa.sendEmailCode()
        : await signIn.mfa.sendPhoneCode();
      setNotice(error ? getAuthErrorMessage(error) ?? "We couldn’t send a new code." : "A fresh code is on its way.");
    }
  };

  const returnToPassword = async () => {
    await signIn.reset();
    setCode("");
    setErrors({});
    setNotice("");
    setStage("password");
  };

  return (
    <AuthShell>
      <AuthTitle
        title={stage === "password" ? "Welcome back!" : secondFactor === "totp" ? "Verify it’s you" : secondFactor === "backup_code" ? "Use a backup code" : "Check your inbox"}
        subtitle={stage === "password" ? "Pick up where you left off." : secondFactor === "totp" ? "Enter the code from your authenticator app." : secondFactor === "backup_code" ? "Enter one of the backup codes you saved." : secondFactor === "phone_code" ? "Enter the 6-digit code sent to your phone." : `Enter the 6-digit code sent to ${email}.`}
      />
      {notice ? <InlineNotice>{notice}</InlineNotice> : null}
      {stage === "password" ? (
        <>
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
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
          />
          <View className="mb-5 items-end">
            <Link href="/(auth)/reset-password" asChild>
              <Pressable accessibilityRole="link" hitSlop={8}>
                <Text className="font-sans-bold text-primary">Forgot password?</Text>
              </Pressable>
            </Link>
          </View>
          <PrimaryButton title="Sign in" onPress={submit} busy={busy} />
          <View className="mt-5 flex-row justify-center">
            <Text className="font-sans text-muted-foreground">New to Tickly? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable accessibilityRole="link">
                <Text className="font-sans-bold text-primary">Create account</Text>
              </Pressable>
            </Link>
          </View>
        </>
      ) : (
        <>
          <AuthField
            label={secondFactor === "backup_code" ? "Backup code" : "Verification code"}
            placeholder={secondFactor === "backup_code" ? "Enter backup code" : "6-digit code"}
            value={code}
            onChangeText={(value) => setCode(secondFactor === "backup_code" ? value : value.replace(/\D/g, ""))}
            error={errors.code}
            keyboardType={secondFactor === "backup_code" ? "default" : "number-pad"}
            autoComplete={secondFactor === "backup_code" ? "off" : "one-time-code"}
            textContentType={secondFactor === "backup_code" ? undefined : "oneTimeCode"}
            maxLength={secondFactor === "backup_code" ? 20 : 6}
          />
          <PrimaryButton title="Verify and sign in" onPress={verifyCode} busy={busy} />
          {secondFactor === "email_code" || secondFactor === "phone_code" ? (
            <Pressable accessibilityRole="button" disabled={busy} onPress={resendCode} className="mt-4 items-center">
              <Text className="font-sans-bold text-primary">Resend code</Text>
            </Pressable>
          ) : null}
          <Pressable className="mt-4 items-center" disabled={busy} onPress={returnToPassword}>
            <Text className="font-sans-bold text-primary">Back to sign in</Text>
          </Pressable>
        </>
      )}
      <View nativeID="clerk-captcha" />
    </AuthShell>
  );
}

function PrimaryButton({ title, onPress, busy }: { title: string; onPress: () => void; busy: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: busy, busy }}
      disabled={busy}
      onPress={onPress}
      className={`h-14 flex-row items-center justify-center rounded-full bg-primary px-5 ${busy ? "opacity-60" : "active:opacity-80"}`}
    >
      {busy ? <ActivityIndicator color="#fff8f3" /> : <Text className="text-lg font-sans-bold text-background">{title}</Text>}
    </Pressable>
  );
}
