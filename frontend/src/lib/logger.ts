export class Logger {
  public shouldLog: () => boolean;

  constructor(shouldLog = () => true) {
    this.shouldLog = shouldLog;
  }

  info(...args: Parameters<Console["info"]>): void {
    if (this.shouldLog()) console.info(...args);
  }

  log(...args: Parameters<Console["log"]>): void {
    if (this.shouldLog()) console.log(...args);
  }

  error(...args: Parameters<Console["error"]>): void {
    if (this.shouldLog()) console.error(...args);
  }

  warn(...args: Parameters<Console["warn"]>): void {
    if (this.shouldLog()) console.warn(...args);
  }
}

const logger = new Logger(() => import.meta.env.NODE_ENV !== "production");

export default logger;
