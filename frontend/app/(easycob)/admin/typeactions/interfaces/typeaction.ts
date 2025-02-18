import { IAction } from "@/app/(easycob)/interfaces/actions";

export interface ITypeAction {
    id: number;
    abbreviation: string;
    name: string;
    categoryActionId: number;
    commissioned: number;
    type: string;
    timelife: number;
    active: boolean;
    createdAt: string; // Ou Date
    updatedAt: string; // Ou Date
    category?: number; // Se você precisar da categoria na interface do TypeAction
    actions?: IAction[]; // Se você precisar das actions na interface do TypeAction
  }