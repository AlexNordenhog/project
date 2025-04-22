import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useAppointmentsStore } from "../../store/appointmentsStore";
import { format } from "date-fns";

const AppointmentsSummary: React.FC = () => {
  const navigate = useNavigate();
  const { fetchAppointments, getUpcomingAppointments } = useAppointmentsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      await fetchAppointments();
      setLoading(false);
    };

    loadAppointments();
  }, [fetchAppointments]);

  const upcomingAppointments = getUpcomingAppointments().slice(0, 3);

  const handleViewAppointments = () => {
    navigate("/appointments");
  };

  const getAppointmentTime = (date: string, time: string) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];

    if (date === today) {
      return `Today at ${formatTime(time)}`;
    } else if (date === tomorrow) {
      return `Tomorrow at ${formatTime(time)}`;
    } else {
      return `${format(new Date(date), "MMM d")} at ${formatTime(time)}`;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case "check-up":
        return "default";
      case "follow-up":
        return "secondary";
      case "emergency":
        return "error";
      case "consultation":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Kommande Möten</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Ladda Möten...</p>
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Inga kommande möten</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">
                    {appointment.patientName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getAppointmentTime(appointment.date, appointment.time)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getAppointmentTypeColor(appointment.type) as any}
                  >
                    {appointment.type.replace("-", " ")}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/appointments/${appointment.id}`)}
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
          onClick={handleViewAppointments}
        >
          Visa Alla Möten
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentsSummary;
