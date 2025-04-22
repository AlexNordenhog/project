// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'admin' | 'staff';
  avatar?: string;
}

// Patient types
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contact: {
    phone: string;
    email?: string;
    address?: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
  };
  medicalHistory?: MedicalHistory[];
}

export interface MedicalHistory {
  id: string;
  condition: string;
  diagnosedDate: string;
  notes?: string;
}

// Appointment types
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'check-up' | 'follow-up' | 'emergency' | 'consultation';
  notes?: string;
}

// Transcription types
export interface Transcription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  content: string;
  tags?: string[];
  status: 'draft' | 'final';
  lastUpdated: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: string;
}