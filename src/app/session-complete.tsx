import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { BackHandler, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { CompletionDoneButton } from "@/features/completion/CompletionDoneButton";
import { CompletionOrb } from "@/features/completion/CompletionOrb";
import { CompletionStats } from "@/features/completion/CompletionStats";
import { CompletionTransition } from "@/features/completion/CompletionTransition";
import { getProgramProgress } from "@/features/explorer/progress";
import { getSessionStore } from "@/features/timer/sessionStore";

const ORB_READY_WAIT_MS = 250;
// The celebratory takeover shown whenever a session completes naturally
// (pushed by useNavigateToCompletion, mounted at the app root). Stage 2 (the
// brief "zen transition") plays automatically, then hands off to stage 3
// (the completion screen itself) — see the completion-screen interview for
// why this is a single non-dismissible route rather than two.
export default function SessionCompleteScreen() {
  const params = useLocalSearchParams<{
    durationMinutes?: string;
    programId?: string;
  }>();
  const router = useRouter();
  const durationMinutes = Number(params.durationMinutes) || 0;
  const programId =
    typeof params.programId === "string" ? params.programId : undefined;
  const program = programId ? getProgramProgress(programId) : undefined;

  // Keep both phases mounted and move the handoff onto the UI runtime. This
  // avoids a React render/remount at the exact moment the celebration ends.
  const completionProgress = useSharedValue(0);
  const transitionFinished = useSharedValue(0);
  const orbReady = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  // Block Android's hardware back button for the whole takeover; iOS's swipe
  // gesture is disabled via this screen's Stack.Screen options below.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => subscription.remove();
  }, []);

  const revealCompletion = useCallback(() => {
    completionProgress.set(
      withTiming(1, { duration: reducedMotion ? 0 : 220 }),
    );
  }, [completionProgress, reducedMotion]);

  const handleTransitionFinished = useCallback(() => {
    transitionFinished.set(1);
    console.log("Transition finished", orbReady.get());
    if (orbReady.get()) {
      revealCompletion();
      return;
    }

    setTimeout(revealCompletion, ORB_READY_WAIT_MS);
  }, [orbReady, revealCompletion, transitionFinished]);

  const handleOrbReady = useCallback(() => {
    orbReady.set(1);
    if (transitionFinished.get()) {
      revealCompletion();
    }
  }, [orbReady, revealCompletion, transitionFinished]);

  const handleDone = () => {
    if (completionProgress.get() < 1) return;
    getSessionStore().resetToIdle();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const transitionStyle = useAnimatedStyle(() => ({
    opacity: 1 - completionProgress.get(),
  }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: completionProgress.get(),
  }));

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.phase, contentStyle]}>
        <View style={styles.content}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusLabel}>Session complete</Text>
          </View>

          {/* Mounted during the transition so WebGPU can initialize before
              the completion screen becomes visible. */}
          <CompletionOrb onReady={handleOrbReady} />

          <View style={styles.copy}>
            <Text style={styles.headline}>Moment of stillness</Text>
            <Text style={styles.subtitle}>
              Your mind has settled. Carry this quiet with you through the rest
              of your day.
            </Text>
          </View>

          <CompletionStats
            durationMinutes={durationMinutes}
            program={
              program
                ? { completed: program.completed, total: program.total }
                : undefined
            }
          />

          <View style={styles.actions}>
            <CompletionDoneButton onPress={handleDone} />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.phaseTransition, transitionStyle]}>
        <CompletionTransition onFinished={handleTransitionFinished} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  phase: {
    flex: 1,
  },
  phaseTransition: {
    pointerEvents: "none",
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.containerPaddingMobile,
    paddingVertical: theme.spacing.sectionGap,
    gap: theme.spacing.sectionGap / 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.unit,
    paddingHorizontal: theme.spacing.gutter,
    paddingVertical: theme.spacing.unit,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceContainer,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.success,
  },
  statusLabel: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    textTransform: "uppercase",
    color: theme.colors.onSurfaceVariant,
  },
  copy: {
    alignItems: "center",
    gap: theme.spacing.unit,
  },
  headline: {
    fontFamily: theme.typography.headlineMdMobile.fontFamily,
    fontSize: theme.typography.headlineMdMobile.fontSize,
    lineHeight: theme.typography.headlineMdMobile.lineHeight,
    color: theme.colors.onSurface,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
    maxWidth: 280,
  },
  actions: {
    alignSelf: "center",
    maxWidth: theme.maxWidth,
    width: "100%",
  },
}));
