"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "message" | "document" | "system";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "Document “CONTRA-2025-045” awaits your approval",
    description: "",
    timestamp: "39 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    type: "document",
    title: "Document Received and Processed",
    description:
      "Your W-2 form for 2023 has been successfully uploaded and verified.",
    timestamp: "2 hours ago",
    isRead: false,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <MessageSquare className="h-5 w-5 text-blue-600" />
        </div>
      );
    case "document":
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
      );
    default:
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
      );
  }
};

export function NotificationDropdown() {
  const [notifications] = useState<Notification[]>(sampleNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative bg-transparent p-2 hover:bg-transparent"
        >
          <Bell
            className="h-6 w-6 text-gray-600"
            style={{ width: "24px", height: "24px" }}
          />
          {unreadCount > 0 && (
            <div className="absolute top-1 right-3 h-2 w-2 rounded-full border-2 border-white bg-[#DC2626]">
              <span></span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[400px] border-gray-200 p-0 shadow-lg"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-[17px] font-semibold text-primary-gray">
            Notifications
          </h3>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Bell className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 px-6 py-5 transition-colors hover:bg-gray-50"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-2 text-base font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    <p className="mb-3 text-sm leading-relaxed text-gray-600">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#4B5563]">
                        {notification.timestamp}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-400 hover:text-primary-400/80 h-auto px-2 py-1 text-sm font-semibold hover:bg-none"
                        onClick={() => {
                          // Handle view action
                          console.log("View notification:", notification.id);
                          setIsOpen(false);
                        }}
                      >
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
