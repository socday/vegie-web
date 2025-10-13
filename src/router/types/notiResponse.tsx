export type Noti = {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  senderName: string;
  isBroadcast: boolean;
  type: number;
  readAt: string | null;
  createdAt: string;
};

export type NotiResponse = {
  isSuccess: boolean;
  data: {
    items: Noti[];
    unreadCount: number;
  };
  message: string;
  exception: string | null;
};