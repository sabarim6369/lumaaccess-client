
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
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { mockDevices, Device } from '@/lib/auth';
import axios from 'axios';
import Apiurl from './../api';
const DeviceAccess = () => {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('device');
  const [device, setDevice] = useState<Device | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
const [permissionData, setPermissionData] = useState(null);


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
        });

    setPermissionData(res.data);

        console.log(res);
      }
    }
  };

  getdata();
}, [deviceId]);

  const handleCommand = async (command: string) => {
  try {
    if (!device?.id) {
      throw new Error("No device selected");
    }

    const res = await axios.post(`${Apiurl}/api/device/send-command`, {
      deviceId: device.id,
      commandType: command,
    });

    toast({
      title: "Command Executed",
      description: `${command} command sent to ${device?.name}`,
    });
  } catch (error) {
    toast({
      title: "Command Failed",
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: 'destructive', // assuming your toast supports variants
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
    .replace(/\s+/g, '')              // remove spaces
    .replace(/^[A-Z]/, (c) => c.toLowerCase()); // lowercase first char

  return permissionData[key]; // true only if allowed
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {/* Device Information Header */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Monitor className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">{device.name}</CardTitle>
                  <p className="text-slate-600 mt-1">Remote device access and control</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <>
                      <Wifi className="h-5 w-5 text-emerald-600" />
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Connected</Badge>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-5 w-5 text-red-600" />
                      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Disconnected</Badge>
                    </>
                  )}
                </div>
                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  disabled={!isConnected}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Hostname</p>
                <p className="font-semibold text-slate-800">{device.hostname}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Operating System</p>
                <p className="font-semibold text-slate-800">{device.os}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <p className="font-semibold text-slate-800 capitalize">{device.status}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Last Seen</p>
                <p className="font-semibold text-slate-800">{device.lastSeen}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">CPU Usage</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-24 h-2 bg-slate-200 rounded-full">
                      <div className="w-1/3 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-800">32%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <HardDrive className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-slate-600">Memory</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-24 h-2 bg-slate-200 rounded-full">
                      <div className="w-1/2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-800">48%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-slate-600">Uptime</p>
                  <p className="text-sm font-medium text-slate-800 mt-1">2 days, 14 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Device Controls</CardTitle>
            <p className="text-slate-600">Select an action to perform on the connected device</p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredActions.map((action) => (
                <Button
                  key={action.name}
                  onClick={() => handleCommand(action.name)}
                  className={`${action.color} text-white h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-all duration-200 shadow-lg`}
                  disabled={!isConnected}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="font-medium text-sm">{action.name}</span>
                  <span className="text-xs opacity-90 text-center">{action.description}</span>
                </Button>
              ))}
            </div>

            {!isConnected && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Connection Lost</p>
                <p className="text-red-600 text-sm mt-1">
                  The connection to {device.name} has been lost. You will be redirected to the dashboard.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeviceAccess;
