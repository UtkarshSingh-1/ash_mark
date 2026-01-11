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
  Settings,
  Shield,
  Trash2,
  Download,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AccountSettingsProps {
  userId: string;
}

export function AccountSettings({ userId }: AccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    // Mock password change - implement actual logic
    toast({
      title: "Success",
      description: "Password updated successfully",
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDataDownload = () => {
    toast({
      title: "Data Export Started",
      description: "You'll receive an email with your data shortly",
    });
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
            >
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Data & Privacy
          </CardTitle>
          <CardDescription>
            Manage your personal data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30">
            <div>
              <h4 className="font-medium">Download Your Data</h4>
              <p className="text-sm text-muted-foreground">
                Get a copy of all your account data and order history
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDataDownload}
              className="border-0 bg-background"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30">
            <div>
              <h4 className="font-medium">Marketing Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Control how we communicate with you
              </p>
            </div>
            <Button variant="outline" className="border-0 bg-background">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30">
            <div>
              <h4 className="font-medium">Cookie Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Manage your cookie and tracking preferences
              </p>
            </div>
            <Button variant="outline" className="border-0 bg-background">
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
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
