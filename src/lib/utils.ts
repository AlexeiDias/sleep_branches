export function getAge(dob: string): string {
  const birthDate = new Date(dob);
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return `Age: ${months} month${months === 1 ? "" : "s"}`;
  }

  if (months === 0) {
    return `Age: ${years} year${years === 1 ? "" : "s"}`;
  }

  return `Age: ${years} year${years === 1 ? "" : "s"} and ${months} month${months === 1 ? "" : "s"}`;
}
