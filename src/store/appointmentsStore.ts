import { create } from 'zustand';
import { format, addDays } from 'date-fns';
import { Appointment } from '../types';

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  getAppointmentById: (id: string) => Appointment | undefined;
  getUpcomingAppointments: () => Appointment[];
  getRecentAppointments: () => Appointment[];
}

// Create mock appointment data
const today = new Date();
const mockAppointments: Appointment[] = [
  {
    id: '101',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: format(today, 'yyyy-MM-dd'),
    time: '09:00',
    status: 'scheduled',
    type: 'follow-up',
    notes: 'Follow-up on headache treatment',
  },
  {
    id: '102',
    patientId: '2',
    patientName: 'Michael Chen',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    time: '10:30',
    status: 'scheduled',
    type: 'follow-up',
    notes: 'Diabetes management check',
  },
  {
    id: '103',
    patientId: '3',
    patientName: 'Emily Wilson',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: format(addDays(today, -1), 'yyyy-MM-dd'),
    time: '14:00',
    status: 'completed',
    type: 'check-up',
    notes: 'Annual physical examination',
  },
  {
    id: '104',
    patientId: '4',
    patientName: 'Robert Martinez',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: format(addDays(today, -2), 'yyyy-MM-dd'),
    time: '11:15',
    status: 'completed',
    type: 'consultation',
    notes: 'Knee pain consultation',
  },
  {
    id: '105',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: format(addDays(today, 3), 'yyyy-MM-dd'),
    time: '15:45',
    status: 'scheduled',
    type: 'follow-up',
    notes: 'Review lab results',
  },
  {
    id: '106',
    patientId: '3',
    patientName: 'Emily Wilson',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    time: '08:30',
    status: 'scheduled',
    type: 'consultation',
    notes: 'Discussion of preventative care options',
  },
];

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,
  
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would fetch this data from your backend
      set({ appointments: mockAppointments, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch appointments', isLoading: false });
    }
  },
  
  getAppointmentById: (id: string) => {
    return get().appointments.find(appointment => appointment.id === id);
  },
  
  getUpcomingAppointments: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return get().appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= today && appointment.status === 'scheduled';
      })
      .sort((a, b) => {
        // Sort by date and then by time
        if (a.date !== b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return a.time.localeCompare(b.time);
      });
  },
  
  getRecentAppointments: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return get().appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate < today || appointment.status === 'completed';
      })
      .sort((a, b) => {
        // Sort by date (most recent first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  },
}));