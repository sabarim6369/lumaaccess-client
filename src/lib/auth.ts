
// Simple auth utilities - in production, integrate with a real backend
export interface User {
  id: string;
  email: string;
  name?: string;
}


export interface Device {
  id: string;
  name: string;
  hostname?: string;
  os: string;
  status: 'online' | 'offline' | 'pending';
  lastSeen?: string;
  statusType?: 'allowed' | 'requested_by_me' | 'shared_by_me'; // Optional, for more detailed status
}

export interface AccessRequest {
  id: string;
  fromUserId: string;
  fromUserEmail: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe'
};

export const mockDevices: Device[] = [
  {
    id: 'device1',
    name: 'MacBook Pro',
    hostname: 'Johns-MacBook.local',
    os: 'macOS Sonoma',
    status: 'online',
    lastSeen: '2 minutes ago'
  },
  {
    id: 'device2',
    name: 'Windows Desktop',
    hostname: 'PC-WORKSTATION',
    os: 'Windows 11',
    status: 'offline',
    lastSeen: '1 hour ago'
  },
  {
    id: 'device3',
    name: 'Ubuntu Server',
    hostname: 'ubuntu-server',
    os: 'Ubuntu 22.04',
    status: 'pending',
    lastSeen: '5 minutes ago'
  },
];

export const mockRequests: AccessRequest[] = [
  {
    id: 'req1',
    fromUserId: '2',
    fromUserEmail: 'colleague@company.com',
    deviceId: 'device1',
    deviceName: 'MacBook Pro',
    timestamp: '5 minutes ago',
    status: 'pending'
  },
  {
    id: 'req2',
    fromUserId: '3',
    fromUserEmail: 'support@company.com',
    deviceId: 'device2',
    deviceName: 'Windows Desktop',
    timestamp: '15 minutes ago',
    status: 'pending'
  }
];

export const login = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'user@example.com' && password === 'password') {
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  }
  
  throw new Error('Invalid credentials');
};

export const signup = async (email: string, password: string, confirmPassword: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  
  const newUser = { ...mockUser, email };
  localStorage.setItem('user', JSON.stringify(newUser));
  return newUser;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// export const hasDownloadedAgent = (): boolean => {
//   return localStorage.getItem('agentDownloaded') === 'true';
// };

export const hasDownloadedAgent = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5967/ping', { method: 'GET' });
    console.log('Agent Ping Response:', response);
    if (!response.ok) return false;
    const data = await response.json();
    console.log('Agent Ping Response:', data);
    return true;
  } catch (error) {
    console.log('Agent not running or blocked:', error);
    return false;
  }
};


export const setAgentDownloaded = () => {
  localStorage.setItem('agentDownloaded', 'true');
};
