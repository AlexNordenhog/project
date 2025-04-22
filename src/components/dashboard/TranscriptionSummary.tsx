import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FilePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { useTranscriptionsStore } from "../../store/transcriptionsStore";

const TranscriptionSummary: React.FC = () => {
  const navigate = useNavigate();
  const { transcriptions, fetchTranscriptions } = useTranscriptionsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranscriptions = async () => {
      await fetchTranscriptions();
      setLoading(false);
    };

    loadTranscriptions();
  }, [fetchTranscriptions]);

  const handleViewTranscriptions = () => {
    navigate("/transcriptions");
  };

  const handleNewTranscription = () => {
    navigate("/transcriptions/new");
  };

  const draftCount = transcriptions.filter((t) => t.status === "draft").length;
  const finalCount = transcriptions.filter((t) => t.status === "final").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Transkription</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "..." : transcriptions.length}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="text-xs">
            <span className="font-medium text-success-600">{finalCount}</span>{" "}
            Färdiga
          </div>
          <div className="text-xs">
            <span className="font-medium text-warning-600">{draftCount}</span>{" "}
            Påbörjade
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewTranscriptions}
          >
            Visa Alla
          </Button>
          <Button size="sm" onClick={handleNewTranscription}>
            <FilePlus className="h-4 w-4 mr-1" />
            Ny
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionSummary;
