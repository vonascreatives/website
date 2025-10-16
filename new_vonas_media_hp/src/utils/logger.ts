/**
 * Environment-based logging utility
 * Only logs in development mode to avoid production console pollution
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.isDevelopment && level !== 'error') {
      return; // Only show errors in production
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'info':
        console.log(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
    }
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  // Sanity-specific logging methods
  sanityDebug(message: string, data?: any) {
    if (this.isDevelopment) {
      this.debug(`🔧 SANITY: ${message}`, data);
    }
  }

  sanityError(message: string, error?: any) {
    this.error(`❌ SANITY ERROR: ${message}`, error);
  }

  sanitySuccess(message: string, data?: any) {
    if (this.isDevelopment) {
      this.info(`✅ SANITY: ${message}`, data);
    }
  }
}

export const logger = new Logger();
export default logger;
