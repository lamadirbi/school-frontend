import type { ParentChild } from "@/types";

/** ربط ولي الأمر بالابن/الابنة المسجّل في النظام */
export const parentChildren: ParentChild[] = [
  {
    parentUserId: "u3",
    studentId: "st1",
    classId: "c1",
    name: "أحمد محمد الخالد",
  },
];

export function getChildByParentUserId(parentUserId: string): ParentChild | undefined {
  return parentChildren.find((c) => c.parentUserId === parentUserId);
}
