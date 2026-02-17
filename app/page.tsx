import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">DG Atlas</h1>
          <p className="text-zinc-500 mt-2">строительная платформа</p>
        </div>

        <div className="flex flex-col gap-3 w-64">
          <Link
            href="/tma"
            className="h-12 bg-white text-black rounded-lg flex items-center justify-center font-medium hover:bg-zinc-200 transition-colors"
          >
            Telegram Mini App
          </Link>
          <Link
            href="/login"
            className="h-12 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-medium hover:bg-zinc-800 transition-colors border border-zinc-800"
          >
            Войти (Web)
          </Link>
        </div>
      </div>
    </div>
  );
}
