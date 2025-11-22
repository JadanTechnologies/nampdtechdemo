
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
  PENDING_MANUAL_PAYMENT_CONFIRMATION = 'Pending Manual Payment Confirmation',
  ACTIVE = 'Active',
  REJECTED = 'Rejected',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
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
