import { usePreferences } from '@/hooks/usePreferences';

interface LogoProps {
  className?: string;
  loading?: 'eager' | 'lazy';
}

export default function Logo({ className = '', loading = 'eager' }: LogoProps) {
  const { theme } = usePreferences();
  const source = theme === 'dark' ? '/studykit-logo-dark.png' : '/studykit-logo-light.png';

  return (
    <img
      src={source}
      alt="StudyKit"
      dir="ltr"
      width="772"
      height="251"
      loading={loading}
      decoding="async"
      className={className}
    />
  );
}
