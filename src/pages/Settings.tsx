import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, X, SquareChartGantt, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Apiurl from './../api';
import {
  Power, Moon, RotateCcw, Lock, Unlock, Image, Folder, Camera,
  Volume2, VolumeX, Terminal, FileText, Eye, Download as DownloadIcon, Upload, Settings
} from "lucide-react";
import {
  hasDownloadedAgent,
  setAgentDownloaded,
  mockDevices,
  mockRequests,
  logout,
  Device,
  AccessRequest,
} from "@/lib/auth"
import Sidebar from "@/components/Sidebar";
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
const [disconnecting, setDisconnecting] = useState<string | null>(null);
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

  setDisconnecting(targetUserId);

  try {
    await axios.post(`${Apiurl}/api/device/remove-access`, {
      userId,
      targetUserId
    });

    // Immediately update local state
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
  } finally {
    setDisconnecting(null);
  }
};
const handlemanageaccess=async(userid)=>{
  settargetuserid(userid)
  setopenpup(true);

}
  const getPlatformDownloadURL = () => {
    const platform = window.navigator.platform.toLowerCase();
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (platform.includes("win")) {
return "/electron-agent.exe";
    } else if (platform.includes("mac") || userAgent.includes("mac")) {
      return "/downloads/luma-agent-mac.dmg";
    } else if (userAgent.includes("linux")) {
      return "/downloads/luma-agent-linux.AppImage";
    } else {
      return null; // Unsupported
    }
  };

  const handleDownloadAgent = () => {
  const platform = window.navigator.platform.toLowerCase();
  const userAgent = window.navigator.userAgent.toLowerCase();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.userId;
console.log(userId)
  if (!userId) {
    toast({
      title: "Login Required",
      description: "Please log in before downloading the agent.",
      variant: "destructive",
    });
    return;
  }

  if (platform.includes("win")) {
    const exeUrl = "/electron-agent.exe";
    const exeLink = document.createElement("a");
    exeLink.href = exeUrl;
    exeLink.download = "electron-agent.exe";
    document.body.appendChild(exeLink);
    exeLink.click();
    document.body.removeChild(exeLink);

    // Step 2: Generate .bat content dynamically
    const batContent = `
@echo off
:: Create config folder and write userId
mkdir %USERPROFILE%\\.lumaagent 2>nul
echo { "userId": "${userId}" } > %USERPROFILE%\\.lumaagent\\config.json

:: Find the actual filename (first match)
for %%f in ("%USERPROFILE%\\Downloads\\electron-agent*.exe") do (
  set "agent=%%~f"
  goto :found
)

echo Agent not found in Downloads folder.
pause
exit /b

:found
echo Launching agent at %agent%
start "" "%agent%"

`;

    const blob = new Blob([batContent], { type: "application/octet-stream" });
    const batLink = document.createElement("a");
    batLink.href = URL.createObjectURL(blob);
    batLink.download = "launch-luma-agent.bat";
    document.body.appendChild(batLink);
    batLink.click();
    document.body.removeChild(batLink);

    toast({
      title: "Launcher Downloaded",
      description:
        "Please run the 'launch-luma-agent.bat' file to complete the setup.",
    });

    setAgentDownloaded();
    setTimeout(()=>{
    // setAgentDownloadState(true);

    },4000)
    return;
  }

  // macOS / Linux fallback
  const fallbackUrl = getPlatformDownloadURL();
  if (!fallbackUrl) {
    toast({
      title: "Unsupported Platform",
      description:
        "We couldn't detect a supported OS. Please download manually.",
      variant: "destructive",
    });
    return;
  }

  const link = document.createElement("a");
  link.href = fallbackUrl;
  link.download = fallbackUrl.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setAgentDownloaded();
  // setAgentDownloadState(true);
  toast({
    title: "Agent Downloaded",
    description:
      "Remote access agent has been downloaded. Please install it on your device.",
  });
};

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Device Access Settings</h1>
          <p className="text-slate-600 mt-1">Manage who has access to your devices</p>
        </div>

        {/* Stats Card */}
        <Card className="border-2 border-blue-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Users with Access</p>
                <p className="text-3xl font-bold text-slate-900">{allowedUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Agent Card */}
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDownloadAgent}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Agent
            </Button>
          </CardContent>
        </Card>

        {/* Allowed Users List */}
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Allowed Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allowedUsers.length > 0 ? (
              <div className="space-y-3">
                {allowedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Users className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900 truncate">{user.name || "Unnamed User"}</h4>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">Allowed</Badge>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handlemanageaccess(user.id)}
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <SquareChartGantt className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                      <Button
                        onClick={() => handleDisconnect(user.id)}
                        variant="destructive"
                        size="sm"
                        disabled={disconnecting === user.id}
                      >
                        {disconnecting === user.id ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Removing...
                          </span>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 mb-2">No Users with Access</h4>
                <p className="text-slate-600">No one currently has permission to access your devices</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Permission Popup */}
      {openpopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Manage Permissions</h3>
              <button
                onClick={() => setopenpup(false)}
                className="text-slate-500 hover:text-slate-900 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {controlActions.map((action) => (
                <div
                  key={action.name}
                  className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-900 capitalize">{action.name}</span>
                      <p className="text-xs text-slate-600">{action.description}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selected.includes(action.name)}
                    onChange={() => handleCheckboxChange(action.name)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Permissions
            </Button>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default Settingss;
