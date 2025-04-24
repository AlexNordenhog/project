import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Save,
  FileText,
  CheckCircle,
  Tag,
  Calendar,
  User,
  User2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useTranscriptionsStore } from "../store/transcriptionsStore";

const TranscriptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transcriptions, getTranscriptionById, updateTranscription } =
    useTranscriptionsStore();

  const [transcription, setTranscription] = useState(
    getTranscriptionById(id || "")
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!transcription) {
      navigate("/transcriptions");
    } else {
      setEditContent(transcription.content);
    }
  }, [transcription, navigate]);

  if (!transcription) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleGoBack = () => {
    navigate("/transcriptions");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(transcription.content);
  };

  const handleSave = async () => {
    setSaving(true);

    await updateTranscription(transcription.id, {
      content: editContent,
    });

    // Update local state
    setTranscription({
      ...transcription,
      content: editContent,
      lastUpdated: new Date().toISOString(),
    });

    setIsEditing(false);
    setSaving(false);
  };

  const handleFinalize = async () => {
    setSaving(true);

    await updateTranscription(transcription.id, {
      status: "final",
    });

    // Update local state
    setTranscription({
      ...transcription,
      status: "final",
      lastUpdated: new Date().toISOString(),
    });

    setSaving(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();

      const tags = transcription.tags || [];

      if (!tags.includes(newTag.trim().toLowerCase())) {
        updateTranscription(transcription.id, {
          tags: [...tags, newTag.trim().toLowerCase()],
        });

        // Update local state
        setTranscription({
          ...transcription,
          tags: [...tags, newTag.trim().toLowerCase()],
          lastUpdated: new Date().toISOString(),
        });
      }

      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const tags = transcription.tags || [];
    const newTags = tags.filter((tag) => tag !== tagToRemove);

    updateTranscription(transcription.id, {
      tags: newTags,
    });

    // Update local state
    setTranscription({
      ...transcription,
      tags: newTags,
      lastUpdated: new Date().toISOString(),
    });
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
              {transcription.patientName}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(transcription.date)}
              <Badge
                variant={
                  transcription.status === "final" ? "success" : "warning"
                }
                className="ml-2"
              >
                {transcription.status}
              </Badge>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit} disabled={saving}>
                <Edit2 className="h-4 w-4 mr-2" />
                Redigera
              </Button>
              {transcription.status === "draft" && (
                <Button onClick={handleFinalize} disabled={saving}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {saving ? "Processing..." : "Finalize"}
                </Button>
              )}
            </>
          )}
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
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2 text-primary-600" />
                <h2 className="text-lg font-medium">Transkription</h2>
              </div>

              {isEditing ? (
                <textarea
                  className="w-full h-96 p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              ) : (
                <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md font-mono text-sm leading-relaxed h-96 overflow-y-auto">
                  {transcription.content}
                </div>
              )}
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

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {transcription.patientName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Patient ID: {transcription.patientId}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <User2 className="h-5 w-5 mr-2 text-primary-600" />
                <h2 className="text-lg font-medium">Doctor</h2>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {transcription.doctorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Doctor ID: {transcription.doctorId}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 mr-2 text-primary-600" />
                <h2 className="text-lg font-medium">Tags</h2>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {transcription.tags &&
                    transcription.tags.map((tag, index) => (
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
                    placeholder="Add tag (press Enter)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TranscriptionDetailPage;
