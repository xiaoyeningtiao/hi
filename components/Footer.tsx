export function Footer() {
  return (
    <footer className="relative mt-32 pb-12 pt-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-haze-400/20 to-transparent mb-12" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-ink-400">
          <div className="display-cn text-base text-ink-500">
            在某个深夜里，被理解过。
          </div>
          <div className="flex items-center gap-6">
            <span className="display-en italic">© {new Date().getFullYear()} xiaoye</span>
            <span className="opacity-60">made with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
