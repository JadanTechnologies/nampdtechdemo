import { User, UserRole, MemberApplication, MembershipStatus, Payment, PaymentStatus, PaymentGateway } from './types';

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
];

const createInitialMembers = (): MemberApplication[] => {
    const today = new Date();
    const members: MemberApplication[] = [
        { id: 'mem-001', userId: 'user-004', fullName: 'Bisi Adekunle', nin: '12345678901', phone: '08012345678', email: 'member@test.com', state: 'Lagos', lga: 'Ikeja', businessName: 'Bisi\'s Ventures', businessAddress: '123 Allen Avenue, Ikeja', passportPhotoUrl: 'https://picsum.photos/seed/mem001/200/200', ninSlipUrl: 'https://picsum.photos/seed/nin001/400/250', status: MembershipStatus.ACTIVE, accountStatus: 'Active', forumStatus: 'active', isOnline: true, registrationDate: new Date(today.setDate(today.getDate() - 30)).toISOString() },
        { id: 'mem-002', userId: 'user-005', fullName: 'Chidi Okoro', nin: '23456789012', phone: '08023456789', email: 'pending@test.com', state: 'Rivers', lga: 'Port Harcourt', status: MembershipStatus.PENDING_CHAIRMAN, accountStatus: 'Active', forumStatus: 'active', isOnline: false, registrationDate: new Date(today.setDate(today.getDate() - 5)).toISOString() },
        { id: 'mem-003', userId: 'user-006', fullName: 'Fatima Bello', nin: '34567890123', phone: '08034567890', email: 'payment@test.com', state: 'Kano', lga: 'Kano', status: MembershipStatus.PENDING_PAYMENT, accountStatus: 'Active', forumStatus: 'active', isOnline: true, registrationDate: new Date(today.setDate(today.getDate() - 10)).toISOString() },
        { id: 'mem-004', userId: 'user-007', fullName: 'David Samuel', nin: '45678901234', phone: '08045678901', email: 'state@test.com', state: 'Lagos', lga: 'Surulere', status: MembershipStatus.PENDING_STATE, accountStatus: 'Active', forumStatus: 'active', isOnline: false, registrationDate: new Date(today.setDate(today.getDate() - 2)).toISOString() },
        { id: 'mem-005', userId: 'user-008', fullName: 'Ngozi Eze', nin: '56789012345', phone: '08056789012', email: 'rejected@test.com', state: 'Enugu', lga: 'Enugu', status: MembershipStatus.REJECTED, accountStatus: 'Deactivated', forumStatus: 'banned', isOnline: false, registrationDate: new Date(today.setDate(today.getDate() - 15)).toISOString() },
        { id: 'mem-006', userId: 'user-009', fullName: 'Musa Ibrahim', nin: '67890123456', phone: '08067890123', email: 'musa@test.com', state: 'Kaduna', lga: 'Kaduna', status: MembershipStatus.ACTIVE, accountStatus: 'Active', forumStatus: 'active', isOnline: true, registrationDate: new Date(today.setDate(today.getDate() - 60)).toISOString() },
    ];
    return members;
};


export const MOCK_USERS: User[] = [
  { id: 'user-001', email: 'superadmin@test.com', role: UserRole.SUPER_ADMIN },
  { id: 'user-002', email: 'stateadmin@test.com', role: UserRole.STATE_ADMIN, state: 'Lagos' },
  { id: 'user-003', email: 'chairman@test.com', role: UserRole.CHAIRMAN, state: 'Lagos' },
  { id: 'user-004', email: 'member@test.com', role: UserRole.MEMBER, memberDetails: createInitialMembers().find(m => m.id === 'mem-001') },
  { id: 'user-005', email: 'pending@test.com', role: UserRole.MEMBER, memberDetails: createInitialMembers().find(m => m.id === 'mem-002') },
  { id: 'user-006', email: 'payment@test.com', role: UserRole.MEMBER, memberDetails: createInitialMembers().find(m => m.id === 'mem-003') },
  { id: 'user-007', email: 'state@test.com', role: UserRole.MEMBER, memberDetails: createInitialMembers().find(m => m.id === 'mem-004') },
  { id: 'user-008', email: 'rejected@test.com', role: UserRole.MEMBER, memberDetails: createInitialMembers().find(m => m.id === 'mem-005') },
];

export const MOCK_MEMBERS: MemberApplication[] = createInitialMembers();

export const MOCK_PAYMENTS: Payment[] = [
    { id: 'pay-001', memberId: 'mem-001', memberName: 'Bisi Adekunle', state: 'Lagos', amount: 10000, type: 'Registration Fee', date: new Date(new Date().setDate(new Date().getDate() - 29)).toISOString(), status: PaymentStatus.PAID, gateway: PaymentGateway.PAYSTACK },
    { id: 'pay-002', memberId: 'mem-001', memberName: 'Bisi Adekunle', state: 'Lagos', amount: 5000, type: 'Annual Dues', date: new Date(new Date().setDate(new Date().getDate() - 29)).toISOString(), status: PaymentStatus.PAID, gateway: PaymentGateway.PAYSTACK },
    { id: 'pay-003', memberId: 'mem-006', memberName: 'Musa Ibrahim', state: 'Kaduna', amount: 10000, type: 'Registration Fee', date: new Date(new Date().setDate(new Date().getDate() - 59)).toISOString(), status: PaymentStatus.PAID, gateway: PaymentGateway.MANUAL },
    { id: 'pay-004', memberId: 'mem-006', memberName: 'Musa Ibrahim', state: 'Kaduna', amount: 5000, type: 'Annual Dues', date: new Date(new Date().setDate(new Date().getDate() - 59)).toISOString(), status: PaymentStatus.PAID, gateway: PaymentGateway.MANUAL },
];