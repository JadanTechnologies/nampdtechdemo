export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  STATE_ADMIN = 'State Admin',
  CHAIRMAN = 'Chairman',
  MEMBER = 'Member',
}

export enum PaymentGateway {
  PAYSTACK = 'Paystack',
  MONNIFY = 'Monnify',
  FLUTTERWAVE = 'Flutterwave',
  MANUAL = 'Manual Bank Transfer',
}

export enum PaymentStatus {
  PENDING_CONFIRMATION = 'Pending Confirmation',
  PAID = 'Paid',
  REJECTED = 'Rejected',
}

export enum MembershipStatus {
  PENDING_CHAIRMAN = 'Pending Chairman Approval',
  PENDING_STATE = 'Pending State Admin Approval',
  PENDING_PAYMENT = 'Pending Payment',
  // FIX: Corrected typo from PAYMANT to PAYMENT
  PENDING_MANUAL_PAYMENT_CONFIRMATION = 'Pending Manual Payment Confirmation',
  ACTIVE = 'Active',
  REJECTED = 'Rejected',
  DELETED = 'Deleted', // Added for soft deletes
}

export type AccountStatus = 'Active' | 'Suspended' | 'Banned' | 'Deactivated';
export type AdminActionType = 'Suspend' | 'Ban' | 'Deactivate' | 'Reactivate' | 'Delete' | 'Update';


export interface User {
  id: string;
  email: string;
  role: UserRole; // This remains the base, hardcoded role
  customRoleId?: string; // For staff with custom roles
  state?: string; // For State Admins and Chairmen
  memberDetails?: MemberApplication;
}

export interface MemberApplication {
  id: string;
  userId: string;
  fullName: string;
  nin: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  businessName?: string;
  businessAddress?: string;
  passportPhotoUrl?: string;
  ninSlipUrl?: string;
  businessDocUrl?: string;
  status: MembershipStatus;
  accountStatus: AccountStatus;
  registrationDate: string;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  state: string;
  amount: number;
  type: 'Registration Fee' | 'Annual Dues';
  date: string;
  status: PaymentStatus;
  gateway: PaymentGateway;
  paymentProofUrl?: string;
}

export interface FileUpload {
    file: File;
    progress: number;
    url: string;
}

export interface AdminAction {
  id: string;
  memberId: string;
  memberName: string;
  action: AdminActionType;
  requestedBy: string; // User ID of the admin who requested it
  requesterRole: UserRole;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateRequested: string;
  dateResolved?: string;
  notes?: string;
}

export interface Communication {
    id: string;
    title: string;
    content: string;
    targetRoles: (UserRole | string)[]; // Can target base roles or custom role IDs
    author: string;
    date: string;
}

// For RBAC system
export type Permission = 
  | 'manage_members' // Suspend, ban, etc.
  | 'approve_applications' // Approve/reject new members
  | 'approve_payments' // Approve manual payments
  | 'view_financials' // View financial dashboard
  | 'manage_settings' // Change platform settings
  | 'send_communications' // Send announcements
  | 'manage_roles' // Create, edit, delete roles
  | 'manage_templates' // Manage SMS/Email templates
  | 'host_conferences'; // Host live conferences

export const ALL_PERMISSIONS: Permission[] = [
    'manage_members', 'approve_applications', 'approve_payments', 'view_financials', 'manage_settings', 
    'send_communications', 'manage_roles', 'manage_templates', 'host_conferences'
];


export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
}

export interface Template {
    id: string;
    name: string;
    type: 'sms' | 'email';
    content: string;
}

export interface InAppNotification {
    id: string;
    message: string;
    read: boolean;
    date: string;
    link?: string; // e.g., /approvals/mem-123
}

export interface MaintenanceSettings {
    enabled: boolean;
    message: string;
    scheduled: boolean;
    startTime: string;
    endTime: string;
}

export interface ConferenceSettings {
    provider: 'agora' | 'zego' | 'none';
}

export interface ApiKeySettings {
    // Communication
    twilioSid: string;
    twilioAuthToken: string;
    resendApiKey: string;
    firebaseApiKey: string;
    // Conference
    agoraAppId: string;
    agoraAppCert: string;
    zegoAppId: string;
    zegoServerSecret: string;
    // Payments
    paystackPublicKey: string;
    paystackSecretKey: string;
    flutterwavePublicKey: string;
    flutterwaveSecretKey: string;
    monnifyApiKey: string;
    monnifyContractCode: string;
}