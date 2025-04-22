import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { usePatientsStore } from "../../store/patientsStore";

const PatientSummary: React.FC = () => {
  const navigate = useNavigate();
  const { patients, fetchPatients } = usePatientsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      await fetchPatients();
      setLoading(false);
    };

    loadPatients();
  }, [fetchPatients]);

  const handleViewPatients = () => {
    navigate("/patients");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Patienter</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "..." : patients.length}
        </div>
        <p className="text-xs text-muted-foreground">
          Antal registrerade patienter
        </p>
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleViewPatients}
          >
            Visa Patienter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSummary;
