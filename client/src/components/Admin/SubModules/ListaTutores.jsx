import React, { useContext, useEffect, useState } from "react";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";

const ListaTutores = () => {
  const [isLoadingTutors, setIsLoadinTutors] = useState(false);
  const [tutorsByModule, setTutorsByModule] = useState([]);

  const { toast } = useToast();
  const { user } = useContext(MainContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadinTutors(true);
      try {
        const response = await fetch(`${URL_BASE}/admin/allTutorsByModule`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTutorsByModule(data.length ? data : []);
          console.log(data);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los tutores.",
          duration: 2500,
        });
      } finally {
        setIsLoadinTutors(false);
      }
    };

    fetchData();
  }, []);

  return <div>ListaTutores</div>;
};

export default ListaTutores;
