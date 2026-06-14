"use client";

import Link from "next/link";
import { Card } from "@/components/atoms/Card";
import { PageHeader } from "@/components/molecules/PageHeader";
import { useAssignments } from "@/context/AssignmentsContext";
import { useAuth } from "@/context/AuthContext";
import { mockStudent, parentAlerts } from "@/data/mock";
import { getChildByParentUserId } from "@/data/students";
import {
  Bell,
  BookOpen,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Hash,
  Users,
} from "lucide-react";

export default function ParentDashboard() {
  const { user } = useAuth();
  const student = mockStudent;
  const child = user ? getChildByParentUserId(user.id) : undefined;
  const { getHomeworkByClass, getQuizzesByClass, getHomeworkSubmission, getQuizSubmission } =
    useAssignments();

  const pendingHomework = child
    ? getHomeworkByClass(child.classId)
        .filter((h) => h.status === "active")
        .filter((h) => !getHomeworkSubmission(h.id, child.studentId)).length
    : 0;

  const openQuizzes = child
    ? getQuizzesByClass(child.classId)
        .filter((q) => q.status === "active")
        .filter((q) => !getQuizSubmission(q.id, child.studentId)).length
    : 0;

  return (
    <div>
      <PageHeader
        title="الرئيسية"
        description="متابعة ابنك/ابنتك — واجبات، اختبارات، ونتائج"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: GraduationCap, label: "اسم الطالب", value: student.name },
          { icon: Users, label: "الصف", value: student.grade },
          { icon: Hash, label: "الشعبة", value: student.section },
          { icon: Hash, label: "رقم الطالب", value: student.studentNumber },
        ].map((item) => (
          <Card key={item.label} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-p-green/10">
              <item.icon className="h-5 w-5 text-p-green" />
            </span>
            <div>
              <p className="text-xs text-p-black/50">{item.label}</p>
              <p className="font-semibold text-p-black">{item.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link href="/parent/homework">
          <Card className="transition-shadow hover:shadow-md">
            <BookOpen className="mb-2 h-7 w-7 text-brand-orange" />
            <h3 className="font-bold text-neutral-950">الواجبات</h3>
            <p className="mt-1 text-sm text-neutral-600">
              {pendingHomework > 0 ? `${pendingHomework} واجب بانتظار التسليم` : "لا واجبات معلّقة"}
            </p>
          </Card>
        </Link>
        <Link href="/parent/quizzes">
          <Card className="transition-shadow hover:shadow-md">
            <ClipboardList className="mb-2 h-7 w-7 text-brand-blue" />
            <h3 className="font-bold text-neutral-950">الاختبارات</h3>
            <p className="mt-1 text-sm text-neutral-600">
              {openQuizzes > 0 ? `${openQuizzes} اختبار متاح` : "لا اختبارات متاحة حالياً"}
            </p>
          </Card>
        </Link>
      </div>

      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-p-black">
        <Bell className="h-5 w-5 text-amber-500" />
        تنبيهات سريعة
      </h2>
      <div className="space-y-3">
        {parentAlerts.map((alert) => (
          <Card key={alert.id} className="flex items-center gap-3 py-4">
            {alert.type === "payment" && <CreditCard className="h-5 w-5 text-p-green" />}
            {alert.type === "note" && <Bell className="h-5 w-5 text-p-green" />}
            {alert.type === "grade" && <GraduationCap className="h-5 w-5 text-amber-500" />}
            <p className="text-sm text-p-black/80">{alert.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
