import { create } from 'zustand';
import { Patient } from '../types';

interface PatientsState {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  getPatientById: (id: string) => Patient | undefined;
}

// Mock patient data for demo purposes
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    dateOfBirth: '1985-04-12',
    gender: 'female',
    contact: {
      phone: '(555) 123-4567',
      email: 'sarah.j@example.com',
      address: '123 Main St, Anytown, CA 94321',
    },
    insuranceInfo: {
      provider: 'Blue Shield',
      policyNumber: 'BS12345678',
    },
    medicalHistory: [
      {
        id: '101',
        condition: 'Asthma',
        diagnosedDate: '2010-06-15',
        notes: 'Mild, controlled with inhaler',
      },
      {
        id: '102',
        condition: 'Hypertension',
        diagnosedDate: '2018-03-22',
        notes: 'Managed with daily medication',
      },
    ],
  },
  {
    id: '2',
    name: 'Michael Chen',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    contact: {
      phone: '(555) 987-6543',
      email: 'm.chen@example.com',
      address: '456 Oak Ave, Somewhere, NY 10001',
    },
    insuranceInfo: {
      provider: 'Aetna',
      policyNumber: 'AE87654321',
    },
    medicalHistory: [
      {
        id: '201',
        condition: 'Type 2 Diabetes',
        diagnosedDate: '2015-08-03',
        notes: 'Well-controlled with diet and medication',
      },
    ],
  },
  {
    id: '3',
    name: 'Emily Wilson',
    dateOfBirth: '1992-07-17',
    gender: 'female',
    contact: {
      phone: '(555) 456-7890',
      email: 'e.wilson@example.com',
      address: '789 Pine Rd, Elsewhere, TX 75001',
    },
    insuranceInfo: {
      provider: 'UnitedHealthcare',
      policyNumber: 'UH98765432',
    },
  },
  {
    id: '4',
    name: 'Robert Martinez',
    dateOfBirth: '1965-02-28',
    gender: 'male',
    contact: {
      phone: '(555) 234-5678',
      email: 'r.martinez@example.com',
      address: '321 Cedar Ln, Nowhere, FL 33101',
    },
    insuranceInfo: {
      provider: 'Medicare',
      policyNumber: 'MC12345678',
    },
    medicalHistory: [
      {
        id: '301',
        condition: 'Coronary Artery Disease',
        diagnosedDate: '2012-11-15',
        notes: 'History of stent placement, 2012',
      },
      {
        id: '302',
        condition: 'Osteoarthritis',
        diagnosedDate: '2018-05-20',
        notes: 'Affecting knees and hips',
      },
    ],
  },
];

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  isLoading: false,
  error: null,
  
  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would fetch this data from your backend
      set({ patients: mockPatients, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch patients', isLoading: false });
    }
  },
  
  getPatientById: (id: string) => {
    return get().patients.find(patient => patient.id === id);
  },
}));