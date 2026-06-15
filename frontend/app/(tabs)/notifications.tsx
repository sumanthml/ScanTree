import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert as RNAlert,
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

import { useAlertStore } from "@/store/alertStore";

const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: { text: string; onPress?: () => void; style?: "default" | "cancel" | "destructive" }[]
  ) => {
    useAlertStore.getState().showAlert(title, message, buttons);
  },
};
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "@/components/ui/Screen";
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/hooks/useTheme";
import { NotificationService, Notification } from "@/services/notification";
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  Activity,
  FileText,
} from "lucide-react-native";

// ─────────────────────────────────────────────
// Notification type → icon/color
// ─────────────────────────────────────────────
function getTypeStyle(type: string): { color: string; icon: any; bg: string } {
  switch (type?.toLowerCase()) {
    case "alert":
    case "critical":
    case "danger":
      return { color: "#EF4444", icon: AlertTriangle, bg: "rgba(239,68,68,0.1)" };
    case "success":
    case "completed":
      return { color: "#4ADE80", icon: CheckCircle, bg: "rgba(74,222,128,0.1)" };
    case "report":
    case "upload":
      return { color: "#3B82F6", icon: FileText, bg: "rgba(59,130,246,0.1)" };
    case "health":
    case "scan":
      return { color: "#A78BFA", icon: Activity, bg: "rgba(167,139,250,0.1)" };
    default:
      return { color: "#64748B", icon: Info, bg: "rgba(100,116,139,0.1)" };
  }
}

// ─────────────────────────────────────────────
// Relative time formatter
// ─────────────────────────────────────────────
function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}

// ─────────────────────────────────────────────
// Single Notification Card
// ─────────────────────────────────────────────
function NotificationCard({
  item,
  onMarkRead,
  onDelete,
  isDeleting,
}: {
  item: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  isDeleting: boolean;
}) {
  const ts = getTypeStyle(item.type);
  const Icon = ts.icon;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => !item.is_read && onMarkRead(item.id)}
      style={styles.cardWrapper}
    >
      <LinearGradient
        colors={
          item.is_read
            ? ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.01)"]
            : ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
        }
        style={[
          styles.card,
          { borderLeftColor: item.is_read ? "#1E293B" : ts.color },
          !item.is_read && { borderColor: `${ts.color}20` },
        ]}
      >
        {/* Icon */}
        <View style={[styles.iconBox, { backgroundColor: ts.bg }]}>
          <Icon size={18} color={ts.color} />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <AppText
              style={[
                styles.cardTitle,
                item.is_read ? { color: "#64748B" } : {},
              ]}
              numberOfLines={1}
            >
              {item.title}
            </AppText>
            <AppText style={styles.cardTime}>{timeAgo(item.created_at)}</AppText>
          </View>

          <AppText style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </AppText>

          <View style={styles.cardFooter}>
            {/* Type badge */}
            <View style={[styles.typeBadge, { backgroundColor: ts.bg }]}>
              <AppText style={[styles.typeBadgeText, { color: ts.color }]}>
                {item.type?.toUpperCase() || "GENERAL"}
              </AppText>
            </View>

            {/* Unread dot */}
            {!item.is_read && (
              <View style={[styles.unreadDot, { backgroundColor: ts.color }]} />
            )}
          </View>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          onPress={() => onDelete(item.id, item.title)}
          style={styles.deleteBtn}
          activeOpacity={0.7}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Trash2 size={14} color="#475569" />
          )}
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export default function NotificationsScreen() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadNotifications(isRefresh = false) {
    try {
      setError(null);
      if (isRefresh) setRefreshing(true);
      const result = await NotificationService.getNotifications();
      setNotifications(result.data);
      setUnreadCount(result.unread_count);
    } catch (err) {
      console.log("Notifications error:", err);
      setError("Unable to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  async function onRefresh() {
    await loadNotifications(true);
  }

  async function handleMarkRead(notificationId: string) {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    try {
      await NotificationService.markAsRead(notificationId);
    } catch {
      // Revert on error
      loadNotifications();
    }
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;
    Alert.alert(
      "Mark All as Read",
      "Mark all notifications as read?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark All",
          onPress: async () => {
            try {
              setMarkingAll(true);
              setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
              setUnreadCount(0);
              await NotificationService.markAllAsRead();
            } catch (err) {
              console.log(err);
              loadNotifications();
            } finally {
              setMarkingAll(false);
            }
          },
        },
      ]
    );
  }

  async function handleDelete(notificationId: string, title: string) {
    Alert.alert(
      "Delete Notification",
      `Delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(notificationId);
              await NotificationService.deleteNotification(notificationId);
              const deleted = notifications.find((n) => n.id === notificationId);
              setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
              if (deleted && !deleted.is_read) {
                setUnreadCount((c) => Math.max(0, c - 1));
              }
            } catch (err) {
              console.log(err);
              Alert.alert("Error", "Failed to delete notification.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <AppText style={{ color: "#475569", marginTop: 14, fontSize: 14 }}>
            Loading notifications…
          </AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false}>
      <View style={Platform.OS === "web" ? { maxWidth: 720, alignSelf: "center", width: "100%", flex: 1 } : { flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <AppText variant="heading" style={styles.heading}>
              Notifications
            </AppText>
            <AppText style={styles.sub}>
              Healthcare alerts &amp; report activities
            </AppText>
          </View>

          {/* Unread badge */}
          <LinearGradient
            colors={
              unreadCount > 0
                ? ["rgba(74,222,128,0.15)", "rgba(74,222,128,0.05)"]
                : ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]
            }
            style={[
              styles.unreadBadge,
              unreadCount > 0 && { borderColor: "rgba(74,222,128,0.25)" },
            ]}
          >
            {unreadCount > 0 ? (
              <Bell size={14} color="#4ADE80" />
            ) : (
              <BellOff size={14} color="#475569" />
            )}
            <AppText
              style={[
                styles.unreadText,
                { color: unreadCount > 0 ? "#4ADE80" : "#475569" },
              ]}
            >
              {unreadCount} unread
            </AppText>
          </LinearGradient>
        </View>

        {/* MARK ALL READ button */}
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            activeOpacity={0.7}
            disabled={markingAll}
            style={styles.markAllBtn}
          >
            {markingAll ? (
              <ActivityIndicator size="small" color="#4ADE80" />
            ) : (
              <CheckCheck size={15} color="#4ADE80" />
            )}
            <AppText style={styles.markAllText}>
              {markingAll ? "Marking…" : "Mark All as Read"}
            </AppText>
          </TouchableOpacity>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4ADE80"
            />
          }
          contentContainerStyle={styles.listContent}
        >
          {/* Error */}
          {error && (
            <View style={styles.errorBanner}>
              <AlertTriangle size={16} color="#EF4444" />
              <AppText style={styles.errorText}>{error}</AppText>
            </View>
          )}

          {/* Empty state */}
          {!error && notifications.length === 0 && (
            <LinearGradient
              colors={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]}
              style={styles.emptyContainer}
            >
              <BellOff size={48} color="#1E293B" style={{ marginBottom: 16 }} />
              <AppText style={styles.emptyTitle}>No Notifications</AppText>
              <AppText style={styles.emptyText}>
                You'll see healthcare alerts, scan updates, and report notifications here.
              </AppText>
            </LinearGradient>
          )}

          {/* List */}
          {notifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              isDeleting={deletingId === item.id}
            />
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 12,
  },
  heading: {
    fontSize: 34,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: -0.5,
  },
  sub: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 4,
  },
  unreadBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginTop: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "700",
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "rgba(74,222,128,0.06)",
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.15)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: "center",
  },
  markAllText: {
    color: "#4ADE80",
    fontWeight: "700",
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    flex: 1,
  },
  emptyContainer: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 48,
    alignItems: "center",
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  emptyText: {
    color: "#475569",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  // Card
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F8FAFC",
    flex: 1,
    marginRight: 8,
  },
  cardTime: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
  },
  cardMessage: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 36,
    minHeight: 36,
  },
});