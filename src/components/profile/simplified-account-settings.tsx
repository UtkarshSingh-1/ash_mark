"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SimplifiedAccountSettingsProps {
  userId: string;
}

export function SimplifiedAccountSettings({ userId: _userId }: SimplifiedAccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast({
          title: "Error",
          description: data?.error || "Failed to update password",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccountDeletion = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      toast({
        title: "Account Deletion Requested",
        description:
          "We'll send you a confirmation email to complete the process",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-0"
              />
            </div>
            <Button
              type="submit"
              className="bg-crimson-600 hover:bg-crimson-700 border-0"
            disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Delete Account
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleAccountDeletion}
                className="ml-4 border-0"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}