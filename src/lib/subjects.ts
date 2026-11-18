export function uniqueSubjects(items: { subject: string }[]): string[] {
  const subjects = items.map(item => item.subject.trim()).filter(Boolean);
  return [...new Set(subjects)].sort((a, b) => a.localeCompare(b));
}
