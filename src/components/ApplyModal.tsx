'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { getAppContract, parseCUSD, connectWallet } from '@/lib/web3';

interface ApplyModalProps {
  onClose: () => void;
  signer: ethers.Signer | null;
  onConnect: () => void;
}

export default function ApplyModal({ onClose, signer, onConnect }: ApplyModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    business: '',
    story: '',
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit() {
    if (!signer) {
      alert('Please connect wallet first');
      return;
    }

    // Validate
    if (!form.name || !form.email || !form.location || !form.business || !form.story || 
!form.amount) {
      alert('Please fill all required fields');
      return;
    }

    const amount = parseFloat(form.amount);
    if (amount < 50 || amount > 10000) {
      alert('Amount must be between $50 and $10,000');
      return;
    }

    setLoading(true);
    try {
      const contract = getAppContract(signer);
      
      // Step 1: Basic info
      const tx1 = await contract.apply1(form.name, form.email, form.phone, form.location);
      await tx1.wait();
      
      // Step 2: Business details
      const amountWei = parseCUSD(form.amount);
      const tx2 = await contract.apply2(form.business, form.story, amountWei);
      await tx2.wait();

      // Send email notification (via Web3Forms or similar)
      await sendEmailNotification(form);

      alert('🎉 Application submitted successfully! We will review it shortly.');
      onClose();
    } catch (error: any) {
      console.error('Application error:', error);
      alert(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  }

  async function sendEmailNotification(data: typeof form) {
    try {
      // Using Web3Forms (free service)
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_KEY', // Get free key at web3forms.com
          subject: `New CeloQuest Loan Application: ${data.name}`,
          from_name: 'CeloQuest',
          to: 'bamzzstudio@gmail.com',
          message: `
New Loan Application:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Location: ${data.location}
Business: ${data.business}
Amount Requested: $${data.amount}

Story:
${data.story}
          `,
        }),
      });
    } catch (e) {
      console.error('Email notification failed:', e);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center 
justify-center z-50 p-4 overflow-y-auto">
      <div className="glass rounded-3xl p-8 max-w-lg w-full my-8">
        <h2 className="text-2xl font-bold text-white mb-2">�� Apply for a Loan</h2>
        <p className="text-white/70 mb-6">Fill out the form to request funding for your 
business</p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-yellow-300' : 
'bg-white/20'}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-yellow-300' : 
'bg-white/20'}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Full Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/10 text-white border 
border-white/20 focus:border-yellow-300 outline-none"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/10 text-white border 
border-white/20 focus:border-yellow-300 outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Phone (WhatsApp 
preferred)</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/10 text-white border 
border-white/20 focus:border-yellow-300 outline-none"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/10 text-white border 
border-white/20 focus:border-yellow-300 outline-none"
                placeholder="City, Country"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold 
hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 btn-primary rounded-xl"
                disabled={!form.name || !form.email || !form.location}
              >
                Next →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Business Type *</label>
              <input
                name="business"
                value={form.business}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/10 text-white border 
border-white/20 focus:border-yellow-300 outline-none"
                placeholder="e.g., Tailoring, Farming, Tech Repair"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Amount Needed (USD) 
*</label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/10 text-white border 
border-white/20 focus:border-yellow-300 outline-none"
                placeholder="50 - 10000"
                min="50"
                max="10000"
              />
              <p className="text-white/50 text-xs mt-1">Min: $50, Max: $10,000</p>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Your Story *</label>
              <textarea
                name="story"
                value={form.story}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/10 text-white border 
border-white/20 focus:border-yellow-300 outline-none h-32 resize-none"
                placeholder="Tell us about your business and how the loan will help you..."
              />
            </div>

            <div className="bg-yellow-300/10 border border-yellow-300/30 rounded-xl p-4 
text-sm">
              <p className="text-yellow-300 font-semibold mb-1">⚡ On-Chain Application</p>
              <p className="text-white/70">
                Your application will be stored on the Celo blockchain. 
                You'll pay a small gas fee (~$0.01) to submit.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold 
hover:bg-white/20"
              >
                ← Back
              </button>
              {signer ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.business || !form.story || !form.amount}
                  className="flex-1 py-3 btn-primary rounded-xl disabled:opacity-50"
                >
                  {loading ? '⏳ Submitting...' : '✅ Submit Application'}
                </button>
              ) : (
                <button
                  onClick={onConnect}
                  className="flex-1 py-3 btn-primary rounded-xl"
                >
                  🔗 Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
