import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";

const Greetings = ({ user }) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 6 && hours < 12) {
      setGreeting("Buenos días");
    } else if (hours >= 12 && hours < 19) {
      setGreeting("Buenas tardes");
    } else {
      setGreeting("Buenas noches");
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center pt-5">
      <Avatar>
        <AvatarImage src={user.foto_url} />
        <AvatarFallback>{user?.nombres?.substring(0, 2) ?? "??"}</AvatarFallback>
      </Avatar>
      <h1 className="text-center font-semibold text-xl px-5 my-3">{`¡${greeting}, ${user?.nombres} ${user?.apellidos}!`}</h1>
    </div>
  );
};

export default Greetings;

Greetings.propTypes = {
  user: PropTypes.object,
};
