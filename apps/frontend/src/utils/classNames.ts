export default function classNames(
  ...classes: Array<string | boolean | undefined>
): string {
  return classes.filter(Boolean).join(" ")
}
