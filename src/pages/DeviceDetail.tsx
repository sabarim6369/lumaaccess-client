
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Monitor, 
  Power, 
  Moon, 
  RotateCcw, 
  Terminal, 
  Wifi,
  WifiOff,
  Settings,
  Activity,
  Clock,
  HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { mockDevices, Device } from '@/lib/auth';

const DeviceDetail = () => {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('device');
  const [device, setDevice] = useState<Device | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (deviceId) {
      const foundDevice = mockDevices.find(d => d.id === deviceId);
      if (foundDevice) {
        setDevice(foundDevice);
      }
    }
  }, [deviceId]);

  const handleCommand = (command: string) => {
    toast({
      title: "Command Sent",
      description: `${command} command sent to ${device?.name}`,
    });
  };

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
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Device Control</h1>
            <p className="text-slate-600">Remote access to {device.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Monitor className="h-6 w-6 text-blue-600" />
                    </div>
                    <span>{device.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <>
                        <Wifi className="h-4 w-4 text-emerald-600" />
                        <Badge className="bg-emerald-100 text-emerald-800">Connected</Badge>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-600" />
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Disconnected</Badge>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Hostname:</span>
                    <span className="text-sm font-medium text-slate-800">{device.hostname}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Operating System:</span>
                    <span className="text-sm font-medium text-slate-800">{device.os}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Status:</span>
                    <span className="text-sm font-medium text-slate-800 capitalize">{device.status}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Last Seen:</span>
                    <span className="text-sm font-medium text-slate-800">{device.lastSeen}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    System Status
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">CPU Usage:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-slate-200 rounded-full">
                          <div className="w-1/3 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-slate-600">32%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Memory:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-slate-200 rounded-full">
                          <div className="w-1/2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-slate-600">48%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Disk Space:</span>
                      <div className="flex items-center space-x-2">
                        <HardDrive className="h-3 w-3 text-slate-600" />
                        <span className="text-xs text-slate-600">245 GB free</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full border-red-200 text-red-700 hover:bg-red-50"
                  disabled={!isConnected}
                >
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Remote Control</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* System Commands */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 flex items-center">
                      <Power className="h-4 w-4 mr-2" />
                      System Commands
                    </h4>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleCommand('Shutdown')}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        disabled={!isConnected}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        Shutdown
                      </Button>
                      
                      <Button 
                        onClick={() => handleCommand('Sleep')}
                        variant="outline"
                        className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                        disabled={!isConnected}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Sleep
                      </Button>
                      
                      <Button 
                        onClick={() => handleCommand('Restart')}
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                        disabled={!isConnected}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restart
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 flex items-center">
                      <Terminal className="h-4 w-4 mr-2" />
                      Quick Actions
                    </h4>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleCommand('Lock Screen')}
                        variant="outline"
                        className="w-full"
                        disabled={!isConnected}
                      >
                        Lock Screen
                      </Button>
                      
                      <Button 
                        onClick={() => handleCommand('Screenshot')}
                        variant="outline"
                        className="w-full"
                        disabled={!isConnected}
                      >
                        Take Screenshot
                      </Button>
                      
                      <Button 
                        onClick={() => handleCommand('System Info')}
                        variant="outline"
                        className="w-full"
                        disabled={!isConnected}
                      >
                        Get System Info
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-slate-800">
                          {isConnected ? 'Connected' : 'Disconnected'}
                        </p>
                        <p className="text-sm text-slate-600">
                          {isConnected 
                            ? 'Real-time control available' 
                            : 'Connection lost - attempting to reconnect...'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>Connected for 15 minutes</span>
                    </div>
                  </div>
                </div>

                {!isConnected && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
      </div>
    </div>
  );
};

export default DeviceDetail;
