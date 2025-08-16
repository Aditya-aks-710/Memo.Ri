
import * as Icon from '../icons';

// Note: In a real React project, you would add the Google Fonts <link> 
// and Tailwind CSS <script> to your main public/index.html file.

// --- SVG Icon Components ---
// const BrainIcon = () => (
//     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.871 15.129C4.345 14.41 4 13.49 4 12.5C4 10.567 5.567 9 7.5 9C9.433 9 11 10.567 11 12.5C11 14.433 9.433 16 7.5 16C6.51 16 5.59 15.655 4.871 15.129ZM19.129 15.129C19.655 14.41 20 13.49 20 12.5C20 10.567 18.433 9 16.5 9C14.567 9 13 10.567 13 12.5C13 14.433 14.567 16 16.5 16C17.49 16 18.41 15.655 19.129 15.129ZM12 3C9.239 3 7 5.239 7 8V11.5C7 13.433 8.567 15 10.5 15H13.5C15.433 15 17 13.433 17 11.5V8C17 5.239 14.761 3 12 3ZM12 21C14.761 21 17 18.761 17 16H7C7 18.761 9.239 21 12 21Z"></path>
//     </svg>
// );

// const MenuIcon = () => (
//     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
//     </svg>
// );

// const CloseIcon = () => (
//      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//     </svg>
// );


// --- Section Components ---

const Header = () => (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
            <a href="/" className="flex items-center gap-2">
                <div className=' flex items-center bg-[#438989] pl-2 py-1 pr-3 rounded-md gap-1'>
                    <Icon.LogoIcon className='w-10 rotate-45'/>
                    <div className='text-xl text-white'>
                    Memo.<span className='text-black'>Ri</span>
                    </div>
                </div>
            </a>
            <div className="hidden sm:flex items-center gap-3">
                <a href="/signin" className="text-gray-600 hover:text-[#438989] font-medium transition-colors">Sign In</a>
                <a href="/signup" className="bg-[#438989] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#366d6d] transition-all duration-200">
                    Sign Up
                </a>
            </div>
            {/* <button onClick={onMenuToggle} className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <MenuIcon />
            </button> */}
        </div>
    </header>
);

// const MobileMenu = ({ isOpen, onMenuToggle }: { isOpen: boolean; onMenuToggle: () => void; }) => (
//     <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onMenuToggle}>
//         <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center p-4 border-b">
//                 <span className="text-xl font-bold">Menu</span>
//                 <button onClick={onMenuToggle} className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
//                     <CloseIcon />
//                 </button>
//             </div>
//             <nav className="p-4">
//                 <a href="#features" onClick={onMenuToggle} className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">Features</a>
//                 <a href="#pricing" onClick={onMenuToggle} className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">Pricing</a>
//             </nav>
//             <div className="p-4 absolute bottom-0 w-full border-t">
//                  <a href="#" className="bg-[#438989] text-white font-semibold w-full block text-center px-4 py-2 rounded-lg shadow-sm hover:bg-[#366d6d] transition-colors">
//                     Sign Up
//                 </a>
//                  <a href="#" className="mt-2 border border-gray-300 text-gray-800 font-semibold w-full block text-center px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
//                     Sign In
//                 </a>
//             </div>
//         </div>
//     </div>
// );


const HeroSection = () => (
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
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <a href="/signup" className="bg-[#438989] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#366d6d] transform hover:-translate-y-1 transition-all duration-300">
                    Get Started
                </a>
                <a href="/signin" className="bg-white text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                    Sign In
                </a>
            </div>
        </div>
    </section>
);

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

const CtaSection = () => (
    <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ready to Build Your Second Brain?
            </h2>
            <div className="mt-8">
                <a href="/signup" className="bg-[#438989] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-[#366d6d] transform hover:-translate-y-1 transition-all duration-300 text-lg">
                    Sign Up - It's Free
                </a>
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
export default function LandingPage() {


    return (
        <div className="bg-gray-50 text-gray-800">
            <Header/>
            <main>
                <HeroSection />
                <HowItWorksSection />
                <CtaSection />
                <Footer />
            </main>
        </div>
    );
}