"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  initialHomework,
  initialHomeworkSubmissions,
  initialQuizSubmissions,
  initialQuizzes,
} from "@/data/assignments";
import type {
  Homework,
  HomeworkSubmission,
  Quiz,
  QuizQuestion,
  QuizSubmission,
} from "@/types";

type AssignmentsState = {
  homework: Homework[];
  quizzes: Quiz[];
  homeworkSubmissions: HomeworkSubmission[];
  quizSubmissions: QuizSubmission[];
};

type AssignmentsContextValue = AssignmentsState & {
  getHomeworkByClass: (classId: string) => Homework[];
  getQuizzesByClass: (classId: string) => Quiz[];
  getHomeworkByTeacher: (teacherId: string, classIds: string[]) => Homework[];
  getQuizzesByTeacher: (teacherId: string, classIds: string[]) => Quiz[];
  addHomework: (data: Omit<Homework, "id" | "createdAt">) => Homework;
  updateHomework: (id: string, data: Partial<Omit<Homework, "id" | "createdAt">>) => void;
  deleteHomework: (id: string) => void;
  addQuiz: (data: Omit<Quiz, "id" | "createdAt">) => Quiz;
  updateQuiz: (id: string, data: Partial<Omit<Quiz, "id" | "createdAt">>) => void;
  deleteQuiz: (id: string) => void;
  submitHomework: (data: Omit<HomeworkSubmission, "id" | "submittedAt">) => HomeworkSubmission;
  getHomeworkSubmission: (homeworkId: string, studentId: string) => HomeworkSubmission | undefined;
  getHomeworkSubmissions: (homeworkId: string) => HomeworkSubmission[];
  submitQuiz: (data: Omit<QuizSubmission, "id" | "submittedAt">) => QuizSubmission;
  getQuizSubmission: (quizId: string, studentId: string) => QuizSubmission | undefined;
  getQuizSubmissions: (quizId: string) => QuizSubmission[];
};

const STORAGE_KEY = "ghazatna_assignments";

function normalizeQuiz(q: Quiz): Quiz {
  return {
    ...q,
    startAt: q.startAt ?? `${q.dueDate}T08:00:00`,
    durationMinutes: q.durationMinutes ?? 30,
  };
}

function loadState(): AssignmentsState {
  const fallback: AssignmentsState = {
    homework: initialHomework,
    quizzes: initialQuizzes.map(normalizeQuiz),
    homeworkSubmissions: initialHomeworkSubmissions,
    quizSubmissions: initialQuizSubmissions,
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<AssignmentsState>;
    return {
      homework: parsed.homework ?? initialHomework,
      quizzes: (parsed.quizzes ?? initialQuizzes).map(normalizeQuiz),
      homeworkSubmissions: parsed.homeworkSubmissions ?? initialHomeworkSubmissions,
      quizSubmissions: parsed.quizSubmissions ?? initialQuizSubmissions,
    };
  } catch {
    return fallback;
  }
}

const AssignmentsContext = createContext<AssignmentsContextValue | null>(null);

export function AssignmentsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssignmentsState>(loadState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const getHomeworkByClass = useCallback(
    (classId: string) =>
      state.homework
        .filter((h) => h.classId === classId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.homework]
  );

  const getQuizzesByClass = useCallback(
    (classId: string) =>
      state.quizzes
        .filter((q) => q.classId === classId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.quizzes]
  );

  const getHomeworkByTeacher = useCallback(
    (teacherId: string, classIds: string[]) =>
      state.homework
        .filter((h) => h.teacherId === teacherId && classIds.includes(h.classId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.homework]
  );

  const getQuizzesByTeacher = useCallback(
    (teacherId: string, classIds: string[]) =>
      state.quizzes
        .filter((q) => q.teacherId === teacherId && classIds.includes(q.classId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.quizzes]
  );

  const addHomework = useCallback((data: Omit<Homework, "id" | "createdAt">) => {
    const item: Homework = {
      ...data,
      id: `hw${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({ ...prev, homework: [item, ...prev.homework] }));
    return item;
  }, []);

  const updateHomework = useCallback(
    (id: string, data: Partial<Omit<Homework, "id" | "createdAt">>) => {
      setState((prev) => ({
        ...prev,
        homework: prev.homework.map((h) => (h.id === id ? { ...h, ...data } : h)),
      }));
    },
    []
  );

  const deleteHomework = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      homework: prev.homework.filter((h) => h.id !== id),
      homeworkSubmissions: prev.homeworkSubmissions.filter((s) => s.homeworkId !== id),
    }));
  }, []);

  const addQuiz = useCallback((data: Omit<Quiz, "id" | "createdAt">) => {
    const item: Quiz = {
      ...normalizeQuiz(data as Quiz),
      id: `qz${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({ ...prev, quizzes: [item, ...prev.quizzes] }));
    return item;
  }, []);

  const updateQuiz = useCallback(
    (id: string, data: Partial<Omit<Quiz, "id" | "createdAt">>) => {
      setState((prev) => ({
        ...prev,
        quizzes: prev.quizzes.map((q) => (q.id === id ? normalizeQuiz({ ...q, ...data }) : q)),
      }));
    },
    []
  );

  const deleteQuiz = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      quizzes: prev.quizzes.filter((q) => q.id !== id),
      quizSubmissions: prev.quizSubmissions.filter((s) => s.quizId !== id),
    }));
  }, []);

  const submitHomework = useCallback(
    (data: Omit<HomeworkSubmission, "id" | "submittedAt">) => {
      const item: HomeworkSubmission = {
        ...data,
        id: `hws${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        homeworkSubmissions: [
          ...prev.homeworkSubmissions.filter(
            (s) => !(s.homeworkId === data.homeworkId && s.studentId === data.studentId)
          ),
          item,
        ],
      }));
      return item;
    },
    []
  );

  const getHomeworkSubmission = useCallback(
    (homeworkId: string, studentId: string) =>
      state.homeworkSubmissions.find(
        (s) => s.homeworkId === homeworkId && s.studentId === studentId
      ),
    [state.homeworkSubmissions]
  );

  const getHomeworkSubmissions = useCallback(
    (homeworkId: string) =>
      state.homeworkSubmissions.filter((s) => s.homeworkId === homeworkId),
    [state.homeworkSubmissions]
  );

  const submitQuiz = useCallback((data: Omit<QuizSubmission, "id" | "submittedAt">) => {
    const item: QuizSubmission = {
      ...data,
      id: `qzs${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      quizSubmissions: [
        ...prev.quizSubmissions.filter(
          (s) => !(s.quizId === data.quizId && s.studentId === data.studentId)
        ),
        item,
      ],
    }));
    return item;
  }, []);

  const getQuizSubmission = useCallback(
    (quizId: string, studentId: string) =>
      state.quizSubmissions.find((s) => s.quizId === quizId && s.studentId === studentId),
    [state.quizSubmissions]
  );

  const getQuizSubmissions = useCallback(
    (quizId: string) => state.quizSubmissions.filter((s) => s.quizId === quizId),
    [state.quizSubmissions]
  );

  return (
    <AssignmentsContext.Provider
      value={{
        ...state,
        getHomeworkByClass,
        getQuizzesByClass,
        getHomeworkByTeacher,
        getQuizzesByTeacher,
        addHomework,
        updateHomework,
        deleteHomework,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        submitHomework,
        getHomeworkSubmission,
        getHomeworkSubmissions,
        submitQuiz,
        getQuizSubmission,
        getQuizSubmissions,
      }}
    >
      {children}
    </AssignmentsContext.Provider>
  );
}

export function useAssignments() {
  const ctx = useContext(AssignmentsContext);
  if (!ctx) throw new Error("useAssignments must be used within AssignmentsProvider");
  return ctx;
}

export type { QuizQuestion };
