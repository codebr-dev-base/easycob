"use client";
import { IMeta, IQueryPaginationParams } from "@/app/interfaces/pagination";
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
import { HeaderTable } from "@/app/(easycob)/components/HeaderTable";
import Tooltips from "@/app/(easycob)/components/Tooltips";
import {
  formatDateToBR,
  formatStringToCpfCnpj,
  formatCurrencyToBRL,
  formatarFone,
} from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaTrash, FaUser } from "react-icons/fa";
import { ISkillModule, IUser } from "@/app/interfaces/auth";
import { FormUser } from "./FormUser";
import { FormPassword } from "./FormPassword";
import { RiLockPasswordFill } from "react-icons/ri";
import { AlertDelete } from "./AlertDelete";

export default function TableRecords({
  meta,
  data,
  refresh,
  query,
  pending,
  modules,
}: {
  meta: IMeta;
  data: IUser[];
  refresh: () => {};
  query: IQueryPaginationParams;
  pending: boolean;
  modules: ISkillModule[];
}) {
  const setColorRow = (user: IUser) => {
    if (!user.isActived) {
      return "text-slate-400";
    }
    return "";
  };

  return (
    <Card>
      <CardContent>
        {/* Skeleton com transição de opacidade */}
        <div
          className={`inset-0 transition-opacity duration-1000 ${
            pending ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <SkeletonTable
            rows={meta && meta.perPage ? meta.perPage : query.perPage}
          />
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
                <TableHead>
                  <HeaderTable
                    columnName="Id"
                    fieldName="id"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Nome"
                    fieldName="name"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Email"
                    fieldName="email"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="CPF"
                    fieldName="cpf"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>
                  <HeaderTable
                    columnName="Telefone"
                    fieldName="phone"
                    query={query}
                    refresh={refresh}
                  />
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id} className={setColorRow(user)}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="max-w-28 md:max-w-36 lg:max-w-48">
                    <Tooltips message={user.name ? user.name : ""}>
                      <p className="truncate hover:text-clip">{user.name}</p>
                    </Tooltips>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatStringToCpfCnpj(user.cpf)}</TableCell>

                  <TableCell>{formatarFone(user.phone)}</TableCell>
                  <TableCell>
                    <FormUser refresh={refresh} user={user} modules={modules}>
                      <Button className="mx-1">
                        <FaUser />
                      </Button>
                    </FormUser>
                    <FormPassword refresh={refresh} user={user}>
                      <Button className="mx-1">
                        <RiLockPasswordFill />
                      </Button>
                    </FormPassword>
                    <AlertDelete user={user} refresh={refresh} />
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
      >
        <Pagination meta={meta} query={query} refresh={refresh} />
      </CardFooter>
    </Card>
  );
}
