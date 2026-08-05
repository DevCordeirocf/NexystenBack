export class AppLogger {
  static info(message: string, meta: Record<string, any> = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...meta,
    };
    console.log(JSON.stringify(entry));
  }

  static warn(message: string, meta: Record<string, any> = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      ...meta,
    };
    console.warn(JSON.stringify(entry));
  }

  static error(message: string, meta: Record<string, any> = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      ...meta,
    };
    console.error(JSON.stringify(entry));
  }
}
