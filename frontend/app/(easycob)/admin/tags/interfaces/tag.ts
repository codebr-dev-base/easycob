import { IClient } from "@/app/(easycob)/interfaces/clients";
import { use } from 'react';

export interface ITag {
    id: number;
    name: string;
    initials: string;
    validity: number; // Pode ser number ou null
    color: string;
    user?: string;
    createdAt: string; // Ou Date, dependendo de como você quer trabalhar com datas no frontend
    updatedAt: string; // Ou Date
    clients?: IClient[]; // Se você precisar dos clientes na interface da tag
  }
  
