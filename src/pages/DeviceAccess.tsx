
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Monitor, 
  Power, 
  Moon, 
  RotateCcw, 
  Wifi,
  WifiOff,
  Settings,
  Activity,
  Clock,
  HardDrive,
  Folder,
  Camera,
  Mic,
  Image,
  FileText,
  Terminal,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Eye,
  Trash2,
  Copy,
  Edit,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { mockDevices, Device } from '@/lib/auth';
import axios from 'axios';
import Apiurl from './../api';
import Sidebar from "@/components/Sidebar";
const DeviceAccess = () => {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('device');
  const [device, setDevice] = useState<Device | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
const [permissionData, setPermissionData] = useState(null);
 const [firstimage, setfirstimage] = useState<string>("");
const [showScreenPopup, setShowScreenPopup] = useState(false);
const [isScreenSharing, setIsScreenSharing] = useState(false);

useEffect(() => {
  const getdata = async () => {
    if (deviceId) {
      const stored = localStorage.getItem("devices");
      if (stored) {
        const parsedDevices = JSON.parse(stored);
        console.log(parsedDevices[0].userId);
        const targetid = parsedDevices[0].userId;

        const foundDevice = parsedDevices.find((d: any) => d.id === deviceId);
        if (foundDevice) {
          setDevice(foundDevice);
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.userId;

          const res = await axios.post(`${Apiurl}/api/device/getallowedstuffs`, {
            ownerId: targetid,
            targetId: userId,
          },{
              withCredentials: true,

          });

    setPermissionData(res.data);

        console.log(res);
      }
    }
  };

  getdata();
}, [deviceId]);
useEffect(() => {
  let interval: NodeJS.Timeout;

  if (isScreenSharing) {
    interval = setInterval(async () => {
      try {
        const res = await axios.post(`${Apiurl}/api/device/getscreenshare`, {
          deviceId: device.id,
        }, {
          withCredentials: true,
        });

        const imagesObj = res.data.images;
        const firstKey = Object.keys(imagesObj)[0];
        const firstImage = imagesObj[firstKey];
        setfirstimage(firstImage);
      } catch (error) {
        console.error("Error fetching screen share:", error);
      }
    }, 2000);
  }

  return () => {
    clearInterval(interval);
  };
}, [isScreenSharing]);

const handleCommand = async (command: string) => {
  try {
    if (!device?.id) {
      throw new Error("No device selected");
    }

  


    const res = await axios.post(`${Apiurl}/api/device/send-command`, {
      deviceId: device.id,
      commandType: command,
    }, {
      withCredentials: true,
    });

    toast({
      title: "Command Executed",
      description: `${command} command sent to ${device.name}`,
    });
  if (command === "Screen Share") {
  setShowScreenPopup(true);
  setIsScreenSharing(true); 
  toast({
    title: "Screen Share Opened",
    description: `Showing screen from ${device.name}`,
  });

  return;
}
  } catch (error) {
    toast({
      title: "Command Failed",
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: 'destructive',
    });
  }
};

  const controlActions = [
    { name: 'Shutdown', icon: Power, color: 'bg-red-600 hover:bg-red-700', description: 'Power off the device' },
    { name: 'Sleep', icon: Moon, color: 'bg-blue-600 hover:bg-blue-700', description: 'Put device to sleep' },
    { name: 'Restart', icon: RotateCcw, color: 'bg-orange-600 hover:bg-orange-700', description: 'Restart the device' },
    { name: 'Lock Screen', icon: Lock, color: 'bg-purple-600 hover:bg-purple-700', description: 'Lock the screen' },
    { name: 'Unlock Screen', icon: Unlock, color: 'bg-green-600 hover:bg-green-700', description: 'Unlock the screen' },
    { name: 'Screenshot', icon: Image, color: 'bg-indigo-600 hover:bg-indigo-700', description: 'Capture screen' },
    { name: 'Access Files', icon: Folder, color: 'bg-yellow-600 hover:bg-yellow-700', description: 'Browse files' },
    { name: 'Open Camera', icon: Camera, color: 'bg-pink-600 hover:bg-pink-700', description: 'Access camera' },
    { name: 'Control Audio', icon: Volume2, color: 'bg-teal-600 hover:bg-teal-700', description: 'Audio controls' },
    { name: 'Mute Audio', icon: VolumeX, color: 'bg-gray-600 hover:bg-gray-700', description: 'Mute all audio' },
    { name: 'Access Terminal', icon: Terminal, color: 'bg-slate-800 hover:bg-slate-900', description: 'Command line access' },
    { name: 'File Manager', icon: FileText, color: 'bg-cyan-600 hover:bg-cyan-700', description: 'Manage files' },
    { name: 'Screen Share', icon: Eye, color: 'bg-emerald-600 hover:bg-emerald-700', description: 'Share screen' },
    { name: 'Download Files', icon: Download, color: 'bg-blue-500 hover:bg-blue-600', description: 'Download files' },
    { name: 'Upload Files', icon: Upload, color: 'bg-green-500 hover:bg-green-600', description: 'Upload files' },
    { name: 'System Settings', icon: Settings, color: 'bg-violet-600 hover:bg-violet-700', description: 'Access settings' },
  ];
const filteredActions = controlActions.filter((action) => {
  if (!permissionData) return false;

  const key = action.name
    .replace(/\s+/g, '')             
    .replace(/^[A-Z]/, (c) => c.toLowerCase()); 

  return permissionData[key]; 
});

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: `Disconnected from ${device?.name}`,
      variant: "destructive",
    });
    setTimeout(() => navigate('/dashboard'), 1500);
  };


  if (!device) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Device Not Found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }


  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="border-slate-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{device.name}</h1>
            <p className="text-slate-600">Remote device access and control</p>
          </div>
        </div>

        {/* Device Info Card */}
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Monitor className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">{device.name}</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Remote device access</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isConnected ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0">Connected</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 border-0">Disconnected</Badge>
                )}
                <Button 
                  onClick={handleDisconnect}
                  variant="destructive"
                  size="sm"
                  disabled={!isConnected}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Hostname</p>
                <p className="font-semibold text-slate-900 text-sm">{device.hostname}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Operating System</p>
                <p className="font-semibold text-slate-900 text-sm">{device.os}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Status</p>
                <p className="font-semibold text-slate-900 text-sm capitalize">{device.status}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Last Seen</p>
                <p className="font-semibold text-slate-900 text-sm">{device.lastSeen}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Controls */}
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Device Controls</CardTitle>
            <p className="text-slate-600 text-sm">Select an action to perform on the connected device</p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredActions.map((action) => (
                <Button
                  key={action.name}
                  onClick={() => handleCommand(action.name)}
                  className={`${action.color} text-white h-auto p-4 flex flex-col items-center gap-2 hover:opacity-90 transition-all`}
                  disabled={!isConnected}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{action.name}</span>
                  <span className="text-xs opacity-90 text-center">{action.description}</span>
                </Button>
              ))}
            </div>

            {!isConnected && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-900 font-medium">Connection Lost</p>
                <p className="text-red-700 text-sm mt-1">
                  The connection to {device.name} has been lost.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Screen Share Popup */}
      {showScreenPopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition"
              onClick={() => {
                setShowScreenPopup(false);
                setIsScreenSharing(false);
              }}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Live Screen</h2>
            {firstimage ? (
              <img
                src={`data:image/png;base64,${firstimage}`}
                alt="Screen Share"
                className="w-full h-auto rounded-lg border-2 border-slate-200"
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-slate-100 rounded-lg">
                <p className="text-slate-600">Loading screen...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default DeviceAccess;
