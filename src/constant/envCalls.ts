export const getSmartUserBaseUrl = (): string => {
  if (!process.env.NEXT_PUBLIC_SMART_USER_API_URL) {
    throw new Error("NEXT_PUBLIC_SMART_USER_API_URL is undefined");
  }

  return process.env.NEXT_PUBLIC_SMART_USER_API_URL;
};
