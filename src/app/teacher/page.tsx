"use client";

import Link from "next/link";
import { Card } from "@/components/atoms/Card";
import { PageHeader } from "@/components/molecules/PageHeader";
import { useAssignments } from "@/context/AssignmentsContext";
import { useAuth } from "@/context/AuthContext";
import { useSchool } from "@/context/SchoolContext";
import { BookOpen, ClipboardList, GraduationCap, Users } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { getTeacherClassesByUserId } = useSchool();
  const { getHomeworkByClass, getQuizzesByClass } = useAssignments();
  const classes = user ? getTeacherClassesByUserId(user.id) : [];

  return (
    <div>
      <PageHeader title="فصولي" description="الفصول المسندة إليك من الإدارة" />

      {classes.length === 0 ? (
        <Card className="text-center text-[#1a1a1a]/50">
          لا توجد فصول مسندة إليك حالياً. تواصل مع الإدارة.
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => {
            const hwCount = getHomeworkByClass(cls.id).length;
            const quizCount = getQuizzesByClass(cls.id).length;

            return (
              <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-teal)]/10">
                    <GraduationCap className="h-6 w-6 text-[var(--brand-teal)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a1a]">{cls.name}</h3>
                  <p className="mt-2 flex items-center gap-1 text-sm text-[#1a1a1a]/50">
                    <Users className="h-4 w-4" />
                    {cls.studentCount} طالب
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-neutral-600">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-brand-blue" />
                      {hwCount} واجب
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ClipboardList className="h-3.5 w-3.5 text-brand-orange" />
                      {quizCount} اختبار
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
