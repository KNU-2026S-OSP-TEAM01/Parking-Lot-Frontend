type ApiErrorBody = {
  detail?: unknown;
  message?: unknown;
};

type ApiErrorLike = {
  response?: {
    data?: ApiErrorBody;
  };
};

const isApiErrorLike = (error: unknown): error is ApiErrorLike =>
  typeof error === "object" && error !== null && "response" in error;

export const getApiErrorMessage = (
  error: unknown,
  fallback = "요청을 처리하지 못했습니다."
) => {
  if (!isApiErrorLike(error)) return fallback;

  const data = error.response?.data;
  const detail = data?.detail;
  const message = data?.message;

  if (typeof message === "string") return message;
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail) && detail.length > 0) {
    const firstDetail = detail[0];

    if (
      typeof firstDetail === "object" &&
      firstDetail !== null &&
      "msg" in firstDetail &&
      typeof firstDetail.msg === "string"
    ) {
      return firstDetail.msg;
    }
  }

  return fallback;
};
