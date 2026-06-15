import API from "./api";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  data: Notification[];
  unread_count: number;
}

export const NotificationService = {

  /** Fetch all notifications + unread_count from backend */
  async getNotifications(): Promise<NotificationsResponse> {
    const response = await API.get("/notifications");
    const body = response.data;
    return {
      data:
        body?.data ??
        body?.notifications ??
        [],
      unread_count: body?.unread_count ?? 0,
    };
  },

  /** Mark a single notification as read */
  async markAsRead(notificationId: string): Promise<void> {
    await API.patch(`/notifications/${notificationId}/read`);
  },

  /** Mark ALL notifications as read */
  async markAllAsRead(): Promise<void> {
    await API.patch("/notifications/read-all");
  },

  /** Delete a single notification */
  async deleteNotification(notificationId: string): Promise<void> {
    await API.delete(`/notifications/${notificationId}`);
  },
};