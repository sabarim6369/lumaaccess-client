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
import Sidebar from "@/components/Sidebar";
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
const [sendingRequest, setSendingRequest] = useState<string | null>(null);

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
  console.log("📱 Fetching devices for userId:", userId);
  setuserid(userId)
      try {
        const res = await axios.get( `${Apiurl}/api/device/devices`,{params:{userid:userId},  withCredentials: true
});
      console.log("✅ Device fetch response:", res.data);
      console.log("📊 Total devices:", res.data.list?.length);
      console.log("🟢 Connected devices:", res.data.connectedevice?.length);
      console.log("🔵 Requested devices:", res.data.requesteddevice?.length);
      console.log("🟠 Incoming requests:", res.data.incomingrequest?.length);
      
      setDevices(res.data.list || []);
      setconnecteddevices(res.data.connectedevice || []);
      setrequesteddevice(res.data.requesteddevice || []);
      setincomingrequest(res.data.incomingrequest || []);

      console.log(res.data,"🤣🤣🤣🤣")
      localStorage.setItem("devices", JSON.stringify(res.data.list));
      } catch (error) {
        console.error("❌ Error fetching devices:", error);
        console.error("Error details:", error.response?.data);
      } finally {
        setloading(false);
      }
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
  
  // Set loading state for this specific device
  setSendingRequest(targetUserId);
  
  try {
    const user = JSON.parse(localStorage.getItem("user")); // assuming you store current user
    const currentUserId = user?.userId;

    const res = await axios.post(`${Apiurl}/api/device/send-request`, {
      
      fromUserId: currentUserId,
      toUserId: targetUserId,
     
    });

    // Immediately update local state to show pending status
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.userId === targetUserId 
          ? { ...device, statusType: "requested" }
          : device
      )
    );

    toast({ title: "Request Sent" });
  } catch (err) {
    console.error("Error sending request", err);
    toast({ title: "Failed to send request", variant: "destructive" });
  } finally {
    // Clear loading state
    setSendingRequest(null);
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

  // Immediately update local state
  setincomingrequest(prev => prev.filter(r => r.id !== requesterId));
  
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

    // Immediately update local state
    setincomingrequest(prev => prev.filter(r => r.id !== requestId));
    
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

    navigate("/");
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 mx-auto shadow-xl">
              <Monitor className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Download Remote Agent</h1>
            <p className="text-lg text-slate-600">Install our secure agent to start managing your devices remotely</p>
          </div>

          <Card className="border-2 border-blue-200 shadow-xl">
            <CardContent className="p-8">
              {downloadInitiated ? (
                <div className="space-y-6 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <Download className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-green-700 mb-2">
                        Agent Downloaded Successfully
                      </h2>
                      <p className="text-slate-600">
                        Please <strong className="text-green-700">run the downloaded agent</strong> by double-clicking the <code className="bg-slate-100 px-3 py-1 rounded">launch-luma-agent.bat</code> file
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={skipped}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      "Secure encrypted connections",
                      "Cross-platform compatibility", 
                      "Real-time device monitoring",
                      "Remote desktop control",
                      "File access and management"
                    ].map((text, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                        <span className="text-slate-700">{text}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleDownloadAgent}
                    size="lg"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-xl"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Agent
                  </Button>
                  <div className="space-y-4 text-center">
                    <p className="text-slate-600">
                      Already downloaded? <strong className="text-blue-600">Run the agent</strong> to link your device!
                    </p>
                    <Button
                      variant="ghost"
                      onClick={skipped}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Skip for now
                    </Button>
                    <p className="text-sm text-slate-500">
                      Compatible with Windows, macOS, and Linux
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
const renderActionButton = (device) => {
  if (device.statusType === "allowed" && device.status === "online") {
    return (
      <Button
        onClick={() => handleAccessDevice(device.id)}
        className="w-full sm:w-36 bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        Access <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    );
  }

  if (device.statusType === "requested") {
    return (
      <Button
        variant="outline"
        className="w-full sm:w-36 bg-amber-50 text-amber-700 border-amber-200"
        disabled
      >
        Request Pending
      </Button>
    );
  }

  if (device.statusType === "shared_by_me") {
    return (
      <Button
        variant="outline"
        className="w-full sm:w-36 bg-slate-100 text-slate-600 border-slate-200"
        disabled
      >
        Your Device
      </Button>
    );
  }

  const isLoading = sendingRequest === device.userId;

  return (
    <Button
      onClick={() => handleSendRequest(device.userId)}
      disabled={isLoading}
      className="w-full sm:w-36 bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Sending...
        </span>
      ) : (
        "Send Request"
      )}
    </Button>
  );
};

  const displayDevices = showAllDevices ? devices : devices;

  return (
    <Sidebar>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Device Manager</h1>
          <p className="text-slate-600 mt-1">Manage and access your connected devices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Monitor className="h-6 w-6 text-blue-600" />,
              label: "Total Devices",
              value: devices?.length,
              color: "bg-blue-50 border-blue-200",
              iconBg: "bg-blue-100",
            },
            {
              icon: <Users className="h-6 w-6 text-emerald-600" />,
              label: "Active Connections",
              value: connecteddevices?.length,
              color: "bg-emerald-50 border-emerald-200",
              iconBg: "bg-emerald-100",
            },
            {
              icon: <Bell className="h-6 w-6 text-orange-600" />,
              label: "Pending Requests",
              value: incomingrequest?.length,
              color: "bg-orange-50 border-orange-200",
              iconBg: "bg-orange-100",
            },
          ].map(({ icon, label, value, color, iconBg }, idx) => (
            <Card key={idx} className={`border-2 ${color} shadow-sm`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`${iconBg} p-3 rounded-xl`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">{label}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="devices" className="space-y-6">
              <TabsList className="grid grid-cols-3 gap-2 w-full bg-slate-100 p-1 rounded-xl">
                <TabsTrigger
                  value="devices"
                  className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Monitor className="h-4 w-4" />
                  <span>Devices</span>
                </TabsTrigger>
                <TabsTrigger
                  value="connections"
                  className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Users className="h-4 w-4" />
                  <span>Connected</span>
                  {connecteddevices?.length > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">
                      {connecteddevices?.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="requests"
                  className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Bell className="h-4 w-4" />
                  <span>Requests</span>
                  {incomingrequest?.length > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-700">
                      {incomingrequest.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="devices" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Available Devices</h3>
                  <Badge variant="outline" className="text-slate-600">
                    {devices?.length} devices
                  </Badge>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-600">Loading devices...</p>
                  </div>
                ) : displayDevices?.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <Monitor className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No devices found</h4>
                    <p className="text-slate-600">Devices will appear here when connected</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayDevices.map((device) => (
                      <div
                        key={device.id}
                        className="flex items-center gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <Monitor className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900 truncate">{device.name}</h4>
                            {getStatusIcon(device.status)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="bg-slate-100 px-2 py-1 rounded">{device.os}</span>
                            {device.hostname && (
                              <span className="truncate">@{device.hostname}</span>
                            )}
                          </div>
                        </div>
                        {renderActionButton(device)}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="connections" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Active Connections</h3>
                  <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                    {connecteddevices?.length} active
                  </Badge>
                </div>

                {connecteddevices?.length > 0 ? (
                  <div className="space-y-3">
                    {connecteddevices.map((device) => (
                      <div
                        key={device.id}
                        className="flex items-center gap-4 p-4 bg-white border-2 border-emerald-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all"
                      >
                        <div className="p-3 bg-emerald-100 rounded-xl">
                          <Monitor className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900 truncate">{device.name}</h4>
                            <Wifi className="h-4 w-4 text-emerald-600" />
                            <Badge className="bg-emerald-100 text-emerald-700 border-0">Connected</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="bg-emerald-50 px-2 py-1 rounded">{device.os}</span>
                            {device.hostname && <span>@{device.hostname}</span>}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAccessDevice(device.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Access <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No Active Connections</h4>
                    <p className="text-slate-600">Connected devices will appear here</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Incoming Requests</h3>
                  <Badge variant="outline" className="text-orange-700 bg-orange-50 border-orange-200">
                    {incomingrequest?.length} pending
                  </Badge>
                </div>

                {incomingrequest?.length > 0 ? (
                  <div className="space-y-3">
                    {incomingrequest.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center gap-4 p-4 bg-white border-2 border-orange-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all"
                      >
                        <div className="p-3 bg-orange-100 rounded-xl">
                          <Monitor className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900 truncate">{request.name || "Unknown User"}</h4>
                            <Badge className="bg-orange-100 text-orange-700 border-0">Pending</Badge>
                          </div>
                          <p className="text-sm text-slate-600 truncate">{request.email || "No email provided"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            size="sm"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleRejectRequest(request.id, request.email)}
                            variant="destructive"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No Pending Requests</h4>
                    <p className="text-slate-600">Access requests will appear here</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default Dashboard;