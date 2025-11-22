
import { MemberApplication, MembershipStatus, Payment, PaymentGateway, PaymentStatus, User } from '../types';
import { MOCK_MEMBERS, MOCK_PAYMENTS, MOCK_USERS } from '../constants';

// Initialize data in localStorage if it doesn't exist
const initializeData = <T,>(key: string, mockData: T[]): T[] => {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    }
    localStorage.setItem(key, JSON.stringify(mockData));
    return mockData;
  } catch (e) {
    console.error(`Failed to initialize ${key}`, e);
    localStorage.setItem(key, JSON.stringify(mockData));
    return mockData;
  }
};

let members: MemberApplication[] = initializeData('nampdtech-members', MOCK_MEMBERS);
let payments: Payment[] = initializeData('nampdtech-payments', MOCK_PAYMENTS);

const saveData = <T,>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getMembers = async (): Promise<MemberApplication[]> => {
  await delay(500);
  return [...members];
};

export const getMemberById = async (id: string): Promise<MemberApplication | undefined> => {
  await delay(200);
  return members.find(m => m.id === id);
}

export const addMember = async (application: Omit<MemberApplication, 'id' | 'status' | 'registrationDate'>): Promise<MemberApplication> => {
  await delay(1000);
  const newMember: MemberApplication = {
    ...application,
    id: `mem-${Date.now()}`,
    status: MembershipStatus.PENDING_CHAIRMAN,
    registrationDate: new Date().toISOString(),
  };
  members.push(newMember);
  saveData('nampdtech-members', members);
  return newMember;
};

export const updateMember = async (id: string, updates: Partial<MemberApplication>): Promise<MemberApplication | undefined> => {
  await delay(500);
  const memberIndex = members.findIndex(m => m.id === id);
  if (memberIndex > -1) {
    members[memberIndex] = { ...members[memberIndex], ...updates };
    saveData('nampdtech-members', members);
    return members[memberIndex];
  }
  return undefined;
};

export const getPayments = async (): Promise<Payment[]> => {
  await delay(500);
  return [...payments];
};

export const addPayment = async (
    { member, type, amount, gateway, status, paymentProofUrl }: 
    { member: MemberApplication, type: 'Registration Fee' | 'Annual Dues', amount: number, gateway: PaymentGateway, status: PaymentStatus, paymentProofUrl?: string }
): Promise<Payment> => {
    await delay(1000);
    const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        memberId: member.id,
        memberName: member.fullName,
        state: member.state,
        amount,
        type,
        date: new Date().toISOString(),
        status,
        gateway,
        paymentProofUrl,
    };
    payments.push(newPayment);
    saveData('nampdtech-payments', payments);
    return newPayment;
}

export const updatePayment = async (id: string, updates: Partial<Payment>): Promise<Payment | undefined> => {
    await delay(500);
    const paymentIndex = payments.findIndex(p => p.id === id);
    if (paymentIndex > -1) {
        payments[paymentIndex] = { ...payments[paymentIndex], ...updates };
        saveData('nampdtech-payments', payments);
        return payments[paymentIndex];
    }
    return undefined;
}

export const getPaymentsByMemberId = async (memberId: string): Promise<Payment[]> => {
    await delay(300);
    return payments.filter(p => p.memberId === memberId);
}
