import { Color } from "./color.type";

export type BadgeType<T extends string> = Record<
  T,
  { text: string; color: Color }
>;

export type PublishedStatusType =
  | "PUBLISHED"
  | "PRIVATE"
  | "BLOCKED"
  | "UNBLOCKED";

export const PublishedStatus: BadgeType<PublishedStatusType> = {
  PUBLISHED: {
    text: "공개",
    color: "success",
  },
  PRIVATE: {
    text: "숨김",
    color: "danger",
  },
  BLOCKED: {
    text: "차단",
    color: "danger",
  },
  UNBLOCKED: {
    text: "차단 해제",
    color: "success",
  },
};
