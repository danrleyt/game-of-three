export enum Severity {
  CRITICAL = 'CRITICAL',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

/**
 * Helper function to log actions in the API
 */
export function logger(severity: Severity, location:string, object) {
  if (severity === Severity.DEBUG || severity === Severity.INFO) {
    console.log(severity, location, Object.values(object))
  } else if (severity === Severity.CRITICAL || severity === Severity.ERROR) {
    console.error(severity, location, object)
  }
}
