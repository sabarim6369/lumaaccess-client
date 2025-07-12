import React, { useState, useEffect } from "react";
import {
  Download,
  Monitor,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Wifi,
  WifiOff,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  hasDownloadedAgent,
  setAgentDownloaded,
  mockDevices,
  mockRequests,
  logout,
  Device,
  AccessRequest,
} from "@/lib/auth";
import RequestCard from "@/components/RequestCard";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setDevices } from "../Redux/Slices/Dataslice";
import Apiurl from './../api';
const Dashboard = () => {
  const dispatch = useDispatch();
  // const devices = useSelector((state: RootState) => state.data.devices);
  const [agentDownloaded, setAgentDownloadState] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [activeConnections, setActiveConnections] = useState<Device[]>([]);
  const [showAllDevices, setShowAllDevices] = useState(false);
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // useEffect(() => {
  //   setAgentDownloadState(hasDownloadedAgent());
  //   // setDevices(mockDevices);
  //   setRequests(mockRequests);
  //   setActiveConnections(mockDevices.filter((d) => d.status === "online"));
  // }, []);
  useEffect(() => {
  const checkAgentStatus = async () => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
      setAgentDownloadState(true); 
    } else {
      const agentIsRunning = await hasDownloadedAgent(); 
      setAgentDownloadState(agentIsRunning);
    }
  };

  checkAgentStatus(); 

  setRequests(mockRequests);
  setActiveConnections(mockDevices.filter((d) => d.status === "online"));
}, []);

  useEffect(() => {
    const fetchdata = async () => {
      const res = await axios.get(
        `${Apiurl}/devices`
      );
      setDevices(res.data);
      localStorage.setItem("devices", JSON.stringify(res.data));
    };
    fetchdata();
  }, []);
  const getPlatformDownloadURL = () => {
    const platform = window.navigator.platform.toLowerCase();
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (platform.includes("win")) {
      return "/downloads/luma-agent-win.exe";
    } else if (platform.includes("mac") || userAgent.includes("mac")) {
      return "/downloads/luma-agent-mac.dmg";
    } else if (userAgent.includes("linux")) {
      return "/downloads/luma-agent-linux.AppImage";
    } else {
      return null; // Unsupported
    }
  };

  const handleDownloadAgent = () => {
    const url = getPlatformDownloadURL();

    if (!url) {
      toast({
        title: "Unsupported Platform",
        description:
          "We couldn't detect a supported OS. Please download manually.",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // optional
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAgentDownloaded();
    setAgentDownloadState(true);
    toast({
      title: "Agent Downloaded",
      description:
        "Remote access agent has been downloaded. Please install it on your device.",
    });
  };

  const handleSendRequest = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === deviceId ? { ...d, status: "pending" as const } : d
        )
      );

      toast({
        title: "Request Sent",
        description: `Access request sent to ${device.name}`,
      });
    }
  };

  const handleAccessDevice = (deviceId: string) => {
    navigate(`/access?device=${deviceId}`);
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      const device = devices.find((d) => d.id === request.deviceId);
      if (device) {
        setActiveConnections((prev) => [
          ...prev,
          { ...device, status: "online" },
        ]);
      }

      setRequests((prev) => prev.filter((r) => r.id !== requestId));

      toast({
        title: "Request Accepted",
        description: `Access granted to ${request.fromUserEmail}`,
      });
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));

      toast({
        title: "Request Rejected",
        description: `Access denied to ${request.fromUserEmail}`,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-emerald-600" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-slate-400" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <WifiOff className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            Online
          </Badge>
        );
      case "offline":
        return (
          <Badge
            variant="secondary"
            className="bg-slate-50 text-slate-600 border-slate-200"
          >
            Offline
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!agentDownloaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-full sm:max-w-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground truncate">
                Welcome, {user?.name || user?.email}
              </h1>
              <p className="text-muted-foreground">
                Remote Access Manager Dashboard
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button
                onClick={() => navigate("/settings")}
                variant="outline"
                size="sm"
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Settings className="h-4 w-4" />
                <span>Handle My Device Connections</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          <div className="max-w-full mx-auto">
            <Card className="shadow-xl border-border bg-card w-full">
              <CardHeader className="text-center pb-6 px-4 sm:px-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-4 mx-auto">
                  <Download className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  Download Remote Agent
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground px-2 sm:px-0">
                  Install our secure agent to start managing your devices
                  remotely
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center px-4 sm:px-6">
                <div className="space-y-4 mb-6 max-w-md mx-auto">
                  {[
                    "Secure encrypted connections",
                    "Cross-platform compatibility",
                    "Real-time device monitoring",
                  ].map((text, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center space-x-2 text-muted-foreground"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleDownloadAgent}
                  size="lg"
                  className="w-full h-14 bg-primary hover:bg-primary/90 font-semibold text-lg shadow-lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Agent
                </Button>

                <p className="text-sm text-muted-foreground mt-4">
                  Compatible with Windows, macOS, and Linux
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const displayDevices = showAllDevices ? devices : devices;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-full sm:max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground truncate">
              Device Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and access your connected devices
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              size="sm"
              className="shadow-sm flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Settings className="h-4 w-4" />
              <span>Handle My Device Connections</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center justify-center space-x-2 shadow-sm w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Cards */}
          {[
            {
              icon: (
                <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              ),
              label: "Total Devices",
              value: devices.length,
              bg: "bg-blue-50 dark:bg-blue-950",
              iconWrapper: "p-3 rounded-xl",
            },
            {
              icon: (
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              ),
              label: "Active Connections",
              value: activeConnections.length,
              bg: "bg-emerald-50 dark:bg-emerald-950",
              iconWrapper: "p-3 rounded-xl",
            },
            {
              icon: (
                <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              ),
              label: "Pending Requests",
              value: requests.length,
              bg: "bg-orange-50 dark:bg-orange-950",
              iconWrapper: "p-3 rounded-xl",
            },
          ].map(({ icon, label, value, bg, iconWrapper }, idx) => (
            <Card key={idx} className="bg-card border-border shadow-lg w-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`${bg} ${iconWrapper}`}>{icon}</div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-card border-border shadow-xl w-full overflow-hidden rounded-lg">
          <CardContent className="px-2 py-3 sm:px-4 sm:py-6">
            <Tabs defaultValue="devices" className="space-y-3 sm:space-y-5">
              {/* Tabs Header */}
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 w-full h-auto">
                <TabsTrigger
                  value="devices"
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap py-2 px-2 sm:px-3"
                >
                  <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Available Devices</span>
                  <span className="xs:hidden">Devices</span>
                </TabsTrigger>
                <TabsTrigger
                  value="connections"
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap py-2 px-2 sm:px-3"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Active Connections</span>
                  <span className="xs:hidden">Active</span>
                  {activeConnections.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-xs h-4 min-w-4 px-1"
                    >
                      {activeConnections.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="requests"
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap py-2 px-2 sm:px-3"
                >
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Incoming Requests</span>
                  <span className="xs:hidden">Requests</span>
                  {requests.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-orange-100 text-orange-800 text-xs h-4 min-w-4 px-1"
                    >
                      {requests.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Devices Tab */}
              <TabsContent value="devices" className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Available Devices
                  </h3>
                  <div className="flex items-center flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="text-muted-foreground text-xs"
                    >
                      {devices.length} devices
                    </Badge>
                    {devices.length > 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAllDevices(!showAllDevices)}
                        className="flex items-center space-x-1 sm:space-x-2 h-7 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{showAllDevices ? "Show Less" : "View All"}</span>
                      </Button>
                    )}
                  </div>
                </div>

                <ScrollArea className="max-h-[350px] sm:max-h-[400px] lg:max-h-[500px] pr-1">
                  <div className="space-y-2 sm:space-y-3">
                    {displayDevices.map((device) => (
                 <div
  key={device.id}
  className="flex flex-col sm:flex-row  gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl border border-border hover:bg-muted/80 transition-all w-full"
>
  <div className="flex items-start gap-3 w-full flex-1">
    <div className="p-1.5 sm:p-2 bg-background rounded-lg flex-shrink-0">
      <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
    </div>
    <div className="flex-1 overflow-hidden min-w-0">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
        <h4 className="font-semibold text-sm sm:text-lg truncate">
          {device.name}
        </h4>
        {getStatusIcon(device.status)}
        {getStatusBadge(device.status)}
      </div>
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
        <span>{device.os}</span>
        {device.hostname && (
          <span className="hidden sm:inline">• {device.hostname}</span>
        )}
        {device.lastSeen && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="truncate">{device.lastSeen}</span>
          </span>
        )}
      </div>
    </div>
  </div>

  <div className="w-full sm:w-auto sm:flex sm:items-center">
    {device.status === "online" ? (
      <Button
        onClick={() => handleAccessDevice(device.id)}
        className="w-full sm:w-32 bg-primary hover:bg-primary/90 text-primary-foreground h-8 sm:h-9 text-xs sm:text-sm"
      >
        Access{" "}
        <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    ) : (
      <Button
        onClick={() => handleSendRequest(device.id)}
        variant="outline"
        className="w-full sm:w-36 h-8 sm:h-9 text-xs sm:text-sm"
        disabled={device.status === "pending"}
      >
        {device.status === "pending" ? "Request Pending" : "Send Request"}
      </Button>
    )}
  </div>
</div>

                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Active Connections Tab */}
              <TabsContent
                value="connections"
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Active Connections
                  </h3>
                  <Badge variant="outline" className="text-emerald-600 text-xs">
                    {activeConnections.length} active
                  </Badge>
                </div>

                {activeConnections.length > 0 ? (
                  <ScrollArea className="max-h-[350px] sm:max-h-[400px] lg:max-h-[500px] pr-1">
                    <div className="space-y-2 sm:space-y-3">
                      {activeConnections.map((device) => (
                        <div
                          key={device.id}
                          className="flex flex-col gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl border border-emerald-200 hover:bg-muted/80 w-full"
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className="p-1.5 sm:p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg flex-shrink-0">
                              <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1 overflow-hidden min-w-0">
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                <h4 className="font-semibold text-sm sm:text-lg truncate">
                                  {device.name}
                                </h4>
                                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                                  Connected
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <span>{device.os}</span>
                                {device.hostname && (
                                  <span className="hidden sm:inline">
                                    • {device.hostname}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAccessDevice(device.id)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
                          >
                            Access{" "}
                            <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Users className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <h4 className="text-base sm:text-lg font-medium text-foreground mb-2">
                      No Active Connections
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Connect to devices to see them here
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Requests Tab */}
              <TabsContent value="requests" className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Incoming Requests
                  </h3>
                  <Badge variant="outline" className="text-orange-600 text-xs">
                    {requests.length} pending
                  </Badge>
                </div>

                {requests.length > 0 ? (
                  <ScrollArea className="max-h-[350px] sm:max-h-[400px] lg:max-h-[500px] pr-1">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {requests.map((request) => (
                        <RequestCard
                          key={request.id}
                          request={request}
                          onAccept={handleAcceptRequest}
                          onReject={handleRejectRequest}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Bell className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <h4 className="text-base sm:text-lg font-medium text-foreground mb-2">
                      No Pending Requests
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Access requests will appear here
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
