"use server";

import { getNotificationsPortail, type NotificationsPortail } from "@/server/dal/notifications";

/** Utilisé par la cloche de la barre supérieure (chargement client). */
export async function actionListerNotifications(): Promise<NotificationsPortail> {
  try {
    return await getNotificationsPortail();
  } catch {
    return { items: [], total: 0 };
  }
}
