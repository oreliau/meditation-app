import { setNotificationsClient } from "./NotificationsClient";
import { createNotificationService } from "./notification-service";

// Startup wiring, imported from index.ts alongside src/unistyles.ts.
// Metro picks ExpoNotificationsClient.web.ts on web, so this stays
// side-effect free there.
setNotificationsClient(createNotificationService());
