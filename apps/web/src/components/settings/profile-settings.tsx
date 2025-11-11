"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h3 font-bold text-dark-text-primary mb-2">Profile Settings</h2>
        <p className="text-body text-dark-text-secondary">
          Update your personal information and preferences
        </p>
      </div>

      <div className="card bg-dark-bg-secondary border-border-gray/20">
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-taupe to-accent-blue flex items-center justify-center text-white font-bold text-2xl">
              JD
            </div>
            <div>
              <Button className="btn-secondary">Change Avatar</Button>
              <p className="text-small text-dark-text-secondary mt-2">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-caption font-semibold text-dark-text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="input w-full bg-dark-bg-primary"
              />
            </div>
            <div>
              <label className="block text-caption font-semibold text-dark-text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="john@company.com"
                className="input w-full bg-dark-bg-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-caption font-semibold text-dark-text-primary mb-2">
                Company
              </label>
              <input
                type="text"
                defaultValue="Acme Corp"
                className="input w-full bg-dark-bg-primary"
              />
            </div>
            <div>
              <label className="block text-caption font-semibold text-dark-text-primary mb-2">
                Role
              </label>
              <select className="input w-full bg-dark-bg-primary">
                <option>Founder / CEO</option>
                <option>Product Manager</option>
                <option>Data Analyst</option>
                <option>Engineer</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-caption font-semibold text-dark-text-primary mb-2">
              Timezone
            </label>
            <select className="input w-full bg-dark-bg-primary">
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC (GMT)</option>
              <option>UTC+1 (Central European Time)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border-gray/20">
            <Button className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
