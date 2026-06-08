import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { getClientDb } from "./firebase";
import type { Income, Expense, Budget, SavingsGoal } from "@/types";

function mapDoc<T extends { id: string }>(docData: DocumentData, id: string): T {
  return {
    id,
    ...docData,
    createdAt: docData.createdAt?.toDate?.()?.toISOString() ?? docData.createdAt,
    updatedAt: docData.updatedAt?.toDate?.()?.toISOString() ?? docData.updatedAt,
  } as unknown as T;
}

function sortByField<T>(records: T[], field: string, direction: "asc" | "desc" = "desc"): T[] {
  return [...records].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[field];
    const bVal = (b as Record<string, unknown>)[field];
    if (aVal === bVal) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = String(aVal).localeCompare(String(bVal));
    return direction === "desc" ? -cmp : cmp;
  });
}

async function getUserRecords<T extends { id: string }>(
  collectionName: string,
  userId: string,
  orderField = "date"
): Promise<T[]> {
  const q = query(
    collection(getClientDb(), collectionName),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const records = snapshot.docs.map((d) => mapDoc<T>(d.data(), d.id));
  return sortByField(records, orderField, "desc");
}

export async function getIncome(userId: string) {
  return getUserRecords<Income>("income", userId);
}

export async function createIncome(userId: string, data: Omit<Income, "id" | "userId" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(getClientDb(), "income"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateIncome(id: string, data: Partial<Income>) {
  const { id: _, userId: __, createdAt: ___, ...rest } = data;
  await updateDoc(doc(getClientDb(), "income", id), { ...rest, updatedAt: serverTimestamp() });
}

export async function deleteIncome(id: string) {
  await deleteDoc(doc(getClientDb(), "income", id));
}

export async function getExpenses(userId: string) {
  return getUserRecords<Expense>("expenses", userId);
}

export async function createExpense(userId: string, data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(getClientDb(), "expenses"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateExpense(id: string, data: Partial<Expense>) {
  const { id: _, userId: __, createdAt: ___, ...rest } = data;
  await updateDoc(doc(getClientDb(), "expenses", id), { ...rest, updatedAt: serverTimestamp() });
}

export async function deleteExpense(id: string) {
  await deleteDoc(doc(getClientDb(), "expenses", id));
}

export async function getBudgets(userId: string, month?: string) {
  const constraints = [where("userId", "==", userId)];
  if (month) {
    constraints.push(where("month", "==", month));
  }

  const q = query(collection(getClientDb(), "budgets"), ...constraints);
  const snapshot = await getDocs(q);
  const records = snapshot.docs.map((d) => mapDoc<Budget>(d.data(), d.id));
  return sortByField(records, "category", "asc");
}

export async function createBudget(userId: string, data: Omit<Budget, "id" | "userId" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(getClientDb(), "budgets"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBudget(id: string, data: Partial<Budget>) {
  const { id: _, userId: __, createdAt: ___, ...rest } = data;
  await updateDoc(doc(getClientDb(), "budgets", id), { ...rest, updatedAt: serverTimestamp() });
}

export async function deleteBudget(id: string) {
  await deleteDoc(doc(getClientDb(), "budgets", id));
}

export async function getGoals(userId: string) {
  return getUserRecords<SavingsGoal>("goals", userId, "createdAt");
}

export async function createGoal(userId: string, data: Omit<SavingsGoal, "id" | "userId" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(getClientDb(), "goals"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGoal(id: string, data: Partial<SavingsGoal>) {
  const { id: _, userId: __, createdAt: ___, ...rest } = data;
  await updateDoc(doc(getClientDb(), "goals", id), { ...rest, updatedAt: serverTimestamp() });
}

export async function deleteGoal(id: string) {
  await deleteDoc(doc(getClientDb(), "goals", id));
}
