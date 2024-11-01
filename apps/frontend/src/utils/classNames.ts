export default function classNames(
  ...classes: Array<string | boolean | undefined | null>
): string {
  return classes.filter(Boolean).join(" ")
}
