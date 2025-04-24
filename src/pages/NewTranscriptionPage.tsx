import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Save,
  User,
  Calendar,
  Tag,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useTranscriptionsStore } from "../store/transcriptionsStore";
import { usePatientsStore } from "../store/patientsStore";
import { useAuthStore } from "../store/authStore";
import { format } from "date-fns";

const NewTranscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTranscription } = useTranscriptionsStore();
  const { patients, fetchPatients } = usePatientsStore();
  const { user } = useAuthStore();

  const [content, setContent] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [microphone, setMicrophone] = useState("");

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Get the selected patient
  const selectedPatient = patients.find((patient) => patient.id === patientId);

  const handleGoBack = () => {
    navigate("/transcriptions");
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();

      if (!tags.includes(newTag.trim().toLowerCase())) {
        setTags([...tags, newTag.trim().toLowerCase()]);
      }

      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);

    // This would normally connect to the browser's speech recognition API
    // For demo purposes, we'll just toggle the state
    if (!isRecording) {
      // Simulate recording by adding placeholder text after a delay
      setTimeout(() => {
        if (content === "") {
          setContent(
            "Patienten uppvisar symtom på...\n\nPatienten nämner också...\n\nPatienten nämner också..."
          );
        } else {
          setContent(content + "\n\nPatient also mentions...");
        }
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleSave = async () => {
    if (!patientId || !content) {
      alert("Please select a patient and add content before saving.");
      return;
    }

    setSaving(true);

    const selectedPatient = patients.find(
      (patient) => patient.id === patientId
    );

    if (!selectedPatient) {
      alert("Selected patient not found.");
      setSaving(false);
      return;
    }

    try {
      await addTranscription({
        appointmentId: `temp-${Date.now()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        doctorId: user?.id || "1",
        doctorName: user?.name || "Dr. Jane Smith",
        date,
        content,
        tags,
        status: "draft",
      });

      navigate("/transcriptions");
    } catch (error) {
      console.error("Error saving transcription:", error);
      alert("An error occurred while saving the transcription.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pl-[10%]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              New Transcription
            </h1>
            <p className="text-muted-foreground">
              Skapa en ny transkription för en patient
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isRecording ? "danger" : "outline"}
            onClick={toggleRecording}
            className={isRecording ? "bg-error-600 hover:bg-error-700" : ""}
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stoppa Inspelning
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Starta Inspelning
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!patientId || !content || saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="md:col-span-3"
        >
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Transkriptionsinnehåll
                </label>
                <textarea
                  className="w-full h-96 p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter transcription or use voice recording..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* New Diagnosis Proposal Box */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Förslagen Diagnos</h2>
                  <Button
                    onClick={() =>
                      ((
                        document.getElementById(
                          "diagnosis-textarea"
                        ) as HTMLTextAreaElement
                      ).value =
                        "UlteriaAI föreslår följande diagnos...\n\nDenna diagnos grundas i följande...")
                    }
                  >
                    Generera Diagnos Förslag
                  </Button>
                </div>
                <textarea
                  id="diagnosis-textarea"
                  className="w-full h-48 p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter diagnosis proposal..."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                <h2 className="text-lg font-medium">Patient</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Välj Patient
                  </label>
                  <select
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  >
                    <option value="">-- Välj en patient --</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPatient && (
                  <div className="text-xs text-muted-foreground">
                    <p>Date of Birth: {selectedPatient.dateOfBirth}</p>
                    <p>Contact: {selectedPatient.contact.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* New Microphone Selection Box */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Mic className="h-5 w-5 mr-2 text-primary-600" />
                <h2 className="text-lg font-medium">Mikrofon Enhet</h2>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium mb-1">
                  Select Microphone
                </label>
                <select
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={microphone}
                  onChange={(e) => setMicrophone(e.target.value)}
                >
                  <option value="">-- Välj en Mikrofon --</option>
                  <option value="mic1">Mic 1 (Room 4)</option>
                  <option value="mic2">Mic 2 (Room 5)</option>
                  <option value="mic3">Mic 3 (Room 6)</option>
                  <option value="mic4">Mic 4 (Room 7)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                <h2 className="text-lg font-medium">Datum</h2>
              </div>

              <div>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 mr-2 text-primary-600" />
                <h2 className="text-lg font-medium">Taggar</h2>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs flex items-center group"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-400 hover:text-error-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <Input
                    placeholder="Lägg till Tagg (Tryck Enter)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  Vanliga Taggar:
                  <button
                    className="ml-1 text-primary-500 hover:underline"
                    onClick={() =>
                      !tags.includes("follow-up") &&
                      setTags([...tags, "follow-up"])
                    }
                  >
                    Uppföljning
                  </button>
                  ,
                  <button
                    className="ml-1 text-primary-500 hover:underline"
                    onClick={() =>
                      !tags.includes("medication") &&
                      setTags([...tags, "medication"])
                    }
                  >
                    Medicin
                  </button>
                  ,
                  <button
                    className="ml-1 text-primary-500 hover:underline"
                    onClick={() =>
                      !tags.includes("lab-results") &&
                      setTags([...tags, "lab-results"])
                    }
                  >
                    lab-resultat
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NewTranscriptionPage;
