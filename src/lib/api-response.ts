import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

/**
 * Central helpers for consistent API responses.
 * Keeps the JSON envelope and typing identical across all route handlers.
 */

export function apiOk<T>(data: T, init?: ResponseInit): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data
    },
    init
  );
}

export function apiError(
  message: string,
  options?: { status?: number; code?: string }
): NextResponse<ApiResponse<null>> {
  const status = options?.status ?? 400;
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      error: {
        message,
        code: options?.code
      }
    },
    { status }
  );
}

