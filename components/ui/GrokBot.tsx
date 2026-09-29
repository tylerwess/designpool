export function GrokBot({ className = "" }: { className?: string }) {
  return (
    <div className={`bot-container ${className}`.trim()} aria-hidden="true">
      <div className="bot-body">
        <div className="bot-face">
          <div className="bot-eye bot-eye-inner" />
          <div className="bot-eye bot-eye-outer" />
        </div>
      </div>
    </div>
  );
}
