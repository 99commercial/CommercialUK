/**
 * Extracts field-level validation errors from API/axios error responses.
 * Handles both error.response.data.errors (axios) and error.errors formats.
 */
export function extractFieldErrorsFromApiError(error: any): Record<string, string> {
  const apiErrors = error?.response?.data?.errors || error?.errors;
  if (!Array.isArray(apiErrors)) {
    return {};
  }

  const mappedErrors: Record<string, string> = {};
  apiErrors.forEach((err: any) => {
    if (err?.path && (err?.msg || err?.message)) {
      const normalizedPath = String(err.path).replace(/\[(\d+)\]/g, '.$1');
      mappedErrors[normalizedPath] = err.msg || err.message;
    }
  });

  return mappedErrors;
}

/**
 * Extracts a user-friendly error message from API/axios error responses.
 */
export function getApiErrorMessage(error: any, fallback: string = 'Something went wrong. Please try again.'): string {
  return error?.response?.data?.message || error?.message || fallback;
}
