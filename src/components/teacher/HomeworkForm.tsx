"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import { ClassSelect, getSelectedClassIds } from "@/components/teacher/ClassSelect";
import type { Homework } from "@/types";
import type { SchoolClass } from "@/types/teacher";

export type HomeworkFormData = {
  classIds?: string[];
  title: string;
  description: string;
  dueDate: string;
  status: Homework["status"];
};

export function HomeworkForm({
  initial,
  classes,
  showClassSelect = false,
  onSubmit,
  onCancel,
}: {
  initial?: Homework;
  classes?: SchoolClass[];
  showClassSelect?: boolean;
  onSubmit: (data: HomeworkFormData) => void;
  onCancel: () => void;
}) {
  return (
    <Card className="mb-6 border-brand-blue/20">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const classIds = showClassSelect
            ? getSelectedClassIds(form)
            : undefined;
          if (showClassSelect && (!classIds || classIds.length === 0)) {
            alert("اختر فصلاً واحداً على الأقل.");
            return;
          }
          onSubmit({
            classIds,
            title: form.get("title") as string,
            description: form.get("description") as string,
            dueDate: form.get("dueDate") as string,
            status: form.get("status") as Homework["status"],
          });
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {showClassSelect && classes && classes.length > 0 && (
          <div className="sm:col-span-2">
            <ClassSelect
              classes={classes}
              multiple={!initial}
              defaultValue={initial?.classId}
            />
          </div>
        )}
        <Input
          label="عنوان الواجب"
          name="title"
          required
          defaultValue={initial?.title}
          className="sm:col-span-2"
        />
        <Textarea
          label="التعليمات"
          name="description"
          required
          defaultValue={initial?.description}
          className="sm:col-span-2"
        />
        <Input
          label="تاريخ التسليم"
          name="dueDate"
          type="date"
          required
          defaultValue={initial?.dueDate}
        />
        <Select
          label="الحالة"
          name="status"
          defaultValue={initial?.status ?? "active"}
          options={[
            { value: "active", label: "نشط" },
            { value: "closed", label: "مغلق" },
          ]}
        />
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit">{initial ? "حفظ التعديلات" : "إنشاء الواجب"}</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            إلغاء
          </Button>
        </div>
      </form>
    </Card>
  );
}
