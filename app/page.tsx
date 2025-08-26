import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-indigo-600">Polly</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
          Create, share, and participate in polls. Get instant feedback from your audience.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/polls">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-base font-medium">
              View Polls
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" className="px-8 py-3 text-base font-medium">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl">
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="text-indigo-600 text-2xl font-bold mb-3">Create</div>
          <p className="text-gray-600">
            Create custom polls with multiple options. Add descriptions to provide context.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="text-indigo-600 text-2xl font-bold mb-3">Share</div>
          <p className="text-gray-600">
            Share your polls with friends, colleagues, or the public to gather responses.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="text-indigo-600 text-2xl font-bold mb-3">Analyze</div>
          <p className="text-gray-600">
            View real-time results and analytics to understand your audience's opinions.
          </p>
        </div>
      </div>
    </div>
  );
}
