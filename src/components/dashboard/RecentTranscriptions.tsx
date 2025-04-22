import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useTranscriptionsStore } from "../../store/transcriptionsStore";
import { format, parseISO } from "date-fns";

const RecentTranscriptions: React.FC = () => {
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

  // Get the 3 most recent transcriptions
  const recentTranscriptions = [...transcriptions]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )
    .slice(0, 3);

  const handleViewTranscription = (id: string) => {
    navigate(`/transcriptions/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return formatDate(dateString);
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Senaste Transkriptionerna
        </CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Ladda transkriptioner...</p>
          </div>
        ) : recentTranscriptions.length === 0 ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">
              Inga transkriptioner tillgängliga
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTranscriptions.map((transcription) => (
              <div
                key={transcription.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">
                    {transcription.patientName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(transcription.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      transcription.status === "final" ? "success" : "warning"
                    }
                  >
                    {transcription.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(transcription.lastUpdated)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewTranscription(transcription.id)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate("/transcriptions")}
        >
          Visa Alla Transkiptioner
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentTranscriptions;
