
import React from 'react';
import { User, Clock, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccessRequest } from '@/lib/auth';

interface RequestCardProps {
  request: AccessRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onReject }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Access Request
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                From: {request.fromUserEmail}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Pending
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Target Device:</span>
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-800">{request.deviceName}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Requested:</span>
            <div className="flex items-center space-x-1 text-sm text-slate-800">
              <Clock className="h-3 w-3" />
              <span>{request.timestamp}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={() => onAccept(request.id)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Accept
            </Button>
            <Button 
              onClick={() => onReject(request.id)}
              variant="outline"
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
            >
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
