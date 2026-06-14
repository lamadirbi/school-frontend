import type { Homework, HomeworkSubmission, Quiz, QuizSubmission } from "@/types";

export const initialHomework: Homework[] = [
  {
    id: "hw1",
    classId: "c1",
    teacherId: "t1",
    title: "تمارين المعادلات الخطية",
    description: "حل التمارين من ص 45 إلى 48 في كتاب الرياضيات. ارفع الحلول بخط واضح.",
    dueDate: "2026-06-20",
    status: "active",
    createdAt: "2026-06-10",
  },
  {
    id: "hw2",
    classId: "c1",
    teacherId: "t1",
    title: "بحث قصير: تطبيقات المشتقة",
    description: "إعداد بحث من صفحتين عن تطبيقات المشتقة في الحياة اليومية مع مراجع.",
    dueDate: "2026-06-25",
    status: "active",
    createdAt: "2026-06-12",
  },
  {
    id: "hw3",
    classId: "c2",
    teacherId: "t1",
    title: "مراجعة الوحدة الثالثة",
    description: "مراجعة شاملة لجميع دروس الوحدة الثالثة استعداداً للاختبار.",
    dueDate: "2026-06-18",
    status: "closed",
    createdAt: "2026-06-05",
  },
];

export const initialQuizzes: Quiz[] = [
  {
    id: "qz1",
    classId: "c1",
    teacherId: "t1",
    title: "اختبار قصير: الدوال",
    description: "اختبار من 15 دقيقة يغطي مفاهيم الدوال الأساسية.",
    dueDate: "2026-06-22",
    startAt: "2026-06-14T00:00:00",
    durationMinutes: 480,
    status: "active",
    createdAt: "2026-06-11",
    questions: [
      {
        id: "q1",
        prompt: "ما نطاق الدالة f(x) = √(x - 4)؟",
        options: ["x ≥ 0", "x ≥ 4", "x > 4", "جميع الأعداد الحقيقية"],
        correctIndex: 1,
      },
      {
        id: "q2",
        prompt: "إذا كانت f(x) = 2x + 3، فما قيمة f(5)؟",
        options: ["10", "11", "13", "15"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "qz2",
    classId: "c2",
    teacherId: "t1",
    title: "كويز: المتتاليات",
    description: "اختبار سريع على المتتاليات الحسابية والهندسية.",
    dueDate: "2026-06-19",
    startAt: "2026-06-20T10:00:00",
    durationMinutes: 20,
    status: "active",
    createdAt: "2026-06-08",
    questions: [
      {
        id: "q3",
        prompt: "ما الحد العام للمتتالية الحسابية 2, 5, 8, 11, ...؟",
        options: ["aₙ = 3n", "aₙ = 2 + 3(n-1)", "aₙ = 2n + 1", "aₙ = n + 2"],
        correctIndex: 1,
      },
    ],
  },
];

export const initialHomeworkSubmissions: HomeworkSubmission[] = [];

export const initialQuizSubmissions: QuizSubmission[] = [];
