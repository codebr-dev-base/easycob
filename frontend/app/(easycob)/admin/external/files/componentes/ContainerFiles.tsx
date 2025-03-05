"use client";
import { IPaginationResponse } from "@/app/interfaces/pagination";
import { IFile, IQueryFileParams } from "../interfaces/files";
import useFilesService from "../service/use-files-service";
import Header from "@/app/(easycob)/components/Header";
import { use, useCallback, useEffect } from "react";
import { FileUploadDialog } from "./FileUploadDialog";
import { handlerError } from "@/app/lib/error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { de } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import TableRecords from "./TableRecords";

interface PropsContainerFiles {
  initialData: IPaginationResponse<IFile>;
  initialQuery: IQueryFileParams;
}
export default function ContainerFiles({
  initialData,
  initialQuery,
}: PropsContainerFiles) {
  const {
    files,
    setFiles,
    isLoading,
    error,
    detailsError,
    fetchFiles,
    queryParams,
    setQueryParams,
    uploadFile,
  } = useFilesService({ initialData, initialQuery });

  const refresh = useCallback(
    (newParams: Partial<IQueryFileParams>) => {
      setQueryParams(newParams);
      fetchFiles();
    },
    [setQueryParams, fetchFiles]
  );

  useEffect(() => {
    if (error) {
      handlerError(error);
    }
  }, [error]);

  useEffect(() => {
    if (detailsError) {
      handlerError(detailsError);
    }
  }, [detailsError]);

  if (!files || !initialData) {
    return (
      <div className="w-full h-full">
        <span>Api indisponível</span>
      </div>
    );
  }

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Arquivos base externa de dados">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FileUploadDialog isLoading={isLoading} uploadFile={uploadFile} />
            {/*           <FilterPus
              query={queryParams.current as IQueryLoyalParams}
              refresh={refresh}
            /> */}
          </div>
        </Header>
      </div>

      <main className="p-2">
        {detailsError && (
          <Card className="flex flex-col gap-2 text-red-500">
            <CardHeader>
              <CardTitle>Possíveis erros no arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(detailsError)
                ? detailsError.map((item, index) => (
                    <div key={index}>
                      <p>{item}</p>
                      <Separator className="my-1" />
                    </div>
                  ))
                : detailsError}
            </CardContent>
          </Card>
        )}
        <TableRecords
          files={files}
          query={queryParams.current as IQueryFileParams}
          refresh={refresh}
          pending={isLoading}
        />
      </main>
    </article>
  );
}
