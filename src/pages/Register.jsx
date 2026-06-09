import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Registro no disponible</h1>
        <p className="text-muted-foreground mb-6">
          El registro de nuevos usuarios está desactivado. Contacta al administrador.
        </p>
        <Link to="/login">
          <Button className="w-full">Ir al Login</Button>
        </Link>
      </div>
    </div>
  );
}