"use client";

import { useState } from "react";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { IntegrationsGrid } from "@/components/settings/integrations-grid";
import { APIKeys } from "@/components/settings/api-keys";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "integrations", label: "Integrations" },
  { id: "api", label: "API Keys" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-h1 font-bold text-dark-text-primary mb-2">Settings</h1>
        <p className="text-body text-dark-text-secondary">
          Manage your account, integrations, and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-gray/20">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-body font-semibold border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-accent-taupe text-accent-taupe"
                  : "border-transparent text-dark-text-secondary hover:text-dark-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "integrations" && <IntegrationsGrid />}
        {activeTab === "api" && <APIKeys />}
      </div>
    </div>
  );
}
