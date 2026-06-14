"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import { ClassSelect, getSelectedClassIds } from "@/components/teacher/ClassSelect";
import { toDatetimeLocalValue } from "@/lib/quiz-timing";
import type { Quiz, QuizQuestion } from "@/types";
import type { SchoolClass } from "@/types/teacher";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

export type QuizFormData = {
  classIds?: string[];
  title: string;
  description: string;
  dueDate: string;
  startAt: string;
  durationMinutes: number;
  status: Quiz["status"];
  questions: QuizQuestion[];
};

function emptyQuestion(): QuizQuestion {
  return {
    id: `qq${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  };
}

export function QuizForm({
  initial,
  classes,
  showClassSelect = false,
  onSubmit,
  onCancel,
}: {
  initial?: Quiz;
  classes?: SchoolClass[];
  showClassSelect?: boolean;
  onSubmit: (data: QuizFormData) => void;
  onCancel: () => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initial?.questions.length ? initial.questions : [emptyQuestion()]
  );

  function updateQuestion(id: string, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function updateOption(qId: string, optIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((o, i) => (i === optIndex ? value : o)) }
          : q
      )
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => (prev.length <= 1 ? prev : prev.filter((q) => q.id !== id)));
  }

  function moveQuestion(id: string, dir: -1 | 1) {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const validQuestions = questions.filter(
      (q) => q.prompt.trim() && q.options.every((o) => o.trim())
    );
    if (validQuestions.length === 0) {
      alert("أضف سؤالاً واحداً على الأقل مع جميع الخيارات.");
      return;
    }
    const startAtRaw = form.get("startAt") as string;
    const classIds = showClassSelect ? getSelectedClassIds(form) : undefined;
    if (showClassSelect && (!classIds || classIds.length === 0)) {
      alert("اختر فصلاً واحداً على الأقل.");
      return;
    }
    onSubmit({
      classIds,
      title: form.get("title") as string,
      description: form.get("description") as string,
      dueDate: form.get("dueDate") as string,
      startAt: new Date(startAtRaw).toISOString(),
      durationMinutes: Number(form.get("durationMinutes")),
      status: form.get("status") as Quiz["status"],
      questions: validQuestions,
    });
  }

  const defaultStartAt = initial?.startAt
    ? toDatetimeLocalValue(initial.startAt)
    : toDatetimeLocalValue(new Date().toISOString());

  return (
    <Card className="mb-6 border-brand-blue/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
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
            label="عنوان الاختبار"
            name="title"
            required
            defaultValue={initial?.title}
            className="sm:col-span-2"
          />
          <Textarea
            label="وصف مختصر"
            name="description"
            defaultValue={initial?.description}
            className="sm:col-span-2"
          />
          <Input
            label="تاريخ انتهاء العرض"
            name="dueDate"
            type="date"
            required
            defaultValue={initial?.dueDate}
          />
          <Input
            label="وقت بداية الاختبار"
            name="startAt"
            type="datetime-local"
            required
            defaultValue={defaultStartAt}
          />
          <Input
            label="مدة الاختبار (بالدقائق)"
            name="durationMinutes"
            type="number"
            min={1}
            max={180}
            required
            defaultValue={initial?.durationMinutes ?? 15}
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
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-neutral-900">أسئلة الاختبار</h4>
            <Button type="button" variant="outline" className="px-3 py-2 text-xs" onClick={addQuestion}>
              <Plus className="h-3.5 w-3.5" />
              إضافة سؤال
            </Button>
          </div>

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div
                key={q.id}
                className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-brand-blue">السؤال {qi + 1}</span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-2 py-1"
                      disabled={qi === 0}
                      onClick={() => moveQuestion(q.id, -1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-2 py-1"
                      disabled={qi === questions.length - 1}
                      onClick={() => moveQuestion(q.id, 1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="px-2 py-1"
                      disabled={questions.length <= 1}
                      onClick={() => removeQuestion(q.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Textarea
                  label="نص السؤال"
                  value={q.prompt}
                  onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                  className="mb-3 min-h-[80px]"
                  required
                />

                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctIndex === oi}
                        onChange={() => updateQuestion(q.id, { correctIndex: oi })}
                        className="text-brand-blue"
                        title="الإجابة الصحيحة"
                      />
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(q.id, oi, e.target.value)}
                        placeholder={`الخيار ${oi + 1}`}
                        required
                        className="flex-1 py-2"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  حدّد الإجابة الصحيحة بالضغط على الدائرة بجانب الخيار.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit">{initial ? "حفظ التعديلات" : "إنشاء الاختبار"}</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            إلغاء
          </Button>
        </div>
      </form>
    </Card>
  );
}
