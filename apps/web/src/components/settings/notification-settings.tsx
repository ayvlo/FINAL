"use client";

import { useState } from "react";

const notificationTypes = [
  {
    id: "anomaly-critical",
    title: "Critical Anomalies",
    description: "High-severity anomalies that require immediate attention",
    channels: {
      email: true,
      slack: true,
      sms: true,
    },
  },
  {
    id: "anomaly-warning",
    title: "Warning Anomalies",
    description: "Medium-severity anomalies to monitor",
    channels: {
      email: true,
      slack: true,
      sms: false,
    },
  },
  {
    id: "action-executed",
    title: "Action Executed",
    description: "Automated actions triggered by workflows",
    channels: {
      email: true,
      slack: true,
      sms: false,
    },
  },
  {
    id: "weekly-summary",
    title: "Weekly Summary",
    description: "Weekly digest of metrics and insights",
    channels: {
      email: true,
      slack: false,
      sms: false,
    },
  },
];

export function NotificationSettings() {
  const [settings, setSettings] = useState(notificationTypes);

  const toggleChannel = (id: string, channel: "email" | "slack" | "sms") => {
    setSettings(
      settings.map((item) =>
        item.id === id
          ? { ...item, channels: { ...item.channels, [channel]: !item.channels[channel] } }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h3 font-bold text-dark-text-primary mb-2">Notifications</h2>
        <p className="text-body text-dark-text-secondary">
          Configure how and when you receive alerts
        </p>
      </div>

      <div className="card bg-dark-bg-secondary border-border-gray/20 p-0">
        <div className="p-6 border-b border-border-gray/20">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <span className="text-caption font-semibold text-dark-text-primary">
                Notification Type
              </span>
            </div>
            <div className="text-center">
              <span className="text-caption font-semibold text-dark-text-primary">Email</span>
            </div>
            <div className="text-center">
              <span className="text-caption font-semibold text-dark-text-primary">Slack</span>
            </div>
            <div className="text-center">
              <span className="text-caption font-semibold text-dark-text-primary">SMS</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border-gray/20">
          {settings.map((item) => (
            <div key={item.id} className="p-6">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="col-span-1">
                  <h3 className="text-body font-semibold text-dark-text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-small text-dark-text-secondary">{item.description}</p>
                </div>
                <div className="text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.channels.email}
                      onChange={() => toggleChannel(item.id, "email")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-bg-primary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-taupe"></div>
                  </label>
                </div>
                <div className="text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.channels.slack}
                      onChange={() => toggleChannel(item.id, "slack")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-bg-primary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-taupe"></div>
                  </label>
                </div>
                <div className="text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.channels.sms}
                      onChange={() => toggleChannel(item.id, "sms")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-bg-primary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-taupe"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
