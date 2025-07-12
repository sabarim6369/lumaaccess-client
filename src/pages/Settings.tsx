
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Users, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { mockDevices, Device } from '@/lib/auth';

interface DeviceConnection {
  id: string;
  deviceName: string;
  deviceOs: string;
  connectedUser: string;
  connectedSince: string;
  status: 'active' | 'idle';
}

const Settings = () => {
  const [connections, setConnections] = useState<DeviceConnection[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for device connections
    const mockConnections: DeviceConnection[] = [
      {
        id: '1',
        deviceName: 'Work Laptop',
        deviceOs: 'Windows 11',
        connectedUser: 'john.doe@company.com',
        connectedSince: '2 hours ago',
        status: 'active'
      },
      {
        id: '2',
        deviceName: 'Home Desktop',
        deviceOs: 'macOS Ventura',
        connectedUser: 'jane.smith@gmail.com',
        connectedSince: '1 day ago',
        status: 'idle'
      },
      {
        id: '3',
        deviceName: 'Development Server',  
        deviceOs: 'Ubuntu 22.04',
        connectedUser: 'admin@techcorp.com',
        connectedSince: '3 hours ago',
        status: 'active'
      }
    ];
    setConnections(mockConnections);
  }, []);

  const handleDisconnect = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      setConnections(prev => prev.filter(c => c.id !== connectionId));
      toast({
        title: "Connection Terminated",
        description: `Disconnected ${connection.connectedUser} from ${connection.deviceName}`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? 
      <CheckCircle className="h-4 w-4 text-emerald-600" /> : 
      <AlertCircle className="h-4 w-4 text-amber-600" />;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge> :
      <Badge className="bg-amber-50 text-amber-700 border-amber-200">Idle</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Device Connection Settings</h1>
            <p className="text-muted-foreground mt-1">Manage who has access to your devices</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-xl">
                  <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Connected Devices</p>
                  <p className="text-2xl font-bold text-foreground">{connections.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-xl">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                  <p className="text-2xl font-bold text-foreground">
                    {connections.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Idle Connections</p>
                  <p className="text-2xl font-bold text-foreground">
                    {connections.filter(c => c.status === 'idle').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connections List */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Device Connections</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connections.length > 0 ? (
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl border border-border hover:bg-muted/80 transition-colors space-y-3 md:space-y-0"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="p-2 bg-background rounded-lg">
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-foreground text-lg truncate">
                            {connection.deviceName}
                          </h4>
                          {getStatusIcon(connection.status)}
                          {getStatusBadge(connection.status)}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                          <span className="font-medium">{connection.deviceOs}</span>
                          <span>Connected to: <span className="font-medium text-foreground">{connection.connectedUser}</span></span>
                          <span>Since: {connection.connectedSince}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDisconnect(connection.id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center space-x-2 md:ml-4"
                    >
                      <X className="h-4 w-4" />
                      <span>Disconnect</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No Active Connections</h4>
                <p className="text-muted-foreground">No devices are currently connected to other users</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
