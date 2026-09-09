import { mockTickets } from "@/data/mockTickets";
import { getCustomTickets } from "@/lib/storage";
import { isSupportProfile } from "@/lib/demo-access";

export function loadSupportTickets() {
  if (!isSupportProfile()) return [];
  return [...getCustomTickets(), ...mockTickets];
}

// Os mocks pertencem exclusivamente à central de suporte no MVP.
// Eles ainda fazem parte do código entregue ao navegador e não devem conter dados reais.
