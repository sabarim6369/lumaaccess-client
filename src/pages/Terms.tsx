import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">Terms of Service</h1>

        <p className="text-slate-700 mb-6">
          Welcome to <strong>Remote Access Manager</strong>. These Terms of Service govern your use of our platform, including the website and any related software, applications, or services we offer. By accessing or using our services, you agree to these terms.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">1. Acceptance of Terms</h2>
        <p className="text-slate-700">
          By using Remote Access Manager, you agree to comply with these terms and any applicable laws and regulations. If you do not agree, please refrain from using our services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">2. Description of Service</h2>
        <p className="text-slate-700">
          Remote Access Manager allows users to securely monitor, control, and manage their devices remotely. Our platform includes features such as real-time access requests, device status monitoring, and administrative control tools.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">3. User Responsibilities</h2>
        <p className="text-slate-700">
          You agree to use our services responsibly. You must not misuse or attempt to gain unauthorized access to any part of the system. You are responsible for maintaining the confidentiality of your credentials.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">4. Account and Security</h2>
        <p className="text-slate-700">
          You must provide accurate and complete information when creating an account. You are responsible for all activities under your account. Notify us immediately of any breach or unauthorized use.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">5. Privacy Policy</h2>
        <p className="text-slate-700">
          We value your privacy. All data is handled in accordance with our <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>. We do not share your data with third parties without your consent, unless legally required.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">6. Modifications to Service</h2>
        <p className="text-slate-700">
          We reserve the right to modify or discontinue any part of our services at any time with or without notice.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">7. Termination</h2>
        <p className="text-slate-700">
          We may suspend or terminate your account if you violate these terms. You may also discontinue use of our services at any time.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">8. Contact Information</h2>
        <p className="text-slate-700">
          For any questions or concerns about these terms, please contact us at <a href="mailto:support@remoteaccess.com" className="text-blue-600 underline">sabarim6369@gmail.com</a>.
        </p>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
