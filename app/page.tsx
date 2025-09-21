import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 min-h-screen" role="main">
      <div className="text-center max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl" tabIndex={-1} id="main-heading">
          <span className="block">Welcome to</span>
          <span className="block text-indigo-600">Polly</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl leading-relaxed">
          Create, share, and participate in polls. Get instant feedback from your audience.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href="/polls">
                View Polls
              </Link>
            </Button>
            <Button variant="outline" className="px-8 py-3 text-base font-medium w-full sm:w-auto" asChild>
              <Link href="/auth/register">
                Sign Up
              </Link>
            </Button>
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl w-full px-4 sm:px-0">
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm flex flex-col items-center text-center">
          <h2 className="text-indigo-600 text-2xl font-bold mb-3">Create</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Create custom polls with multiple options. Add descriptions to provide context.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm flex flex-col items-center text-center">
          <h2 className="text-indigo-600 text-2xl font-bold mb-3">Share</h2>
          <p className="text-gray-600 text-base leading-relaxed">Share your polls with friends, colleagues, or the public to gather responses.</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm flex flex-col items-center text-center">
          <h2 className="text-indigo-600 text-2xl font-bold mb-3">Analyze</h2>
          <p className="text-gray-600 text-base leading-relaxed">View real-time results and analytics to understand your audience's opinions.</p>
        </div>
      </div>
    </div>
  );
}
