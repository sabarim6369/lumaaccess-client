import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Monitor,
  Shield,
  Zap,
  Users,
  Lock,
  Smartphone,
  ArrowRight,
  Check,
  ChevronRight,
  Cpu,
  Wifi,
  Globe,
  Clock,
  BarChart3,
  Terminal,
  Camera,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "Remote Desktop Access",
      description: "Access and control your devices from anywhere in the world with real-time screen sharing and full keyboard/mouse control."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "End-to-End Encryption",
      description: "All connections are secured with military-grade encryption to ensure your data and devices remain completely private."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed with low-latency connections, making remote work feel like you're right there."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Share device access with team members and manage permissions with granular control."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Cross-Platform",
      description: "Works seamlessly on Windows, macOS, Linux, and mobile devices for total flexibility."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure Authentication",
      description: "Multi-factor authentication and session management to keep your account safe."
    }
  ];

  const capabilities = [
    { icon: <Terminal className="h-5 w-5" />, text: "Remote terminal access" },
    { icon: <Camera className="h-5 w-5" />, text: "Camera streaming" },
    { icon: <FileText className="h-5 w-5" />, text: "File management" },
    { icon: <SettingsIcon className="h-5 w-5" />, text: "System controls" },
    { icon: <Wifi className="h-5 w-5" />, text: "Real-time monitoring" },
    { icon: <Globe className="h-5 w-5" />, text: "Global access" }
  ];

  const useCases = [
    {
      title: "Remote Work",
      description: "Access your office computer from home or while traveling with full functionality.",
      icon: <Globe className="h-8 w-8" />
    },
    {
      title: "IT Support",
      description: "Provide instant technical support by remotely accessing client devices securely.",
      icon: <Users className="h-8 w-8" />
    },
    {
      title: "Device Management",
      description: "Monitor and manage multiple devices from a single dashboard with ease.",
      icon: <Monitor className="h-8 w-8" />
    },
    {
      title: "Personal Access",
      description: "Access your home computer from anywhere to check files or run applications.",
      icon: <Smartphone className="h-8 w-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">LumaAccess</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started Free
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>Secure Remote Access Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Access Your Devices
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                From Anywhere
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Secure, fast, and reliable remote desktop access. Control your computers, 
              manage files, and collaborate with your team from anywhere in the world.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-lg font-semibold shadow-xl shadow-blue-500/30">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 hover:border-blue-300">
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need for Remote Access
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to make remote work seamless and secure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Powerful Capabilities at Your Fingertips
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                From terminal access to file management, control every aspect of your remote devices with precision.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {capability.icon}
                    </div>
                    <span className="text-slate-700 font-medium">{capability.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <Cpu className="h-8 w-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">99.9%</div>
                    <div className="text-blue-100 text-sm">Uptime</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <Clock className="h-8 w-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">&lt;50ms</div>
                    <div className="text-blue-100 text-sm">Latency</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <Shield className="h-8 w-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">256-bit</div>
                    <div className="text-blue-100 text-sm">Encryption</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <Globe className="h-8 w-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">50+</div>
                    <div className="text-blue-100 text-sm">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Perfect for Every Use Case
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Whether you're working remotely or managing a team, LumaAccess adapts to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {useCase.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{useCase.title}</h3>
                <p className="text-slate-600 text-sm">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Remote Work?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust LumaAccess for secure remote desktop access
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-2 border-white/30 hover:bg-white/10 h-14 px-8 text-lg font-semibold">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Monitor className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-semibold">LumaAccess</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-white transition-colors">Support</Link>
            </div>
            <div className="text-sm">
              © 2024 LumaAccess. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
