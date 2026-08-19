import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(message: string, status = 500, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.status : 500;
  const payload: any = {
    error: isAppError ? err.code ?? 'error' : 'internal_error',
    message: isAppError ? err.message : 'Internal server error',
  };
  if (isAppError && err.details) payload.details = err.details;
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
  res.status(status).json(payload);
}
