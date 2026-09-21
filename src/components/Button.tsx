import * as Haptics from "expo-haptics";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
import { Platform, Pressable } from "react-native";

export type ButtonProps = ComponentPropsWithoutRef<typeof Pressable> & {
  haptics?: boolean;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
};

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  function Button(
    {
      disabled = false,
      haptics = true,
      hapticStyle = Haptics.ImpactFeedbackStyle.Light,
      onPress,
      accessibilityRole = "button",
      accessible = true,
      role = "button",
      ...props
    },
    ref,
  ) {
    return (
      <Pressable
        {...props}
        ref={ref}
        accessible={accessible}
        accessibilityRole={accessibilityRole}
        disabled={disabled}
        role={role}
        onPress={(event) => {
          if (onPress) {
            if (haptics && !disabled && Platform.OS !== "web") {
              void Haptics.impactAsync(hapticStyle).catch(() => {});
            }
            onPress(event);
          }
        }}
      />
    );
  },
);

Button.displayName = "Button";
