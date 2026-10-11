export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] animate-pulse lg:h-screen">
      <div className="flex-1 bg-page-2" />
      <div className="w-1 bg-rule" />
      <div className="w-[380px] border-l border-rule bg-paper" />
    </div>
  );
}
