"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { resetDemoData } from "@/lib/demo-data";

export function DemoResetButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  function confirmReset() {
    if (!resetDemoData()) return setFeedback("Não foi possível restaurar os dados agora. Tente novamente.");
    setOpen(false);
    window.location.assign("/");
  }

  return <div><AlertDialog open={open} onOpenChange={setOpen}><AlertDialogTrigger asChild><Button variant="outline" size="sm"><RotateCcw className="size-4" />Restaurar dados demonstrativos</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Restaurar a demonstração?</AlertDialogTitle><AlertDialogDescription>Esta ação remove chamados, comentários, avaliações, tentativas e preferências criados neste navegador. Os exemplos fixos da central de suporte não serão alterados.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={confirmReset}>Restaurar dados</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog><p aria-live="polite" className={feedback ? "mt-2 text-sm text-red-700" : "sr-only"}>{feedback}</p></div>;
}
