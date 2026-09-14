import { Button, HStack, Text, VStack } from "@expo/ui/swift-ui";
import {
  background,
  cornerRadius,
  font,
  foregroundStyle,
  padding,
  widgetURL,
} from "@expo/ui/swift-ui/modifiers";
import {
  addUserInteractionListener,
  createLiveActivity,
  createWidget,
  type LiveActivityLayout,
} from "expo-widgets";
import { useEffect, useRef } from "react";
import type { SessionSnapshot, SessionStore } from "./sessionStore";

type WidgetProps = {
  status: SessionSnapshot["status"];
  durationMinutes: number;
  remainingSeconds: number;
  endsAt?: number;
};

const HOME_URL = "meditationapp:///timer";

function TimerText({ props }: { props: WidgetProps }) {
  if (props.status === "Running" && props.endsAt !== undefined) {
    return (
      <Text
        timerInterval={{ lower: new Date(), upper: new Date(props.endsAt) }}
        countsDown
        modifiers={[
          font({ size: 30, weight: "bold" }),
          foregroundStyle("#F6F3EE"),
        ]}
      />
    );
  }

  const minutes = Math.floor(props.remainingSeconds / 60);
  const seconds = props.remainingSeconds % 60;
  return (
    <Text
      modifiers={[
        font({ size: 30, weight: "bold" }),
        foregroundStyle("#F6F3EE"),
      ]}
    >
      {`${minutes}:${seconds.toString().padStart(2, "0")}`}
    </Text>
  );
}

function WidgetContent({ props }: { props: WidgetProps }) {
  const active = props.status === "Running" || props.status === "Paused";
  const action = active
    ? props.status === "Running"
      ? "pause"
      : "resume"
    : "start";

  return (
    <VStack
      alignment="leading"
      spacing={8}
      modifiers={[
        background("#17231F"),
        cornerRadius(18),
        padding({ all: 14 }),
        widgetURL(HOME_URL),
      ]}
    >
      <Text
        modifiers={[
          font({ size: 13, weight: "semibold" }),
          foregroundStyle("#A8D5C2"),
        ]}
      >
        {active ? "MEDITATION" : "READY TO REST"}
      </Text>
      {active ? (
        <TimerText props={props} />
      ) : (
        <Text>{`${props.durationMinutes} min session`}</Text>
      )}
      <HStack spacing={8}>
        <Text modifiers={[font({ size: 12 }), foregroundStyle("#B9C6C0")]}>
          {active
            ? props.status === "Running"
              ? "In progress"
              : "Paused"
            : "Begin when ready"}
        </Text>
        <Button
          target={action}
          label={
            action === "start"
              ? "Start"
              : action === "pause"
                ? "Pause"
                : "Resume"
          }
        />
      </HStack>
    </VStack>
  );
}

export const meditationWidget = createWidget<WidgetProps>(
  "MeditationWidget",
  (props) => <WidgetContent props={props} />,
);

function liveActivityLayout(props: WidgetProps): LiveActivityLayout {
  const action = props.status === "Running" ? "pause" : "resume";
  const timer = <TimerText props={props} />;

  return {
    banner: (
      <HStack spacing={12}>
        <VStack alignment="leading" spacing={4}>
          <Text
            modifiers={[
              font({ size: 12, weight: "semibold" }),
              foregroundStyle("#A8D5C2"),
            ]}
          >
            MEDITATION
          </Text>
          {timer}
        </VStack>
        <Button
          target={action}
          label={props.status === "Running" ? "Pause" : "Resume"}
        />
      </HStack>
    ),
    compactLeading: <Text>◌</Text>,
    compactTrailing: timer,
    minimal: <Text>◌</Text>,
    expandedCenter: timer,
    expandedBottom: (
      <Button
        target={action}
        label={props.status === "Running" ? "Pause" : "Resume"}
      />
    ),
  };
}

export const meditationLiveActivity = createLiveActivity<WidgetProps>(
  "MeditationLiveActivity",
  liveActivityLayout,
);

function widgetProps(snapshot: SessionSnapshot): WidgetProps {
  return {
    status: snapshot.status,
    durationMinutes: snapshot.durationMinutes,
    remainingSeconds: snapshot.remainingSeconds,
    endsAt: snapshot.endsAt,
  };
}

export function useSessionWidgets(store: SessionStore): void {
  const liveActivity = useRef<ReturnType<
    typeof meditationLiveActivity.start
  > | null>(null);
  const lastActivityState = useRef<string | null>(null);

  useEffect(() => {
    const publish = () => {
      const snapshot = store.getSnapshot();
      const props = widgetProps(snapshot);
      meditationWidget.updateSnapshot(props);

      const active =
        snapshot.status === "Running" || snapshot.status === "Paused";
      if (!active) {
        if (liveActivity.current) {
          void liveActivity.current.end("immediate");
          liveActivity.current = null;
        }
        lastActivityState.current = null;
        return;
      }

      if (!liveActivity.current) {
        liveActivity.current = meditationLiveActivity.start(props, HOME_URL);
        lastActivityState.current = `${snapshot.status}:${snapshot.endsAt ?? snapshot.remainingSeconds}`;
        return;
      }

      // Native Text renders the countdown. Only send updates for state changes,
      // avoiding a JS-to-extension update every second.
      const activityState = `${snapshot.status}:${snapshot.endsAt ?? snapshot.remainingSeconds}`;
      if (activityState !== lastActivityState.current) {
        void liveActivity.current.update(props);
        lastActivityState.current = activityState;
      }
    };

    const interaction = addUserInteractionListener((event) => {
      if (event.target === "start") {
        store.play();
      } else if (event.target === "pause") {
        store.pause();
      } else if (event.target === "resume") {
        store.play();
      }
    });
    const unsubscribe = store.subscribe(publish);
    publish();

    return () => {
      interaction.remove();
      unsubscribe();
    };
  }, [store]);
}
