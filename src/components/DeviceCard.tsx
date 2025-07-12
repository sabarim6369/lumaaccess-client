
import React from 'react';
import { Monitor, Smartphone, Server, Clock, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Device } from '@/lib/auth';

interface DeviceCardProps {
  device: Device;
  onConnect?: (deviceId: string) => void;
  onDetail?: (deviceId: string) => void;
  showActions?: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ 
  device, 
  onConnect, 
  onDetail, 
  showActions = true 
}) => {
  const getDeviceIcon = () => {
    if (device.os.toLowerCase().includes('mac') || device.os.toLowerCase().includes('windows')) {
      return <Monitor className="h-5 w-5" />;
    }
    if (device.os.toLowerCase().includes('android') || device.os.toLowerCase().includes('ios')) {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Server className="h-5 w-5" />;
  };

  const getStatusColor = () => {
    switch (device.status) {
      case 'online':
        return 'bg-emerald-500';
      case 'offline':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (device.status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-emerald-600" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              {getDeviceIcon()}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                {device.name}
              </CardTitle>
              {device.hostname && (
                <p className="text-sm text-slate-500 mt-1">{device.hostname}</p>
              )}
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Operating System:</span>
            <span className="text-sm font-medium text-slate-800">{device.os}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Status:</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge 
                variant={device.status === 'online' ? 'default' : 'secondary'}
                className={`capitalize ${
                  device.status === 'online' 
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' 
                    : device.status === 'offline'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {device.status}
              </Badge>
            </div>
          </div>
          
          {device.lastSeen && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last Seen:</span>
              <div className="flex items-center space-x-1 text-sm text-slate-800">
                <Clock className="h-3 w-3" />
                <span>{device.lastSeen}</span>
              </div>
            </div>
          )}
          
          {showActions && (
            <div className="flex space-x-2 pt-2">
              {device.status === 'online' ? (
                <Button 
                  onClick={() => onDetail?.(device.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Connect
                </Button>
              ) : (
                <Button 
                  onClick={() => onConnect?.(device.id)}
                  variant="outline"
                  className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                  disabled={device.status === 'pending'}
                >
                  {device.status === 'pending' ? 'Request Pending' : 'Send Request'}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
