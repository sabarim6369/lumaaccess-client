import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Apiurl from './../api';

interface AllowedUser {
  id: string;
  name: string;
  email: string;
}

const Settings = () => {
  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.userId;

    const fetchAllowedUsers = async () => {
      try {
        const res = await axios.get(`${Apiurl}/api/device/alloweddevices`, {
          params: { userId },
        });
        setAllowedUsers(res.data);
      } catch (error) {
        console.error("Error fetching allowed users:", error);
      }
    };

    fetchAllowedUsers();
  }, []);

const handleDisconnect = async (targetUserId: string) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser.userId;

  try {
    await axios.post(`${Apiurl}/api/device/remove-access`, {
      userId,
      targetUserId
    });

    setAllowedUsers(prev => prev.filter(u => u.id !== targetUserId));

    toast({
      title: "Access Revoked",
      description: `Removed access for user`,
      variant: "destructive",
    });
  } catch (error) {
    console.error("Failed to remove access", error);
    toast({
      title: "Error",
      description: "Failed to revoke access. Please try again.",
      variant: "destructive",
    });
  }
};


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Device Access Settings</h1>
            <p className="text-muted-foreground text-sm">Manage who currently has access to your devices</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Users with Access</p>
                  <p className="text-2xl font-semibold">{allowedUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allowed Users List */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Allowed Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allowedUsers.length > 0 ? (
              <div className="space-y-4">
                {allowedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-xl bg-muted/40 hover:bg-muted/60 transition"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-2 bg-white dark:bg-muted rounded-lg shadow-sm">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold truncate">{user.name || "Unnamed User"}</h4>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Allowed</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDisconnect(user.id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Remove Access
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No Users with Access</h4>
                <p className="text-sm text-muted-foreground">
                  No one currently has permission to access your devices.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
