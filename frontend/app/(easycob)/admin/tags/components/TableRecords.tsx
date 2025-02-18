"use client";
import "@/app/assets/css/tabs.css";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SkeletonTable from "@/app/(easycob)/components/SkeletonTable";
import Pagination from "@/app/(easycob)/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITag } from "../interfaces/tag";
import FormTag from "./FormTag";
import { Button } from "@/components/ui/button";
import { LuTag } from "react-icons/lu";

const ColorBox = ({ color }: { color: string }) => (
  <div
    style={{
      width: 30,
      height: 20,
      backgroundColor: color,
      borderRadius: 4,
      border: "1px solid #ccc",
    }}
  />
);

export default function TableRecords({
  data,
  pending,
  updateTag,
  error,
}: {
  data: ITag[];
  pending: boolean;
  updateTag: (tagId: number, updatedTag: Partial<ITag>) => Promise<void>;
  error: string | null;
}) {
  return (
    <Card>
      <CardContent>
        {/* Skeleton com transição de opacidade */}
        <div
          className={`inset-0 transition-opacity duration-1000 ${
            pending ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <SkeletonTable rows={data.length} />
        </div>
        {/* Tabela com transição de opacidade */}
        <div
          className={`transition-opacity duration-1000 ${
            pending ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.validity}</TableCell>
                  <TableCell>
                    <ColorBox color={tag.color} />
                  </TableCell>
                  <TableCell>
                    <FormTag
                      tag={tag}
                      updateTag={updateTag}
                      isLoading={pending}
                      error={error}
                    >
                      <Button className="mx-1" variant={"secondary"}>
                        <LuTag />
                      </Button>
                    </FormTag>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter
        className={`flex justify-end transition-opacity duration-1000 ${
          pending ? "opacity-0 hidden" : "opacity-100"
        }`}
      ></CardFooter>
    </Card>
  );
}
