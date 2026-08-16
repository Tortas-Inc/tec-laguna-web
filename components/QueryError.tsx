export function QueryError({ message }: { message: string }) {
  return (
    <div className="rounded-[10px] bg-danger-tint px-4 py-3.5 text-sm font-semibold text-danger">
      {message}
    </div>
  );
}
