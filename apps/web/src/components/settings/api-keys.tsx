"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

const apiKeys = [
  {
    id: 1,
    name: "Production API Key",
    key: "ayvlo_prod_1a2b3c4d5e6f7g8h9i0j",
    created: "2025-01-15",
    lastUsed: "2 hours ago",
  },
  {
    id: 2,
    name: "Development API Key",
    key: "ayvlo_dev_9z8y7x6w5v4u3t2s1r0q",
    created: "2025-01-10",
    lastUsed: "3 days ago",
  },
];

export function APIKeys() {
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());

  const toggleKeyVisibility = (id: number) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    return key.slice(0, 12) + "•".repeat(key.length - 12);
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h3 font-bold text-dark-text-primary mb-2">API Keys</h2>
          <p className="text-body text-dark-text-secondary">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create New Key
        </Button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="card bg-dark-bg-secondary border-border-gray/20 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-h4 font-semibold text-dark-text-primary mb-1">
                  {apiKey.name}
                </h3>
                <div className="flex items-center gap-4 text-small text-dark-text-secondary">
                  <span>Created: {apiKey.created}</span>
                  <span>•</span>
                  <span>Last used: {apiKey.lastUsed}</span>
                </div>
              </div>
              <button className="text-dark-text-secondary hover:text-red-500 transition-colors duration-200">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-lg bg-dark-bg-primary border border-border-gray/20 font-mono text-body text-dark-text-primary">
                {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
              </div>
              <button
                onClick={() => toggleKeyVisibility(apiKey.id)}
                className="p-3 rounded-lg bg-dark-bg-primary border border-border-gray/20 text-dark-text-secondary hover:text-dark-text-primary transition-colors duration-200"
              >
                {visibleKeys.has(apiKey.id) ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(apiKey.key)}
                className="p-3 rounded-lg bg-dark-bg-primary border border-border-gray/20 text-dark-text-secondary hover:text-accent-taupe transition-colors duration-200"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-accent-blue/10 border border-accent-blue/20 p-4">
        <p className="text-body text-dark-text-primary">
          <strong>Security Notice:</strong> Never share your API keys or commit them to version
          control. Rotate keys regularly and use different keys for production and development.
        </p>
      </div>
    </div>
  );
}
