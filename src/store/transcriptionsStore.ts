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
    content: `Patienten upplever återkommande huvudvärk, främst i den främre delen av huvudet. Hon beskriver smärtan som "pulserande" och graderar den till 7/10 vid värsta tillfället. Symptomen har pågått i cirka 2 veckor.
    
    Undersökning visar inga neurologiska avvikelser. Vitala tecken är stabila. Ingen feber eller tecken på infektion.
    
    Bedömning: Spänningshuvudvärk, troligen förvärrad av rapporterad arbetsrelaterad stress.
    
    Plan: Förskrivet ibuprofen 400 mg var 6:e timme vid behov för smärta. Rekommenderade stressreducerande tekniker och tillräcklig vätsketillförsel. Patienten ska återkomma om 2 veckor om symptomen kvarstår eller förvärras. Diskuterade eventuell remiss till neurologi om ingen förbättring sker.`,
    tags: ['huvudvärk', 'stress', 'smärthantering'],
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
    content: `Uppföljningsbesök för hantering av typ 2-diabetes. Patienten rapporterar förbättrad följsamhet till medicinering och kostrekommendationer.
    
    Blodsockervärden (från patientens logg): Fastande - genomsnitt 130 mg/dL (intervall 110-145). Efter måltid - genomsnitt 180 mg/dL (intervall 160-210).
    
    Senaste HbA1c: 7,2 % (förbättrat från 8,1 % för 3 månader sedan)
    
    Bedömning: Förbättrad diabeteskontroll, men ännu inte på målnivå.
    
    Plan: Fortsätt med nuvarande medicinering. Förstärkte vikten av konsekvent kolhydraträkning. Tillhandahöll ytterligare resurser för måltidsplanering. Planerade nästa HbA1c-test om 3 månader. Kommer att överväga medicinjustering vid nästa besök om målen inte uppnås.`,
    tags: ['diabetes', 'uppföljning', 'medicineringshantering'],
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
    content: `Patienten kommer för årlig hälsokontroll. Inga specifika klagomål rapporterade. Känner sig generellt välmående.
    
    Genomgång av system visar inga betydande problem. Patienten rapporterar regelbunden träning 3 gånger i veckan. Icke-rökare. Tillfällig alkoholkonsumtion (1-2 drinkar/vecka).
    
    Vitala tecken: Blodtryck 118/76, puls 68, temperatur 98,6°F, andningsfrekvens 14, syremättnad 99 %.
    
    Fysisk undersökning utan anmärkning. Beställda prover: CBC, CMP, lipidpanel, TSH.
    
    Bedömning: Frisk vuxen kvinna. Förebyggande vård är uppdaterad.
    
    Plan: Fortsätt nuvarande livsstil. Granska prover när de är tillgängliga. Rekommenderade åldersanpassade cancerundersökningar diskuterades. Influensavaccin administrerades idag.`,
    tags: ['årlig undersökning', 'förebyggande vård'],
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
    content: `Patienten upplever ökande knäsmärta, särskilt i höger knä. Rapporterar att smärtan är värre vid trappklättring och efter långvarig gång. Minimal lindring med receptfria NSAID.
    
    Undersökning visar mild svullnad i höger knä. Rörelseomfång begränsat av smärta. Ingen rodnad eller ökad värme.
    
    Röntgenresultat (från förra månaden): Måttliga degenerativa förändringar, osteofytbildning, minskad ledspringa förenlig med artros.
    
    Bedömning: Artros i höger knä med akut försämring.
    
    Plan: Förskrivet meloxikam 15 mg dagligen med magsskydd. Diskuterade viktminskningsstrategier. Remiss till sjukgymnastik för förstärkningsövningar. Överväg ortopedisk konsultation om ingen förbättring sker inom 4-6 veckor.`,
    tags: ['artros', 'smärthantering', 'knäsmärta'],
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