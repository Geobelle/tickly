import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as string | undefined;
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;

const hasProjectToken = Boolean(
  projectToken &&
    projectToken.length >= 32 &&
    /^phc_[A-Za-z0-9_-]+$/.test(projectToken) &&
    !/(?:your|placeholder|replace|changeme)/i.test(projectToken),
);
const hasSecureHost = Boolean(host && /^https:\/\/[A-Za-z0-9.-]+(?::\d+)?(?:\/[^\s]*)?$/.test(host));

if (__DEV__ && (!hasProjectToken || !hasSecureHost)) {
  console.warn(
    "PostHog analytics is disabled. Provide a valid project ingestion key and HTTPS host to enable it.",
  );
}

export const posthog = (() => {
  if (!hasProjectToken || !hasSecureHost || !projectToken || !host) return null;

  try {
    return new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: false,
      disableRemoteFeatureFlags: true,
      logs: {
        serviceName: "tickly-mobile",
      },
    });
  } catch {
    if (__DEV__) {
      console.warn("PostHog failed to initialize. Analytics is disabled.");
    }
    return null;
  }
})();
