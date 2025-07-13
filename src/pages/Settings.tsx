import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, X,SquareChartGantt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Apiurl from './../api';
import {
  Power, Moon, RotateCcw, Lock, Unlock, Image, Folder, Camera,
  Volume2, VolumeX, Terminal, FileText, Eye, Download, Upload, Settings
} from "lucide-react";
interface AllowedUser {
  id: string;
  name: string;
  email: string;
}
const controlActions = [
  { name: 'shutdown', icon: Power, color: 'bg-red-600 hover:bg-red-700', description: 'Power off the device' },
  { name: 'sleep', icon: Moon, color: 'bg-blue-600 hover:bg-blue-700', description: 'Put device to sleep' },
  { name: 'restart', icon: RotateCcw, color: 'bg-orange-600 hover:bg-orange-700', description: 'Restart the device' },
  { name: 'lockScreen', icon: Lock, color: 'bg-purple-600 hover:bg-purple-700', description: 'Lock the screen' },
  { name: 'unlockScreen', icon: Unlock, color: 'bg-green-600 hover:bg-green-700', description: 'Unlock the screen' },
  { name: 'screenshot', icon: Image, color: 'bg-indigo-600 hover:bg-indigo-700', description: 'Capture screen' },
  { name: 'accessFiles', icon: Folder, color: 'bg-yellow-600 hover:bg-yellow-700', description: 'Browse files' },
  { name: 'openCamera', icon: Camera, color: 'bg-pink-600 hover:bg-pink-700', description: 'Access camera' },
  { name: 'controlAudio', icon: Volume2, color: 'bg-teal-600 hover:bg-teal-700', description: 'Audio controls' },
  { name: 'muteAudio', icon: VolumeX, color: 'bg-gray-600 hover:bg-gray-700', description: 'Mute all audio' },
  { name: 'accessTerminal', icon: Terminal, color: 'bg-slate-800 hover:bg-slate-900', description: 'Command line access' },
  { name: 'fileManager', icon: FileText, color: 'bg-cyan-600 hover:bg-cyan-700', description: 'Manage files' },
  { name: 'screenShare', icon: Eye, color: 'bg-emerald-600 hover:bg-emerald-700', description: 'Share screen' },
  { name: 'downloadFiles', icon: Download, color: 'bg-blue-500 hover:bg-blue-600', description: 'Download files' },
  { name: 'uploadFiles', icon: Upload, color: 'bg-green-500 hover:bg-green-600', description: 'Upload files' },
  { name: 'systemSettings', icon: Settings, color: 'bg-violet-600 hover:bg-violet-700', description: 'Access settings' },
];
const Settingss = () => {
  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
const[openpopup,setopenpup]=useState(false);
const[targetuserid,settargetuserid]=useState();
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
const handleCheckboxChange = (name: string) => {
  setSelected((prev) =>
    prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
  );
};

const allPermissionKeys = [
  "shutdown",
  "sleep",
  "restart",
  "lockScreen",
  "unlockScreen",
  "screenshot",
  "accessFiles",
  "openCamera",
  "controlAudio",
  "muteAudio",
  "accessTerminal",
  "fileManager",
  "screenShare",
  "downloadFiles",
  "uploadFiles",
  "systemSettings"
];

const handleSave = async () => {
  const permissions = allPermissionKeys.reduce((acc, key) => {
    acc[key] = selected.includes(key); // true if selected, false otherwise
    return acc;
  }, {} as Record<string, boolean>);

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.userId;

    const response = await axios.post(`${Apiurl}/api/device/updatepermission`, {
      ownerId: userId,
      targetUserId: targetuserid,
      permissions,
    });

    console.log("Permissions saved successfully:", response.data);
   toast({
  title: "Access Updated",
  description: `Permissions updated for user.`,
  variant: "default", // or "success" if you have custom variant
});

  } catch (error: any) {
    console.error("Failed to save permissions:", error.response?.data || error.message);
    toast({
  title: "Update Failed",
  description: "Could not update permissions. Please try again.",
  variant: "destructive",
});

  }

  setopenpup(false); // close popup
};


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
const handlemanageaccess=async(userid)=>{
  settargetuserid(userid)
  setopenpup(true);

}

  return (
    <div className="min-h-screen bg-background text-foreground bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        
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
                      onClick={() => handlemanageaccess(user.id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <SquareChartGantt className="h-4 w-4" />
                      Manage Access
                    </Button>
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
   {openpopup && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-800">Manual Access Controls</h3>
        <button
          onClick={() => setopenpup(false)}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
        {controlActions.map((action) => (
          <div
            key={action.name}
            className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md ${action.color}`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">{action.name}</span>
            </div>
            <input
              type="checkbox"
              checked={selected.includes(action.name)}
              onChange={() => handleCheckboxChange(action.name)}
              className="w-4 h-4 accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
      >
        Save
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Settingss;
