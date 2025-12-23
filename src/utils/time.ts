import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc); // 👈 this enables `.utc()` support

export const parseLocalDate = (str: string): Date =>
  dayjs(str).startOf("day").toDate();

export const toUtcISOString = (date: Date): string =>
  dayjs(date).utc().startOf("day").toISOString();
