import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FilePlus, Search } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";
import { useTranscriptionsStore } from "../store/transcriptionsStore";

const TranscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { transcriptions, fetchTranscriptions } = useTranscriptionsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadTranscriptions = async () => {
      await fetchTranscriptions();
      setLoading(false);
    };

    loadTranscriptions();
  }, [fetchTranscriptions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const filteredTranscriptions = transcriptions.filter((transcription) => {
    // Apply search filter
    const matchesSearch =
      transcription.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transcription.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transcription.tags &&
        transcription.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    // Apply tab filter
    if (activeTab === "draft") {
      return matchesSearch && transcription.status === "draft";
    } else if (activeTab === "final") {
      return matchesSearch && transcription.status === "final";
    }

    return matchesSearch;
  });

  const handleCreateNew = () => {
    navigate("/transcriptions/new");
  };

  const handleViewTranscription = (id: string) => {
    navigate(`/transcriptions/${id}`);
  };

  return (
    <div className="space-y-6 pl-[10%]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Transkriptioner</h1>
          <p className="text-muted-foreground">
            Hantera och granska dina transkriptioner här.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button onClick={handleCreateNew}>
            <FilePlus className="mr-2 h-4 w-4" />
            Ny Transkription
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs
            defaultValue="all"
            className="w-full md:w-auto"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">Alla</TabsTrigger>
              <TabsTrigger value="draft">Pågående</TabsTrigger>
              <TabsTrigger value="final">Klara</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök transkriptioner..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Laddar transkriptioner...</p>
          </div>
        ) : filteredTranscriptions.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">
                Inga transkriptioner hittade
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search term"
                  : "Get started by creating a new transcription"}
              </p>
              {!searchTerm && (
                <Button className="mt-4" onClick={handleCreateNew}>
                  Skapa ny transkription
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTranscriptions.map((transcription) => (
              <motion.div
                key={transcription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer h-full hover:shadow-md transition-shadow"
                  onClick={() => handleViewTranscription(transcription.id)}
                >
                  <CardHeader className="pb-3 flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {transcription.patientName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transcription.date)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        transcription.status === "final" ? "success" : "warning"
                      }
                    >
                      {transcription.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {transcription.content}
                    </p>
                    {transcription.tags && transcription.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-3">
                        {transcription.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TranscriptionsPage;
