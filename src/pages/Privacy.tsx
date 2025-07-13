import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">Privacy Policy</h1>

        <p className="text-slate-700 mb-6">
          Your privacy is important to us. This Privacy Policy outlines how <strong>Remote Access Manager</strong> collects, uses, and protects your information when you use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">1. Information We Collect</h2>
        <p className="text-slate-700">
          We may collect information such as your name, email address, device data, and activity logs when you register, interact with our services, or use remote access features.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">2. How We Use Information</h2>
        <p className="text-slate-700">
          We use the collected data to provide core functionality, improve performance, enhance security, and personalize your experience on our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">3. Data Security</h2>
        <p className="text-slate-700">
          Your data is encrypted and stored securely. We implement industry-standard security measures to protect your information against unauthorized access.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">4. Sharing of Information</h2>
        <p className="text-slate-700">
          We do not sell or rent your personal information. We may share data only with trusted service providers under strict confidentiality agreements, or as required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">5. Cookies</h2>
        <p className="text-slate-700">
          We use cookies to maintain user sessions, enhance user experience, and track analytics. You can control cookies through your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">6. Data Retention</h2>
        <p className="text-slate-700">
          We retain your data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">7. Your Rights</h2>
        <p className="text-slate-700">
          You may request access, correction, or deletion of your personal data by contacting us. We respond to requests in accordance with applicable privacy laws.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-600">8. Contact Us</h2>
        <p className="text-slate-700">
          For any questions or concerns regarding this policy, please contact us at{' '}
          <a href="mailto:privacy@remoteaccess.com" className="text-blue-600 underline">
            sabarim6369@gmail.com
          </a>.
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

export default Privacy;
