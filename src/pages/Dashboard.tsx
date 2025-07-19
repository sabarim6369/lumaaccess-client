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
import useAuthStore from "@/Zustandstore/useAuthstore";
const Dashboard = () => {
  const dispatch = useDispatch();
  // const devices = useSelector((state: RootState) => state.data.devices);
  const [agentDownloaded, setAgentDownloadState] = useState(()=>{
    return localStorage.getItem("skip")==="true"?true:false
  });
  const [downloadInitiated, setDownloadInitiated] = useState(false);
const {setIsAuthenticated}=useAuthStore()
  const [devices, setDevices] = useState<Device[]>([]);
  const [connecteddevices,setconnecteddevices]=useState<Device[]>([]);
const [requesteddevices,setrequesteddevice]=useState<Device[]>([])
const [incomingrequest,setincomingrequest]=useState<AccessRequest[]>([])

  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [activeConnections, setActiveConnections] = useState<Device[]>([]);
  const [showAllDevices, setShowAllDevices] = useState(false);
  const { user, setUser } = useAuth();
  console.log(user)
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userid,setuserid]=useState();
const[loading,setloading]=useState(false);

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
       const skip = localStorage.getItem("skip");
  if (skip === "true") {
    setAgentDownloadState(true);
    return;
  }
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
      setloading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.userId;
  setuserid(userId)
      const res = await axios.get( `${Apiurl}/api/device/devices`,{params:{userid:userId},  withCredentials: true
});
      setDevices(res.data.list);
      setconnecteddevices(res.data.connectedevice);
      setrequesteddevice(res.data.requested_by_me);
      setincomingrequest(res.data.incomingrequest);

      console.log(res.data,"🤣🤣🤣🤣")
      localStorage.setItem("devices", JSON.stringify(res.data.list));
      setloading(false);
    };
    fetchdata();
  }, []);
  const pingAgent = async (): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:5967/ping"); 
    return res.ok;
  } catch {
    return false;
  }
};
useEffect(() => {
  if (!downloadInitiated) return;

  const interval = setInterval(async () => {
    const isRunning = await pingAgent();

    if (isRunning) {
      clearInterval(interval);
      setAgentDownloadState(true);
      setDownloadInitiated(false);
      toast({
        title: "Agent Connected",
        description: "Your device is now live and ready to use!",
      });

      // Optionally notify backend via WebSocket here
      // socket?.emit("agent-online", { userId: user.id });
    }
  }, 2000); 

  return () => clearInterval(interval);
}, [downloadInitiated]);

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
      return null; 
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
setDownloadInitiated(true);

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
  setAgentDownloadState(true);
  toast({
    title: "Agent Downloaded",
    description:
      "Remote access agent has been downloaded. Please install it on your device.",
  });
};


 const handleSendRequest = async (targetUserId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // assuming you store current user
    const currentUserId = user?.userId;

    const res = await axios.post(`${Apiurl}/api/device/send-request`, {
      
      fromUserId: currentUserId,
      toUserId: targetUserId,
     
    });

    toast({ title: "Request Sent" });
    // Optionally refetch devices
  } catch (err) {
    console.error("Error sending request", err);
    toast({ title: "Failed to send request", variant: "destructive" });
  }
};


  const handleAccessDevice = (deviceId: string) => {
    navigate(`/access?device=${deviceId}`);
  };

const handleAcceptRequest = async (requesterId: string) => {
  console.log(requesterId,userid)
  await axios.post(`${Apiurl}/api/device/accept-request`, {
    userId: userid,
    requesterId,
  });

  setRequests((prev) => prev.filter((r) => r.fromUserId !== requesterId));
  
  toast({
    title: "Request Accepted",
    description: `Access granted to user.`,
  });
};

//   const request = requests.find((r) => r.id === requestId);
//   console.log(request)
//   if (request) {
//     await axios.post(`${Apiurl}/api/device/accept-request`, {
//       userId: userid,
//       deviceId: request.deviceId,
//       requesterId: request.fromUserId,
//     });

//     setRequests((prev) => prev.filter((r) => r.id !== requestId));
//     toast({
//       title: "Request Accepted",
//       description: `Access granted to ${request.fromUserEmail}`,
//     });
//   }
// };

const handleRejectRequest = async (requestId: string, requesterEmail: string) => {
  console.log("🤣🤣🤣",requestId,requesterEmail)
  try {
    await axios.post(`${Apiurl}/api/device/reject-request`, {
      userId: userid,
      requesterId: requestId,
    });

    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    toast({
      title: "Request Rejected",
      description: `Access denied to ${requesterEmail}`,
      variant: "destructive",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to reject request. Please try again.",
      variant: "destructive",
    });
    console.error("Error rejecting request:", error);
  }
};


const skipped = () => {
  localStorage.setItem("skip", "true"); 
  setAgentDownloadState(true);
};

 const handleLogout = async () => {
  try {
    // await axios.post(`${Apiurl}/api/auth/logout`, {}, { withCredentials: true });
    logout();
    setUser(null);
    localStorage.removeItem("user");
setIsAuthenticated(false)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    navigate("/login");
  } catch (error) {
    toast({
      title: "Logout failed",
      description: "Something went wrong while logging out.",
      variant: "destructive",
    });
  }
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
  {downloadInitiated ? (
    <>
      <div className="flex flex-col items-center space-y-4">
        <Download className="w-10 h-10 text-green-600" />
        <p className="text-lg font-medium text-green-700">
          Agent Downloaded Successfully
        </p>
      <p className="text-sm text-muted-foreground">
  Please <strong className="text-red-600 font-bold">run the downloaded agent by double-clicking the <code>launch-luma-agent.bat</code> file</strong> to activate remote access on your system.
</p>


        <Button
          variant="ghost"
          size="sm"
          onClick={skipped}
          className="mt-2 text-sm text-primary underline hover:no-underline"
        >
          Skip for now
        </Button>
      </div>
    </>
  ) : (
    <>
      <div className="space-y-4 mb-6 max-w-md mx-auto">
        {[
          "Secure encrypted connections",
          "Cross-platform compatibility",
          "Real-time device monitoring",
        ]?.map((text, idx) => (
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
        Already downloaded?{" "}
        <strong className="text-red-600">Don’t forget to run the agent</strong> to link your device!
      </p>

      <Button
        variant="ghost"
        size="sm"
        onClick={skipped}
        className="mt-4 text-sm text-primary underline hover:no-underline"
      >
        Skip for now
      </Button>

      <p className="text-sm text-muted-foreground mt-2">
        Compatible with Windows, macOS, and Linux
      </p>
    </>
  )}
</CardContent>


            </Card>
          </div>
        </div>
      </div>
    );
  }
const renderActionButton = (device) => {
  if (device.statusType === "allowed" && device.status === "online") {
    return (
      <Button
        onClick={() => handleAccessDevice(device.id)}
        className="w-full sm:w-32 bg-primary hover:bg-primary/90 text-primary-foreground h-8 sm:h-9 text-xs sm:text-sm"
      >
        Access <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    );
  }

  if (device.statusType === "requested") {
    return (
      <Button
        variant="outline"
        className="w-full sm:w-36 h-8 sm:h-9 text-xs sm:text-sm"
        disabled
      >
        Request Pending
      </Button>
    );
  }

  if (device.statusType === "shared_by_me") {
    return (
      <Button
        variant="secondary"
        className="w-full sm:w-36 h-8 sm:h-9 text-xs sm:text-sm"
        disabled
      >
        Your Device
      </Button>
    );
  }

  return (
    <Button
      onClick={() => handleSendRequest(device.userId)}
      variant="outline"
      className="w-full sm:w-36 h-8 sm:h-9 text-xs sm:text-sm"
    >
      Send Request
    </Button>
  );
};

  const displayDevices = showAllDevices ? devices : devices;

  return (
    <div className="min-h-screen bg-background overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-full sm:max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Cards */}
          {[
            {
              icon: (
                <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              ),
              label: "Total Devices",
              value: devices?.length,
              bg: "bg-blue-50 dark:bg-blue-950",
              iconWrapper: "p-3 rounded-xl",
            },
            {
              icon: (
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              ),
              label: "Active Connections",
              value: devices?.length,
              bg: "bg-emerald-50 dark:bg-emerald-950",
              iconWrapper: "p-3 rounded-xl",
            },
            {
              icon: (
                <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              ),
              label: "Pending Requests",
              value: incomingrequest?.length,
              bg: "bg-orange-50 dark:bg-orange-950",
              iconWrapper: "p-3 rounded-xl",
            },
          ]?.map(({ icon, label, value, bg, iconWrapper }, idx) => (
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
        <Card className="bg-card border-border shadow-xl w-full overflow-hidden rounded-lg mb-4 sm:mb-6">
          <CardContent className="px-2 py-3 sm:px-4 sm:py-6">
            <Tabs defaultValue="devices" className="space-y-3 sm:space-y-5">
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
                  <span className="hidden xs:inline">Connected Devices</span>
                  <span className="xs:hidden">Active</span>
                  {connecteddevices?.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-xs h-4 min-w-4 px-1"
                    >
                      {connecteddevices?.length}
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
                  {incomingrequest?.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-orange-100 text-orange-800 text-xs h-4 min-w-4 px-1"
                    >
                      {incomingrequest.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

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
                      {devices?.length} devices
                    </Badge>
                    {devices?.length > 3 && (
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

                <ScrollArea className="max-h-[280px] sm:max-h-[350px] lg:max-h-[450px] pr-1 overflow-y-auto scrollbar-none">
                  <div className="space-y-2 sm:space-y-3">
                  {loading ? (
  <div className="flex justify-center items-center w-full p-4">
    <span className="text-white font-bold text-lg">Loading devices...</span>
  </div>
) : displayDevices?.length === 0 ? (
  <div className="text-center py-8 sm:py-12">
    <Bell className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
    <h4 className="text-base sm:text-lg font-medium text-foreground mb-2">
      No live connections
    </h4>
    <p className="text-sm sm:text-base text-muted-foreground">
      Live connections will appear here
    </p>
  </div>
) : (
  displayDevices.map((device) => (
    <div
      key={device.id}
      className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl border border-border hover:bg-muted/80 transition-all w-full"
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
        {renderActionButton(device)}
      </div>
    </div>
  ))
)}

                  </div>
                </ScrollArea>
              </TabsContent>

             <TabsContent
                value="connections"
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Active Connections
                  </h3>
                  <Badge variant="outline" className="text-emerald-600 text-xs">
                    {connecteddevices?.length} active
                  </Badge>
                </div>

                {connecteddevices?.length > 0 ? (
                  <ScrollArea className="max-h-[280px] sm:max-h-[350px] lg:max-h-[450px] pr-1 overflow-y-auto scrollbar-none">
                    <div className="space-y-2 sm:space-y-3">
                      {connecteddevices?.map((device) => (
                        <div
                          key={device.id}
                          className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl border border-emerald-200 hover:bg-muted/80 w-full justify-center items-center"
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
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-8 sm:h-9 text-xs sm:text-sm w-40"
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

              <TabsContent value="requests" className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Incoming Requests
                  </h3>
                  <Badge variant="outline" className="text-orange-600 text-xs">
                    {incomingrequest?.length} pending
                  </Badge>
                </div>

             {incomingrequest?.length > 0 ? (
  <ScrollArea className="max-h-[280px] sm:max-h-[350px] lg:max-h-[450px] pr-1 overflow-y-auto scrollbar-none">
    <div className="grid grid-cols-1 gap-3 sm:gap-4">
      {incomingrequest.map((device) => (
        <div
          key={device.id}
          className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl border border-emerald-200 hover:bg-muted/80 w-full justify-between items-center"
        >
          <div className="flex items-start gap-3 w-full flex-1">
            <div className="p-1.5 sm:p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg flex-shrink-0">
              <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
            </div>

     <div className="flex-1 overflow-hidden min-w-0">
  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
    <h4 className="font-semibold text-sm sm:text-lg truncate">
      {device.name || device.senderInfo?.name || "Unknown Requester"}
    </h4>

    {device.status === "online" && (
      <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
    )}

    <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
      Incoming Request
    </Badge>
  </div>

  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
    {device.os && <span>{device.os}</span>}
    {device.hostname && (
      <span className="hidden sm:inline">• {device.hostname}</span>
    )}
    {/* {!device.os && !device.hostname && (
      <span>Offline Device</span>
    )} */}
  </div>

  {(device.senderInfo || device.email) && (
    <div className="mt-2 text-xs sm:text-sm text-foreground">
      <p className="font-medium">
        Request from: {device.senderInfo?.name || device.name || "Unknown"}
      </p>
      <p className="text-muted-foreground">
        {device.senderInfo?.email || device.email || "No email"}
      </p>
    </div>
  )}
</div>

          </div>

          <div className="flex flex-col gap-2 sm:gap-2 sm:items-end w-full sm:w-auto sm:ml-4">
            <Button
              onClick={() => handleAcceptRequest(device.id)}
              className="w-full sm:w-32 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleRejectRequest(device.id,device.email)}
              className="w-full sm:w-32 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm h-8"
            >
              Reject
            </Button>
          </div>
        </div>
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
        
        <div className="h-16 sm:h-8"></div>
      </div>
    </div>
  );
};

export default Dashboard;
