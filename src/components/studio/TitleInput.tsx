type TitleInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Poster title"
      placeholder="Add a title"
      rows={1}
      spellCheck={false}
      className="field-sizing-content max-h-28 w-full max-w-md shrink-0 resize-none rounded-2xl bg-white/5 px-4 py-3 text-sm leading-5 text-white ring-1 ring-white/8 transition outline-none placeholder:text-neutral-500 hover:bg-white/7 focus:bg-white/8 focus:ring-white/20"
    />
  );
}
