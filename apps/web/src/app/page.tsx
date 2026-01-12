import { LoginModal } from '@/components/LoginModal';
import { HomeStartStreaming } from '@/components/home/HomeStartStreaming';

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="text-center">
        <div className="text-4xl font-semibold tracking-tight">Easy Stream</div>
        <div className="mt-2 text-sm text-slate-600">
          Anonymous live streaming over WebRTC + peer-to-peer waterfall delivery.
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <HomeStartStreaming />
      </div>

      <LoginModal />
    </div>
  );
}
