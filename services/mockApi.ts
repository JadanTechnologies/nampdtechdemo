import { MemberApplication, MembershipStatus, Payment, PaymentGateway, PaymentStatus, User, AdminAction, Communication, UserRole, Role, Template, InAppNotification, ALL_PERMISSIONS, ChatMessage } from '../types';
import { MOCK_MEMBERS, MOCK_PAYMENTS, MOCK_USERS, NIGERIAN_STATES } from '../constants';

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

const MOCK_ROLES: Role[] = [
    { id: 'role-super-admin', name: 'Super Admin', description: 'Has all permissions.', permissions: ALL_PERMISSIONS },
    { id: 'role-state-admin', name: 'State Admin', description: 'Manages members and approvals for a specific state.', permissions: ['manage_members', 'approve_applications', 'view_financials'] },
    { id: 'role-chairman', name: 'Chairman', description: 'First level of approval for new members.', permissions: ['approve_applications'] },
    { id: 'role-member', name: 'Member', description: 'Standard member account.', permissions: [] },
]

let members: MemberApplication[] = initializeData('nampdtech-members', MOCK_MEMBERS);
let payments: Payment[] = initializeData('nampdtech-payments', MOCK_PAYMENTS);
let adminActions: AdminAction[] = initializeData('nampdtech-admin-actions', []);
let communications: Communication[] = initializeData('nampdtech-communications', []);
let roles: Role[] = initializeData('nampdtech-roles', MOCK_ROLES);
let templates: Template[] = initializeData('nampdtech-templates', []);
let notifications: InAppNotification[] = initializeData('nampdtech-notifications', []);
let chatMessages: ChatMessage[] = initializeData('nampdtech-chat-messages', []);

// Seed initial chat messages if none exist
if (chatMessages.length === 0) {
    chatMessages = [
        { id: 'msg-1', channelId: 'Lagos', senderId: 'user-004', senderName: 'Bisi Adekunle', senderRole: UserRole.MEMBER, content: 'Hello everyone in Lagos! Glad to be here.', type: 'text', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { id: 'msg-2', channelId: 'Lagos', senderId: 'user-003', senderName: 'Chairman (Lagos)', senderRole: UserRole.CHAIRMAN, content: 'Welcome Bisi! Feel free to ask any questions.', type: 'text', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
        { id: 'msg-3', channelId: 'General', senderId: 'user-006', senderName: 'Musa Ibrahim', senderRole: UserRole.MEMBER, content: 'Good morning all technicians.', type: 'text', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    ];
    localStorage.setItem('nampdtech-chat-messages', JSON.stringify(chatMessages));
}


const saveData = <T,>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let onlineStatusInterval: number | null = null;

// Initialize isOnline status if not present
members.forEach(m => {
    if (m.isOnline === undefined) {
        m.isOnline = Math.random() > 0.7; // default to mostly offline
    }
});
saveData('nampdtech-members', members);


export const startOnlineStatusSimulator = () => {
    if (onlineStatusInterval) return;
    console.log("Starting online status simulator...");
    onlineStatusInterval = window.setInterval(() => {
        const memberToToggle = members[Math.floor(Math.random() * members.length)];
        if(memberToToggle) {
            memberToToggle.isOnline = !memberToToggle.isOnline;
            saveData('nampdtech-members', members);
        }
    }, 5000); // Toggle a random user every 5 seconds
};

export const stopOnlineStatusSimulator = () => {
    if (onlineStatusInterval) {
        console.log("Stopping online status simulator.");
        clearInterval(onlineStatusInterval);
        onlineStatusInterval = null;
    }
};


// Notification Helper
const createNotification = (message: string, link?: string) => {
    const newNotification: InAppNotification = {
        id: `notif-${Date.now()}`,
        message,
        link,
        read: false,
        date: new Date().toISOString()
    };
    notifications.unshift(newNotification);
    saveData('nampdtech-notifications', notifications);
}


// Member Functions
export const getMembers = async (): Promise<MemberApplication[]> => {
  await delay(500);
  // Re-read from storage to ensure we have the latest data
  members = initializeData('nampdtech-members', MOCK_MEMBERS);
  return [...members].filter(m => m.status !== MembershipStatus.DELETED);
};

export const getMemberById = async (id: string): Promise<MemberApplication | undefined> => {
  await delay(200);
  // Re-read from storage to ensure we have the latest data, as this can be called from a public page
  const currentMembers: MemberApplication[] = initializeData('nampdtech-members', MOCK_MEMBERS);
  return currentMembers.find(m => m.id === id);
}

export const addMember = async (application: Omit<MemberApplication, 'id' | 'status' | 'registrationDate' | 'accountStatus' | 'forumStatus' | 'isOnline'>): Promise<MemberApplication> => {
  await delay(1000);
  const newMember: MemberApplication = {
    ...application,
    id: `mem-${Date.now()}`,
    status: MembershipStatus.PENDING_CHAIRMAN,
    accountStatus: 'Active',
    forumStatus: 'active',
    isOnline: false,
    registrationDate: new Date().toISOString(),
  };
  members.push(newMember);
  saveData('nampdtech-members', members);
  createNotification(`New member registration: ${newMember.fullName}`, `/approvals`);
  return newMember;
};

export const updateMember = async (id: string, updates: Partial<MemberApplication>): Promise<MemberApplication | undefined> => {
  await delay(500);
  const memberIndex = members.findIndex(m => m.id === id);
  if (memberIndex > -1) {
    const oldStatus = members[memberIndex].status;
    members[memberIndex] = { ...members[memberIndex], ...updates };
    saveData('nampdtech-members', members);

    if (updates.status && updates.status !== oldStatus) {
         createNotification(`Membership status for ${members[memberIndex].fullName} updated to ${updates.status}.`, `/members`);
    }
    if (updates.forumStatus) {
        createNotification(`Forum status for ${members[memberIndex].fullName} updated to ${updates.forumStatus}.`);
    }

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
    if(status === PaymentStatus.PENDING_CONFIRMATION){
        createNotification(`New manual payment from ${member.fullName} requires approval.`, `/payment-approvals`);
    }
    return newPayment;
}

export const updatePayment = async (id: string, updates: Partial<Payment>): Promise<Payment | undefined> => {
    await delay(500);
    const paymentIndex = payments.findIndex(p => p.id === id);
    if (paymentIndex > -1) {
        payments[paymentIndex] = { ...payments[paymentIndex], ...updates };
        saveData('nampdtech-payments', payments);
        if(updates.status === PaymentStatus.PAID) {
            createNotification(`Payment from ${payments[paymentIndex].memberName} has been approved.`, `/financials`);
        }
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
    createNotification(`New admin action request for ${action.memberName} from ${action.requesterRole}.`, `/admin-actions`);
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
    createNotification(`New announcement: "${newComm.title}"`, `/dashboard`);
    return newComm;
}


// Role Functions
export const getRoles = async (): Promise<Role[]> => {
    await delay(300);
    return [...roles];
};

export const addRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
    await delay(500);
    const newRole: Role = { ...role, id: `role-${Date.now()}` };
    roles.push(newRole);
    saveData('nampdtech-roles', roles);
    return newRole;
};

export const updateRole = async (id: string, updates: Partial<Role>): Promise<Role | undefined> => {
    await delay(500);
    const roleIndex = roles.findIndex(r => r.id === id);
    if (roleIndex > -1) {
        roles[roleIndex] = { ...roles[roleIndex], ...updates };
        saveData('nampdtech-roles', roles);
        return roles[roleIndex];
    }
    return undefined;
};

export const deleteRole = async (id: string): Promise<boolean> => {
    await delay(500);
    const initialLength = roles.length;
    roles = roles.filter(r => r.id !== id);
    if (roles.length < initialLength) {
        saveData('nampdtech-roles', roles);
        return true;
    }
    return false;
};

// Template Functions
export const getTemplates = async (): Promise<Template[]> => {
    await delay(300);
    return [...templates];
};

export const addTemplate = async (template: Omit<Template, 'id'>): Promise<Template> => {
    await delay(500);
    const newTemplate: Template = { ...template, id: `tpl-${Date.now()}` };
    templates.push(newTemplate);
    saveData('nampdtech-templates', templates);
    return newTemplate;
};

export const updateTemplate = async (id: string, updates: Partial<Template>): Promise<Template | undefined> => {
    await delay(500);
    const templateIndex = templates.findIndex(t => t.id === id);
    if (templateIndex > -1) {
        templates[templateIndex] = { ...templates[templateIndex], ...updates };
        saveData('nampdtech-templates', templates);
        return templates[templateIndex];
    }
    return undefined;
};

export const deleteTemplate = async (id: string): Promise<boolean> => {
    await delay(500);
    const initialLength = templates.length;
    templates = templates.filter(t => t.id !== id);
    if (templates.length < initialLength) {
        saveData('nampdtech-templates', templates);
        return true;
    }
    return false;
};


// Notification Functions
export const getNotifications = async (): Promise<InAppNotification[]> => {
    await delay(200);
    return [...notifications];
};

export const markNotificationAsRead = async (id: string): Promise<InAppNotification | undefined> => {
    await delay(100);
    const notifIndex = notifications.findIndex(n => n.id === id);
    if(notifIndex > -1) {
        notifications[notifIndex].read = true;
        saveData('nampdtech-notifications', notifications);
        return notifications[notifIndex];
    }
    return undefined;
};

export const markAllNotificationsAsRead = async (): Promise<InAppNotification[]> => {
    await delay(300);
    notifications.forEach(n => n.read = true);
    saveData('nampdtech-notifications', notifications);
    return [...notifications];
};

// Community Hub Functions
export const getChannels = async (): Promise<string[]> => {
    await delay(100);
    return ['General', ...NIGERIAN_STATES];
}

export const getMessages = async (channelId: string): Promise<ChatMessage[]> => {
    await delay(300);
    return chatMessages
        .filter(m => m.channelId === channelId)
        .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export const addMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
    await delay(200);
    const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString()
    };
    chatMessages.push(newMessage);
    saveData('nampdtech-chat-messages', chatMessages);
    return newMessage;
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