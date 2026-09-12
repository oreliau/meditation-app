import { createExpoNotificationsClient } from "./ExpoNotificationsClient";
import { setNotificationsClient } from "./NotificationsClient";

// Startup wiring, imported from index.ts alongside src/unistyles.ts.
// Metro picks ExpoNotificationsClient.web.ts on web, so this stays
// side-effect free there.
setNotificationsClient(createExpoNotificationsClient());
