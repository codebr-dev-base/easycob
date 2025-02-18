"use client";
import Header from "@/app/(easycob)/components/Header";
import { ITag } from "../interfaces/tag";
import { useTagsService } from "../service/use-tags-service";
import FormTag from "./FormTag";
import TableRecords from "./TableRecords";
import { Button } from "@/components/ui/button";
import { LuTag } from "react-icons/lu";

const ContainerTag = ({ initialData }: { initialData: ITag[] }) => {
  const {
    tags,
    isLoading,
    error,
    updateTag,
    deleteTag,
    createTag,
  } = useTagsService({ initialData });

  return (
    <article className="max-w-full">
      <div className="p-2">
        <Header title="Tags">
          <div className="flex flex-col md:flex-row justify-end items-end gap-4">
            <FormTag
              createTag={createTag}
              updateTag={updateTag}
              isLoading={isLoading}
              error={error}
            >
              <Button className="mx-1" variant={"secondary"}>
                <LuTag />
              </Button>
            </FormTag>
          </div>
        </Header>
      </div>

      <main className="p-2">
        <TableRecords
          data={tags}
          pending={isLoading}
          error={error}
          updateTag={updateTag}
        />
      </main>
    </article>
  );
};

export default ContainerTag;