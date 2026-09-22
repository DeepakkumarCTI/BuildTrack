import { X } from "lucide-react";
export default function Modal({ title, children, onClose }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl">
      <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X size={19}/></button></div>
      <div className="p-5">{children}</div>
    </div>
  </div>;
}