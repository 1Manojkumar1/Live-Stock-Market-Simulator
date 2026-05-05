// import React from 'react'
 function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8e8ed] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-[#86868b] text-sm">
          © {new Date().getFullYear()} Live Trading. Buy and Sell stocks with confidence.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="text-[#86868b] hover:text-[#1d1d1f] text-xs transition">Privacy Policy</a>
          <a href="#" className="text-[#86868b] hover:text-[#1d1d1f] text-xs transition">Terms of Service</a>
          <a href="#" className="text-[#86868b] hover:text-[#1d1d1f] text-xs transition">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer
