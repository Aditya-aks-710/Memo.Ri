import React, { useState } from "react";
import * as Icon from '../icons';
import { SigninBox } from './signin';
import { SignUpBox } from './signup'; 

interface HeaderProps {
  onSigninClick: () => void;
  onSignupClick: () => void;
}

const Header = ({ onSigninClick, onSignupClick }: HeaderProps) => (
  <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-40 border-b border-gray-200">
    <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
      <button
        type="button"
        className="flex items-center gap-2"
        aria-label="Go to home"
      >
        <div className='flex items-center bg-[#438989] pl-2 py-1 pr-3 rounded-md gap-1'>
          <Icon.LogoIcon className='w-8 text-white' />
          <div className='text-xl text-white font-bold'>
            Memo.<span className='text-black'>Ri</span>
          </div>
        </div>
      </button>

      <div className="hidden sm:flex items-center gap-3">
        <button
          type="button"
          onClick={onSigninClick}
          className="text-gray-600 hover:text-[#438989] font-medium transition-colors"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={onSignupClick}
          className="bg-[#438989] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#366d6d] transition-all duration-200"
        >
          Sign Up
        </button>
      </div>

      <div className="sm:hidden flex items-center gap-2">
        <button
          type="button"
          onClick={onSigninClick}
          className="text-gray-600 px-2 py-1"
          aria-label="Sign in"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={onSignupClick}
          className="bg-[#438989] text-white px-3 py-1 rounded"
          aria-label="Sign up"
        >
          Sign Up
        </button>
      </div>
    </div>
  </header>
);

interface HeroProps {
  onGetStartedClick: () => void; // opens signup
  onSigninClick: () => void;     // opens signin
}

const HeroSection = ({ onGetStartedClick, onSigninClick }: HeroProps) => (
  <section className="bg-gray-50 pt-32 pb-20">
    <div className="container mx-auto px-4 sm:px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
        Your Personal
        <br />
        <span className="text-[#438989]">AI-Powered Archive</span>
      </h1>
      <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
        Stop losing valuable links. Save any resource and find it later by asking simple questions—even if you've forgotten the details.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onGetStartedClick}
          className="bg-[#438989] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#366d6d] transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          Get Started
        </button>
        <button
          onClick={onSigninClick}
          className="bg-white text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  </section>
);

// --- Other sections unchanged but CTA Sign Up link now opens signup modal ---
const HowItWorksSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">From Forgotten Link to Instant Insight</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="text-center p-4 transition-transform duration-300 hover:scale-105">
          <div className="bg-[#e0f2f1] w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-[#438989]">1</div>
          <h3 className="mt-4 text-xl font-semibold">Save Anything</h3>
          <p className="mt-2 text-gray-600">Paste any link—articles, videos, or documents. Memo.Ri archives and understands the content.</p>
        </div>
        <div className="text-center p-4 transition-transform duration-300 hover:scale-105">
          <div className="bg-[#e0f2f1] w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-[#438989]">2</div>
          <h3 className="mt-4 text-xl font-semibold">Forget Freely</h3>
          <p className="mt-2 text-gray-600">No need for folders or tags. Your resources are safely stored and indexed for you.</p>
        </div>
        <div className="text-center p-4 transition-transform duration-300 hover:scale-105">
          <div className="bg-[#e0f2f1] w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-[#438989]">3</div>
          <h3 className="mt-4 text-xl font-semibold">Query with AI</h3>
          <p className="mt-2 text-gray-600">Just ask. Search for "that MERN project video" and our AI will find the exact link you saved.</p>
        </div>
      </div>
    </div>
  </section>
);

interface CtaProps {
  onSignupClick: () => void;
}
const CtaSection = ({ onSignupClick }: CtaProps) => (
  <section className="bg-gray-50">
    <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Ready to Build Your Second Brain?
      </h2>
      <div className="mt-8">
        <button
          onClick={onSignupClick}
          className="bg-[#438989] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-[#366d6d] transform hover:-translate-y-1 transition-all duration-300 text-lg"
        >
          Sign Up - It's Free
        </button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="container mx-auto px-4 sm:px-6 py-6 text-center text-gray-500">
      <p>&copy; 2025 Memo.Ri. All rights reserved.</p>
    </div>
  </footer>
);

// --- Main Landing Page Component ---
interface LandingPageprops {
  setToken: (token: string | null) => void;
  isOpen: boolean; // signin modal
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LandingPage({ setToken, isOpen, setOpen }: LandingPageprops) {
  // local state for signup modal
  const [isSignupOpen, setSignupOpen] = useState(false);

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* pass handlers to header */}
      <Header
        onSigninClick={() => setOpen(true)}
        onSignupClick={() => setSignupOpen(true)}
      />

      <main>
        {/* Get Started opens signup; Sign In opens signin */}
        <HeroSection
          onGetStartedClick={() => setSignupOpen(true)}
          onSigninClick={() => setOpen(true)}
        />

        <HowItWorksSection />
        <CtaSection onSignupClick={() => setSignupOpen(true)} />
        <Footer />
      </main>

      {/* Render sign-in modal */}
        {isOpen && (
        <SigninBox
            setToken={setToken}
            setOpen={setOpen} // closes sign-in
            setSignupOpen={setSignupOpen} // opens sign-up
        />
        )}

        {/* Render sign-up modal */}
        {isSignupOpen && (
        <SignUpBox
            setToken={setToken}
            setSignupOpen={setSignupOpen} // closes sign-up
            setSigninOpen={setOpen} // opens sign-in
        />
        )}
    </div>
  );
}
