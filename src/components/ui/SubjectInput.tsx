import { inputClass } from '@/lib/styles';

interface SubjectInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
}

export default function SubjectInput({ id, value, onChange, suggestions, placeholder }: SubjectInputProps) {
  const listId = `${id}-options`;
  return (
    <>
      <input
        id={id}
        type="text"
        list={listId}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        required
        pattern=".*\S.*"
        autoComplete="off"
        className={inputClass}
      />
      <datalist id={listId}>
        {suggestions.map(suggestion => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </>
  );
}
