import { BottomSheet } from "@expo/ui";
import { createContext, useContext, useState } from "react";
import { Pressable } from "react-native";

const PresentationSheetContext = createContext<{
  isPresented: boolean;
  setIsPresented: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function PresentationSheet({ children }: { children: React.ReactNode }) {
  const [isPresented, setIsPresented] = useState(false);
  return (
    <PresentationSheetContext.Provider value={{ isPresented, setIsPresented }}>
      {children}
    </PresentationSheetContext.Provider>
  );
}

function PresentationSheetTrigger({ children }: { children: React.ReactNode }) {
  const context = useContext(PresentationSheetContext);
  const onPress = () => {
    if (context) {
      context.setIsPresented(true);
    }
  };
  return <Pressable onPress={onPress}>{children}</Pressable>;
}

function PresentationSheetContent({
  children,
}: {
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}) {
  const context = useContext(PresentationSheetContext);
  if (!context?.isPresented) {
    return null;
  }
  return (
    <BottomSheet
      isPresented={context.isPresented}
      onDismiss={() => context.setIsPresented(false)}
    >
      {typeof children === "function"
        ? children(() => context.setIsPresented(false))
        : children}
    </BottomSheet>
  );
}

PresentationSheet.Trigger = PresentationSheetTrigger;
PresentationSheet.Content = PresentationSheetContent;
