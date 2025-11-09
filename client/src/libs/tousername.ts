import { useCallback } from "react";

// Bỏ dấu tiếng Việt
const removeDiacritics = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export function useUsernameFormatter() {
  const toUsername = useCallback((fullName: string, brithday: string): string => {
    if (!fullName) return "";

    const cleaned = removeDiacritics(fullName).trim();
    const parts = cleaned.split(/\s+/);

    // Tên cuối → lowercase
    const last = parts[parts.length - 1].toLowerCase();

    // Viết tắt các từ trước → chữ cái đầu
    const initials = parts
      .slice(0, -1)
      .map(word => word[0].toLowerCase())
      .join("");

    return last + initials + brithday;
  }, []);

  return { toUsername };
}
