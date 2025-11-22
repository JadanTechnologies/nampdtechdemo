
import { MemberApplication, MembershipStatus, Payment, PaymentGateway, PaymentStatus, User, AdminAction, Communication, UserRole } from '../types';
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
let adminActions: AdminAction[] = initializeData('nampdtech-admin-actions', []);
let communications: Communication[] = initializeData('nampdtech-communications', []);


const saveData = <T,>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Member Functions
export const getMembers = async (): Promise<MemberApplication[]> => {
  await delay(500);
  return [...members].filter(m => m.status !== MembershipStatus.DELETED);
};

export const getMemberById = async (id: string): Promise<MemberApplication | undefined> => {
  await delay(200);
  return members.find(m => m.id === id);
}

export const addMember = async (application: Omit<MemberApplication, 'id' | 'status' | 'registrationDate' | 'accountStatus'>): Promise<MemberApplication> => {
  await delay(1000);
  const newMember: MemberApplication = {
    ...application,
    id: `mem-${Date.now()}`,
    status: MembershipStatus.PENDING_CHAIRMAN,
    accountStatus: 'Active',
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

// Payment Functions
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

// Admin Action Functions
export const getAdminActions = async (): Promise<AdminAction[]> => {
    await delay(400);
    return [...adminActions];
};

export const addAdminAction = async (action: Omit<AdminAction, 'id' | 'dateRequested' | 'status'>): Promise<AdminAction> => {
    await delay(500);
    const newAction: AdminAction = {
        ...action,
        id: `act-${Date.now()}`,
        status: 'Pending',
        dateRequested: new Date().toISOString(),
    };
    adminActions.push(newAction);
    saveData('nampdtech-admin-actions', adminActions);
    return newAction;
};

export const updateAdminAction = async (id: string, updates: Partial<AdminAction>): Promise<AdminAction | undefined> => {
    await delay(500);
    const actionIndex = adminActions.findIndex(a => a.id === id);
    if (actionIndex > -1) {
        adminActions[actionIndex] = { ...adminActions[actionIndex], ...updates };
        saveData('nampdtech-admin-actions', adminActions);
        return adminActions[actionIndex];
    }
    return undefined;
};


// Communication Functions
export const getCommunications = async (): Promise<Communication[]> => {
    await delay(300);
    return [...communications];
}

export const addCommunication = async (comm: Omit<Communication, 'id' | 'date'>): Promise<Communication> => {
    await delay(700);
    const newComm: Communication = {
        ...comm,
        id: `comm-${Date.now()}`,
        date: new Date().toISOString()
    };
    communications.unshift(newComm); // Add to the beginning
    saveData('nampdtech-communications', communications);
    return newComm;
}

// Simulated Cron Job
export const checkAndCreateAnnualDues = async () => {
    console.log("Running simulated cron job: Checking for annual dues...");
    const activeMembers = members.filter(m => m.status === MembershipStatus.ACTIVE);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    for (const member of activeMembers) {
        const registrationDate = new Date(member.registrationDate);
        const memberPayments = payments.filter(p => p.memberId === member.id && p.type === 'Annual Dues');
        const lastDuesPayment = memberPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        // If no annual dues paid, or last one was over a year ago
        if (!lastDuesPayment || new Date(lastDuesPayment.date) < oneYearAgo) {
            // Check if they registered more than a year ago (or last payment was over a year ago)
             if (registrationDate < oneYearAgo) {
                 // Check if there isn't already a pending annual dues payment
                 const hasPendingDues = payments.some(p => p.memberId === member.id && p.type === 'Annual Dues' && p.status === PaymentStatus.PENDING_CONFIRMATION);
                 if (!hasPendingDues) {
                    console.log(`Creating annual dues payment for ${member.fullName}`);
                    // This would ideally create a PENDING payment, but for simplicity, we'll just log it.
                    // In a real scenario:
                    /*
                    await addPayment({
                        member: member,
                        type: 'Annual Dues',
                        amount: 5000, // Or from settings
                        gateway: PaymentGateway.MANUAL, // or a default
                        status: PaymentStatus.PENDING_CONFIRMATION // or a new 'DUE' status
                    });
                    */
                 }
             }
        }
    }
}
