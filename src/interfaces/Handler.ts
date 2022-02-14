export interface Handler {
  install(): void;
  uninstall(): void;
  handler(): void;
}