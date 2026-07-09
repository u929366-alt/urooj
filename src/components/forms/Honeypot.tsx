export function Honeypot({ name = "companyWebsite" }: { name?: string }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={name}>Leave this field empty</label>
      <input type="text" id={name} name={name} tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export const HONEYPOT_FIELD = "companyWebsite";
