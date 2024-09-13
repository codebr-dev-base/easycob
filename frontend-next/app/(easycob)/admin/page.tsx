import Header from "../components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaUserPlus, FaSearch, FaKey, FaCheck, FaUser } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaEllipsis, FaPencil, FaUserXmark } from "react-icons/fa6";

const dummyData = [
  {
    id: 1,
    email: "jonah@email.com",
    name: "Jonah Rex",
    active: true,
    level: "Admin",
  },
  {
    id: 2,
    email: "maryjane@email.com",
    name: "Mary Jane Watson",
    active: true,
    level: "Operator",
  },
  {
    id: 3,
    email: "spiderman@email.com",
    name: "Peter Parker",
    active: true,
    level: "Supervisor",
  },
];

export default function Admin() {
  return (
    <>
      <Header title="Controle de usuários">
        <div className="flex justify-end items-center gap-4">
          <div className="inline-flex items-center group">
            <div className="bg-white flex items-center justify-center rounded rounded-r-none mt-1 p-3 border ring-offset-background group-focus:ring-2">
              <FaSearch className="text-foreground" />
            </div>
            <Input
              name="query"
              placeholder="Nome de usuário"
              className="rounded-l-none"
              autoComplete="username"
            />
          </div>
          <Button variant="ghost" className="bg-white space-x-2">
            <FaUserPlus className="text-foreground" />
            <span className="text-foreground">Novo usuário</span>
          </Button>
        </div>
      </Header>
      <div className="bg-white min-h-[calc(100%-80px)] p-6">
        <div className="rounded-lg border overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                <TableHead className="text-white">
                  <div className="flex w-full items-center gap-2">
                    <FaKey /> <span>Id</span>
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex w-full items-center gap-2">
                    <FiMail /> Email
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex w-full items-center gap-2">
                    <FaUser /> Nome
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex w-full items-center gap-2">
                    <FaCheck /> Status
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex w-full items-center gap-2">
                    <FaCheck /> Nível
                  </div>
                </TableHead>
                <TableHead className="text-white">
                  <div className="flex w-full items-center gap-2">Ações</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyData.map((data) => {
                return (
                  <TableRow key={data.id}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>{data.email}</TableCell>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.active ? "Ativo" : "Inativo"}</TableCell>
                    <TableCell>{data.level}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button className="p-1 size-8">
                          <FaPencil />
                        </Button>
                        <Button variant="muted" className="p-1 size-8">
                          <FaEllipsis />
                        </Button>
                        <Button variant="destructive" className="p-1 size-8">
                          <FaUserXmark />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
