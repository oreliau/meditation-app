import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { CompletionDoneButton } from "@/features/completion/CompletionDoneButton";
import { CompletionOrb } from "@/features/completion/CompletionOrb";
import { CompletionStats } from "@/features/completion/CompletionStats";
import { CompletionTransition } from "@/features/completion/CompletionTransition";
import { getProgramProgress } from "@/features/explorer/progress";
import { getSessionStore } from "@/features/timer/sessionStore";

type Stage = "transition" | "success";
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
  const durationMinutes = Number(params.durationMinutes) || 0;
  const programId =
    typeof params.programId === "string" ? params.programId : undefined;
  const program = programId ? getProgramProgress(programId) : undefined;

  const [stage, setStage] = useState<Stage>("transition");
  const transitionFinished = useRef(false);
  const orbReady = useRef(false);

  // Block Android's hardware back button for the whole takeover; iOS's swipe
  // gesture is disabled via this screen's Stack.Screen options below.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => subscription.remove();
  }, []);

  const handleTransitionFinished = useCallback(() => {
    transitionFinished.current = true;
    if (orbReady.current) {
      setStage("success");
      return;
    }

    setTimeout(() => setStage("success"), ORB_READY_WAIT_MS);
  }, []);

  const handleOrbReady = useCallback(() => {
    orbReady.current = true;
    if (transitionFinished.current) {
      setStage("success");
    }
  }, []);

  const handleDone = useCallback(() => {
    getSessionStore().resetToIdle();
    router.replace("/");
  }, []);

  return (
    <View style={styles.screen}>
      <View
        style={[styles.content, { opacity: stage === "success" ? 1 : 0 }]}
        pointerEvents={stage === "success" ? "auto" : "none"}
        accessible={stage === "success"}
      >
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
            Your mind has settled. Carry this quiet with you through the rest of
            your day.
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
      {stage === "transition" && (
        <View style={styles.transitionOverlay} pointerEvents="none">
          <CompletionTransition onFinished={handleTransitionFinished} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.containerPaddingMobile,
    paddingVertical: theme.spacing.sectionGap,
    gap: theme.spacing.sectionGap / 2,
  },
  transitionOverlay: {
    ...StyleSheet.absoluteFillObject,
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
