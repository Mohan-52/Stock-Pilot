const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "",
  size = "max-w-2xl",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/70 p-4 sm:items-center">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={`relative mx-auto w-full ${size} overflow-hidden rounded-lg border border-white/10 bg-[#0b1728] shadow-2xl transition-all duration-300 ${className}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            x
          </button>
        </div>

        <div className="p-6">{children}</div>

        {footer && <div className="border-t border-white/10 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
