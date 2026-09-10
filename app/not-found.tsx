import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0c13] text-[#e4e7f5] flex flex-col items-center justify-center p-4 font-mono">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-bold text-amber-400">404</h1>
        <h2 className="text-lg font-semibold text-white">Element Not Found</h2>
        <p className="text-sm text-[#8b97bc]">
          The particle coordinates you requested do not exist in the simulation matrix.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Return to Sandbox
          </Link>
        </div>
      </div>
    </div>
  );
}
