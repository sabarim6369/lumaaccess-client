# LumaAccess Connected Device Hub

A centralized web dashboard for monitoring and controlling remote devices in real-time through the LumaAccess ecosystem.

## 🎯 Overview

The Connected Device Hub is the frontend web application that provides a user-friendly interface for managing multiple remote devices. It displays real-time screen and camera streams, executes remote commands, and monitors device status — all through an intuitive dashboard.

## ✨ Features

### 📺 Real-Time Monitoring
- **Live Screen Streaming**: View device screens in real-time with automatic refresh
- **Camera Feed**: Monitor device camera feeds remotely
- **Multi-Device Dashboard**: Monitor multiple devices simultaneously
- **Auto-Refresh**: Latest frames updated continuously from the backend

### 🎮 Remote Control
- **System Commands**: 
  - Shutdown/Restart device
  - Lock/Unlock screen
  - Take screenshot on-demand
  - Sleep/Hibernate
- **File Management**: Access and manage files remotely (planned)
- **Terminal Access**: Execute commands remotely (planned)
- **Audio Control**: Manage system audio (planned)

### 📊 Device Management
- **Device List**: View all registered devices with status indicators
- **Connection Status**: Real-time online/offline status
- **Device Info**: OS type, hostname, user info, last seen timestamp
- **Search & Filter**: Quickly find specific devices

### 🔒 Security
- **User Authentication**: Secure login system
- **Device Authorization**: Only authorized users can control devices
- **Encrypted Communication**: Secure WebSocket connections
- **Session Management**: JWT-based authentication

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Connected Device Hub (React)      │
│   ┌─────────────────────────────┐   │
│   │  Device List Component      │   │
│   │  Screen Viewer Component    │   │
│   │  Camera Viewer Component    │   │
│   │  Command Panel Component    │   │
│   └─────────────────────────────┘   │
└─────────────────┬───────────────────┘
                  │ HTTP/WebSocket
                  ▼
┌─────────────────────────────────────┐
│   Backend Server (Node.js)          │
│   - REST API Endpoints              │
│   - WebSocket Management            │
│   - Device Registry                 │
└─────────────────┬───────────────────┘
                  │ WebSocket
                  ▼
┌─────────────────────────────────────┐
│   Electron Agents (Devices)         │
│   - Screen Capture                  │
│   - Camera Capture                  │
│   - Command Execution               │
└─────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running Backend Server
- At least one Electron Agent connected

### Installation

```bash
# Navigate to the connected-device-hub directory
cd connected-device-hub

# Install dependencies
npm install
```

### Configuration

The API URL is configured in `src/api.jsx`:

```jsx
// Development
const Apiurl = "http://localhost:8081"

// Production
// const Apiurl = "https://lumaaccess-server.onrender.com"
```

**Important**: Update the API URL based on your environment before building for production.

### Development

```bash
# Start the development server
npm start

# The application will open at http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# The build files will be in the 'build' directory
```

## 📱 Usage

### 1. Login
- Navigate to the login page
- Enter your credentials
- You'll be redirected to the dashboard upon successful authentication

### 2. View Devices
- All registered devices appear in the device list
- Green indicator = Online
- Red indicator = Offline
- View device details: OS, hostname, last seen time

### 3. Monitor Device Screen
- Click on a device to view its screen
- Screen updates automatically in real-time
- Images are Base64-encoded and displayed instantly

### 4. View Camera Feed
- Switch to camera view
- Real-time camera feed from the selected device
- Useful for security monitoring or remote assistance

### 5. Execute Commands
- Select a device
- Choose a command from the control panel:
  - **Shutdown**: Turn off the device
  - **Restart**: Reboot the device
  - **Lock Screen**: Lock the device screen
  - **Screenshot**: Capture and save current screen
  - More commands available based on agent capabilities

## 🎨 UI Components

### Device Card
```jsx
<DeviceCard
  deviceId={device.id}
  deviceName={device.hostname}
  status={device.status}
  os={device.os}
  lastSeen={device.lastSeen}
  onSelect={handleDeviceSelect}
/>
```

### Screen Viewer
```jsx
<ScreenViewer
  deviceId={selectedDevice}
  apiUrl={Apiurl}
  refreshInterval={1000}
/>
```

### Command Panel
```jsx
<CommandPanel
  deviceId={selectedDevice}
  onCommandSend={handleCommand}
  availableCommands={commands}
/>
```

## 📂 Project Structure

```
connected-device-hub/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── DeviceList.jsx
│   │   ├── ScreenViewer.jsx
│   │   ├── CameraViewer.jsx
│   │   ├── CommandPanel.jsx
│   │   └── DeviceCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── DeviceDetail.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── helpers.js
│   ├── api.jsx           # API configuration
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## 🔌 API Integration

### Fetch Devices
```javascript
import Apiurl from './api.jsx';

fetch(`${Apiurl}/api/devices`)
  .then(res => res.json())
  .then(devices => console.log(devices));
```

### Get Device Screen
```javascript
fetch(`${Apiurl}/api/devices/${deviceId}/screen`)
  .then(res => res.json())
  .then(data => {
    const imageUrl = `data:image/png;base64,${data.screen}`;
    // Display image
  });
```

### Send Command
```javascript
fetch(`${Apiurl}/api/devices/${deviceId}/command`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ command: 'shutdown' })
});
```

## 🔮 Future Enhancements

### 🎥 WebRTC Integration (In Development)
- Low-latency real-time streaming
- Peer-to-peer connections
- Reduced server load
- Better video quality

### 📁 File Management
- Browse remote file systems
- Upload/download files
- File search and filtering

### 💻 Terminal Access
- Remote command-line interface
- Execute shell commands
- View command output in real-time

### 🎛️ Audio Control
- Volume adjustment
- Mute/unmute
- Audio device selection

### 📊 Analytics Dashboard
- Device usage statistics
- Connection history
- Command execution logs
- Performance metrics

## 🛠️ Troubleshooting

### Cannot Connect to Backend
- Verify backend server is running
- Check API URL in `src/api.jsx`
- Ensure CORS is properly configured on backend

### Devices Not Showing
- Confirm at least one Electron Agent is connected
- Check backend server logs
- Verify device registration is successful

### Screen/Camera Not Updating
- Check WebSocket connection status
- Verify agent is sending frames
- Check browser console for errors

### Commands Not Working
- Ensure device is online
- Check command permissions on agent
- Review backend server logs

## 🤝 Integration with Other Modules

### With Backend Server
- REST API for device management
- WebSocket for real-time updates
- Authentication and authorization

### With Electron Agent
- Receives screen/camera frames
- Sends remote commands
- Monitors connection status

## 📄 License

Part of the LumaAccess project.

## 🙏 Acknowledgments

Built with React, designed for seamless remote device monitoring and control.

---

**Note**: This is the frontend dashboard component of the LumaAccess ecosystem. Ensure both the Backend Server and at least one Electron Agent are running for full functionality.
