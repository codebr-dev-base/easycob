'use client';
import { useCallback, useState } from "react";
import { fetchAuth } from "@/app/lib/fetchAuth";
import * as dotEnv from "dotenv";
import { isEqual } from "@/app/lib/utils";
import { ITag } from "../interfaces/tag";
import { da } from 'date-fns/locale';

dotEnv.config();

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const urn = "/v1/tag";
const baseUrl = `${apiUrl}${urn}`;

export const useTagsService = ({ initialData }: { initialData: ITag[] }) => {
  const [tags, setTags] = useState<ITag[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth<ITag[]>(baseUrl);
      if (result.success && result.data) {
        setTags(result.data);
      } else {
        setError(result.error || "Falha ao buscar tags.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTag = async (tagId: number, updatedTag: Partial<ITag>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth(`${baseUrl}/${tagId}`, {
        method: "PUT",
        body: JSON.stringify(updatedTag),
      });

      if (result.success) {
        setTags((prevTags) =>
          prevTags.map((tag) =>
            tag.id === tagId ? { ...tag, ...updatedTag } : tag
          )
        );
      } else {
        setError(result.error || "Falha ao atualizar tag.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTag = async (tagId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth(`${baseUrl}/${tagId}`, {
        method: "DELETE",
      });

      if (result.success) {
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
      } else {
        setError(result.error || "Falha ao deletar tag.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTag = async (newTag: Partial<ITag>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuth(baseUrl, {
        method: "POST",
        body: JSON.stringify(newTag),
      });

      console.log("Result:", result);

      if (result.success) {
        setTags((prevTags) => [result.data.data, ...prevTags]);
      } else {
        setError(result.error || "Falha ao criar tag.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { tags, setTags, isLoading, error, fetchTags, updateTag, deleteTag, createTag };
};
