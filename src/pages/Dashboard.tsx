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
console.log("userid consoled",userId)
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
  console.log("consoleing target user id", targetUserId);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.2),rgba(255,255,255,0))]" />
        
        <div className="relative container mx-auto px-4 py-8 max-w-full sm:max-w-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                Welcome, {user?.name || user?.email}
              </h1>
              <p className="text-slate-300 text-lg font-medium">
                Remote Access Manager Dashboard
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button
                onClick={() => navigate("/settings")}
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Settings className="h-4 w-4" />
                <span>My Connections</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-red-500/30 text-white shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          <div className="max-w-full mx-auto">
            <Card className="shadow-2xl border-white/20 bg-white/10 backdrop-blur-2xl w-full overflow-hidden">
              <CardHeader className="text-center pb-6 px-4 sm:px-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mb-4 mx-auto shadow-2xl shadow-blue-500/50 animate-pulse">
                  <Download className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">
                  Download Remote Agent
                </CardTitle>
                <CardDescription className="text-lg text-slate-300 px-2 sm:px-0 mt-2">
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
        className="w-full sm:w-36 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white h-10 sm:h-11 text-sm sm:text-base font-bold shadow-xl shadow-emerald-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
        Access <ChevronRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    );
  }

  if (device.statusType === "requested") {
    return (
      <Button
        variant="outline"
        className="w-full sm:w-36 h-10 sm:h-11 text-sm sm:text-base font-semibold bg-yellow-500/20 border-yellow-500/50 text-yellow-300 cursor-not-allowed"
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
        className="w-full sm:w-36 h-10 sm:h-11 text-sm sm:text-base font-semibold bg-slate-700/50 text-slate-300 cursor-not-allowed"
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
      className="w-full sm:w-36 h-10 sm:h-11 text-sm sm:text-base font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
    >
      Send Request
    </Button>
  );
};

  const displayDevices = showAllDevices ? devices : devices;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-auto relative">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.2),rgba(255,255,255,0))]" />
      
      <div className="relative container mx-auto px-4 py-6 sm:py-10 max-w-full sm:max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Device Manager
            </h1>
            <p className="text-slate-300 text-lg font-medium">
              Manage and access your connected devices with ease
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Settings className="h-4 w-4" />
              <span>My Connections</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-red-500/30 text-white shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Glassmorphism Stats Cards */}
          {[
            {
              icon: (
                <Monitor className="h-7 w-7 text-blue-400" />
              ),
              label: "Total Devices",
              value: devices?.length,
              gradient: "from-blue-500/20 to-cyan-500/20",
              iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
              glowColor: "shadow-blue-500/50",
            },
            {
              icon: (
                <Users className="h-7 w-7 text-emerald-400" />
              ),
              label: "Active Connections",
              value: connecteddevices?.length,
              gradient: "from-emerald-500/20 to-green-500/20",
              iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
              glowColor: "shadow-emerald-500/50",
            },
            {
              icon: (
                <Bell className="h-7 w-7 text-orange-400" />
              ),
              label: "Pending Requests",
              value: incomingrequest?.length,
              gradient: "from-orange-500/20 to-pink-500/20",
              iconBg: "bg-gradient-to-br from-orange-500 to-pink-500",
              glowColor: "shadow-orange-500/50",
            },
          ]?.map(({ icon, label, value, gradient, iconBg, glowColor }, idx) => (
            <Card key={idx} className={`bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl ${glowColor} hover:shadow-3xl hover:scale-105 transition-all duration-300 w-full overflow-hidden group`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-6 relative">
                <div className="flex items-center space-x-5">
                  <div className={`${iconBg} p-4 rounded-2xl shadow-xl ${glowColor} group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-4xl font-black text-white mt-1 drop-shadow-lg">
                      {value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl w-full overflow-hidden rounded-2xl mb-4 sm:mb-6">
          <CardContent className="px-3 py-4 sm:px-6 sm:py-8">
            <Tabs defaultValue="devices" className="space-y-4 sm:space-y-6">
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full h-auto bg-slate-900/50 p-2 rounded-xl backdrop-blur-xl border border-white/10">
                <TabsTrigger
                  value="devices"
                  className="flex items-center justify-center space-x-2 text-sm sm:text-base font-semibold whitespace-nowrap py-3 px-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/50 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">Available Devices</span>
                  <span className="xs:hidden">Devices</span>
                </TabsTrigger>
                <TabsTrigger
                  value="connections"
                  className="flex items-center justify-center space-x-2 text-sm sm:text-base font-semibold whitespace-nowrap py-3 px-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-emerald-500/50 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">Connected Devices</span>
                  <span className="xs:hidden">Active</span>
                  {connecteddevices?.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-white/20 text-white text-xs h-5 min-w-5 px-2 font-bold"
                    >
                      {connecteddevices?.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="requests"
                  className="flex items-center justify-center space-x-2 text-sm sm:text-base font-semibold whitespace-nowrap py-3 px-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/50 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">Incoming Requests</span>
                  <span className="xs:hidden">Requests</span>
                  {incomingrequest?.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-orange-200 text-orange-900 text-xs h-5 min-w-5 px-2 font-bold animate-pulse"
                    >
                      {incomingrequest.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="devices" className="space-y-4 sm:space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                    Available Devices
                  </h3>
                  <div className="flex items-center flex-wrap gap-3">
                    <Badge
                      variant="outline"
                      className="text-slate-300 border-white/30 bg-white/10 backdrop-blur-xl text-sm font-semibold px-3 py-1"
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
                  <div className="space-y-3 sm:space-y-4">
                  {loading ? (
  <div className="flex flex-col justify-center items-center w-full py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
    <div className="inline-flex p-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mb-4 shadow-2xl animate-pulse">
      <Monitor className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
    </div>
    <span className="text-white font-bold text-xl sm:text-2xl mb-2">Loading devices...</span>
    <p className="text-slate-400 font-medium">Please wait while we fetch your devices</p>
  </div>
) : displayDevices?.length === 0 ? (
  <div className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
    <div className="inline-flex p-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl mb-4 shadow-2xl">
      <Monitor className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400" />
    </div>
    <h4 className="text-xl sm:text-2xl font-bold text-white mb-3">
      No live connections
    </h4>
    <p className="text-base sm:text-lg text-slate-400 font-medium">
      Live connections will appear here
    </p>
  </div>
) : (
  displayDevices.map((device) => (
    <div
      key={device.id}
      className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 w-full group"
    >
      <div className="flex items-start gap-4 w-full flex-1">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex-shrink-0 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
          <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div className="flex-1 overflow-hidden min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="font-bold text-base sm:text-xl text-white truncate drop-shadow-lg">
              {device.name}
            </h4>
            {getStatusIcon(device.status)}
            {getStatusBadge(device.status)}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-slate-300 font-medium">
            <span className="bg-slate-700/50 px-2 py-1 rounded-md">{device.os}</span>
            {device.hostname && (
              <span className="hidden sm:inline bg-slate-700/50 px-2 py-1 rounded-md">@ {device.hostname}</span>
            )}
            {device.lastSeen && (
              <span className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-md">
                <Clock className="h-4 w-4" />
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
                className="space-y-4 sm:space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                    Active Connections
                  </h3>
                  <Badge variant="outline" className="text-emerald-300 border-emerald-500/50 bg-emerald-500/20 backdrop-blur-xl text-sm font-bold px-3 py-1">
                    {connecteddevices?.length} active
                  </Badge>
                </div>

                {connecteddevices?.length > 0 ? (
                  <ScrollArea className="max-h-[280px] sm:max-h-[350px] lg:max-h-[450px] pr-1 overflow-y-auto scrollbar-none">
                    <div className="space-y-3 sm:space-y-4">
                      {connecteddevices?.map((device) => (
                        <div
                          key={device.id}
                          className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-emerald-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300 w-full group"
                        >
                          <div className="flex items-start gap-4 w-full">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex-shrink-0 shadow-xl shadow-emerald-500/50 group-hover:scale-110 transition-transform duration-300">
                              <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div className="flex-1 overflow-hidden min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-bold text-base sm:text-xl truncate text-white drop-shadow-lg">
                                  {device.name}
                                </h4>
                                <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 animate-pulse" />
                                <Badge className="bg-emerald-400 text-emerald-950 border-0 font-bold text-xs px-3 py-1 shadow-lg shadow-emerald-400/50">
                                  Connected
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-slate-300 font-medium">
                                <span className="bg-emerald-900/30 px-2 py-1 rounded-md">{device.os}</span>
                                {device.hostname && (
                                  <span className="hidden sm:inline bg-emerald-900/30 px-2 py-1 rounded-md">
                                    @ {device.hostname}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAccessDevice(device.id)}
                            className="w-full sm:w-40 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white h-10 sm:h-11 text-sm sm:text-base font-bold shadow-xl shadow-emerald-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                          >
                            Access{" "}
                            <ChevronRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                    <div className="inline-flex p-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl mb-4 shadow-2xl">
                      <Users className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400" />
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      No Active Connections
                    </h4>
                    <p className="text-base sm:text-lg text-slate-400 font-medium">
                      Connect to devices to see them here
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="requests" className="space-y-4 sm:space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                    Incoming Requests
                  </h3>
                  <Badge variant="outline" className="text-orange-300 border-orange-500/50 bg-orange-500/20 backdrop-blur-xl text-sm font-bold px-3 py-1 animate-pulse">
                    {incomingrequest?.length} pending
                  </Badge>
                </div>

             {incomingrequest?.length > 0 ? (
  <ScrollArea className="max-h-[280px] sm:max-h-[350px] lg:max-h-[450px] pr-1 overflow-y-auto scrollbar-none">
    <div className="grid grid-cols-1 gap-3 sm:gap-4">
      {incomingrequest.map((device) => (
        <div
          key={device.id}
          className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-orange-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-400/50 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-300 w-full group"
        >
          <div className="flex items-start gap-4 w-full flex-1">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex-shrink-0 shadow-xl shadow-orange-500/50 group-hover:scale-110 transition-transform duration-300">
              <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>

     <div className="flex-1 overflow-hidden min-w-0">
  <div className="flex flex-wrap items-center gap-2 mb-2">
    <h4 className="font-bold text-base sm:text-xl truncate text-white drop-shadow-lg">
      {device.name || device.senderInfo?.name || "Unknown Requester"}
    </h4>

    {device.status === "online" && (
      <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 animate-pulse" />
    )}

    <Badge className="bg-yellow-400 text-yellow-950 border-0 font-bold text-xs px-3 py-1 shadow-lg shadow-yellow-400/50 animate-pulse">
      Incoming Request
    </Badge>
  </div>

  <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-slate-300 font-medium">
    {device.os && <span className="bg-orange-900/30 px-2 py-1 rounded-md">{device.os}</span>}
    {device.hostname && (
      <span className="hidden sm:inline bg-orange-900/30 px-2 py-1 rounded-md">@ {device.hostname}</span>
    )}
  </div>

  {(device.senderInfo || device.email) && (
    <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
      <p className="font-bold text-white text-sm sm:text-base">
        Request from: {device.senderInfo?.name || device.name || "Unknown"}
      </p>
      <p className="text-slate-400 text-xs sm:text-sm mt-1">
        {device.senderInfo?.email || device.email || "No email"}
      </p>
    </div>
  )}
</div>

          </div>

          <div className="flex flex-col gap-3 sm:gap-3 sm:items-end w-full sm:w-auto sm:ml-4">
            <Button
              onClick={() => handleAcceptRequest(device.id)}
              className="w-full sm:w-36 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-sm sm:text-base font-bold h-10 shadow-xl shadow-emerald-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleRejectRequest(device.id,device.email)}
              className="w-full sm:w-36 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm sm:text-base font-bold h-10 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
) : (
                  <div className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                    <div className="inline-flex p-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl mb-4 shadow-2xl">
                      <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400" />
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      No Pending Requests
                    </h4>
                    <p className="text-base sm:text-lg text-slate-400 font-medium">
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