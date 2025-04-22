import { create } from 'zustand';
import { Transcription } from '../types';

interface TranscriptionsState {
  transcriptions: Transcription[];
  isLoading: boolean;
  error: string | null;
  fetchTranscriptions: () => Promise<void>;
  getTranscriptionById: (id: string) => Transcription | undefined;
  addTranscription: (transcription: Omit<Transcription, 'id' | 'lastUpdated'>) => Promise<void>;
  updateTranscription: (id: string, updates: Partial<Transcription>) => Promise<void>;
}

// Mock transcription data
const mockTranscriptions: Transcription[] = [
  {
    id: '1',
    appointmentId: '101',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: '2023-04-15',
    content: `Patient presents with recurring headaches, primarily in the frontal region. She describes the pain as "throbbing" and rates it 7/10 at its worst. Symptoms have been present for approximately 2 weeks.
    
    Examination reveals no neurological deficits. Vitals are stable. No fever or signs of infection.
    
    Assessment: Tension headaches, likely exacerbated by reported workplace stress.
    
    Plan: Prescribed ibuprofen 400mg every 6 hours as needed for pain. Recommended stress reduction techniques and adequate hydration. Patient to return in 2 weeks if symptoms persist or worsen. Discussed possible referral to neurology if no improvement.`,
    tags: ['headache', 'stress', 'pain management'],
    status: 'final',
    lastUpdated: '2023-04-15T16:30:00Z',
  },
  {
    id: '2',
    appointmentId: '102',
    patientId: '2',
    patientName: 'Michael Chen',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: '2023-04-16',
    content: `Follow-up appointment for Type 2 Diabetes management. Patient reports improved compliance with medication regimen and dietary recommendations.
    
    Blood glucose readings (from patient's log): Fasting - average 130 mg/dL (range 110-145). Post-meal - average 180 mg/dL (range 160-210).
    
    Recent HbA1c: 7.2% (improved from 8.1% 3 months ago)
    
    Assessment: Improving diabetic control, but not yet at target.
    
    Plan: Continue current medication. Reinforced importance of consistent carbohydrate counting. Provided additional resources for meal planning. Scheduled next HbA1c test for 3 months. Will consider medication adjustment at next visit if targets not met.`,
    tags: ['diabetes', 'follow-up', 'medication management'],
    status: 'final',
    lastUpdated: '2023-04-16T14:45:00Z',
  },
  {
    id: '3',
    appointmentId: '103',
    patientId: '3',
    patientName: 'Emily Wilson',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: '2023-04-17',
    content: `Patient presents for annual physical examination. No specific complaints reported. Generally feeling well.
    
    Review of systems negative for significant issues. Patient reports regular exercise 3x weekly. Non-smoker. Occasional alcohol use (1-2 drinks/week).
    
    Vitals: BP 118/76, HR 68, Temp 98.6°F, RR 14, O2 sat 99%.
    
    Physical examination unremarkable. Labs ordered: CBC, CMP, lipid panel, TSH.
    
    Assessment: Healthy adult female. Preventive care up-to-date.
    
    Plan: Continue current lifestyle. Review labs when available. Recommended age-appropriate cancer screenings discussed. Flu vaccine administered today.`,
    tags: ['annual exam', 'preventive care'],
    status: 'final',
    lastUpdated: '2023-04-17T11:15:00Z',
  },
  {
    id: '4',
    appointmentId: '104',
    patientId: '4',
    patientName: 'Robert Martinez',
    doctorId: '1',
    doctorName: 'Dr. Jane Smith',
    date: '2023-04-18',
    content: `Patient presents with increasing knee pain, particularly in right knee. Reports pain is worse with climbing stairs and after prolonged walking. Minimal relief with OTC NSAIDs.
    
    Examination shows mild swelling of right knee. Range of motion limited by pain. No erythema or increased warmth.
    
    X-ray results (from last month): Moderate degenerative changes, osteophyte formation, joint space narrowing consistent with osteoarthritis.
    
    Assessment: Osteoarthritis of the right knee with acute exacerbation.
    
    Plan: Prescribed meloxicam 15mg daily with gastroprotection. Discussed weight management strategies. Referral to physical therapy for strengthening exercises. Consider orthopedic consultation if no improvement in 4-6 weeks.`,
    tags: ['osteoarthritis', 'pain management', 'knee pain'],
    status: 'draft',
    lastUpdated: '2023-04-18T09:30:00Z',
  },
];

export const useTranscriptionsStore = create<TranscriptionsState>((set, get) => ({
  transcriptions: [],
  isLoading: false,
  error: null,
  
  fetchTranscriptions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would fetch this data from your backend
      set({ transcriptions: mockTranscriptions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transcriptions', isLoading: false });
    }
  },
  
  getTranscriptionById: (id: string) => {
    return get().transcriptions.find(transcription => transcription.id === id);
  },
  
  addTranscription: async (transcription) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new ID and timestamp for the transcription
      const newTranscription: Transcription = {
        ...transcription,
        id: Math.random().toString(36).substring(2, 11),
        lastUpdated: new Date().toISOString(),
      };
      
      set(state => ({
        transcriptions: [...state.transcriptions, newTranscription],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add transcription', isLoading: false });
    }
  },
  
  updateTranscription: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        transcriptions: state.transcriptions.map(transcription =>
          transcription.id === id
            ? { ...transcription, ...updates, lastUpdated: new Date().toISOString() }
            : transcription
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update transcription', isLoading: false });
    }
  },
}));