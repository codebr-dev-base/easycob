import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { IUserChannel } from "../../interfaces/action";
import { Button } from "@/components/ui/button";
import { RxArrowDown, RxArrowUp, RxCaretSort } from "react-icons/rx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateToBR } from "@/app/lib/utils";
import { query } from "../../service/actions";

export default function TableRecords({
  userData,
}: {
  userData: IUserChannel[];
}) {
  const [users, setUsers] = useState(userData);
  const [descending, setDescending] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<number | string>("userName");

  const toggleSorting = (key: keyof IUserChannel) => {
    setOrderBy(key);
    const sortedUsers = [...users].sort((a, b) => {
      const valueA =
        typeof a[key] === "string" ? parseInt(a[key] as string) : a[key];
      const valueB =
        typeof b[key] === "string" ? parseInt(b[key] as string) : b[key];

      if (!descending) return valueB - valueA; // Ordem descendente
      return valueA - valueB; // Ordem ascendente
    });

    setDescending(!descending);
    setUsers(sortedUsers);
  };

  useEffect(() => {
    setUsers([...userData]);
  }, [userData]);

  function getBackgroundClass(
    user: IUserChannel,
    currentColumn: keyof IUserChannel
  ): string | undefined {
    const { activeCount, dialerCount, whatsappCount, nullCount } = user;

    const counts = {
      activeCount,
      dialerCount,
      whatsappCount,
      nullCount,
    };

    const maxCount = Math.max(...Object.values(counts));
    console.log(currentColumn)
    console.log(maxCount)
    console.log(Number(counts[currentColumn]))


    // Retorna a classe somente se a coluna atual for a que possui o maior valor
    if (Number(counts[currentColumn]) === maxCount) {
      switch (currentColumn) {
        case "activeCount":
          return "bg-green-100";
        case "dialerCount":
          return "bg-green-100";
        case "whatsappCount":
          return "bg-green-100";
        case "nullCount":
          return "bg-green-100";
      }
    }

    // Caso não seja o maior valor, retorna undefined
    return undefined;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acionamentos</CardTitle>
        <CardDescription>Com e sem Canal</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 p-0"
                  onClick={() => {
                    toggleSorting("userName");
                  }}
                >
                  Name
                  {orderBy != "userName" ? (
                    <RxCaretSort className="ml-2 h-4 w-4" />
                  ) : descending == false ? (
                    <RxArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <RxArrowUp className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 p-0"
                  onClick={() => {
                    toggleSorting("activeCount");
                  }}
                >
                  Ativo
                  {orderBy != "activeCount" ? (
                    <RxCaretSort className="ml-2 h-4 w-4" />
                  ) : descending == false ? (
                    <RxArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <RxArrowUp className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 p-0"
                  onClick={() => {
                    toggleSorting("dialerCount");
                  }}
                >
                  Discador
                  {orderBy != "dialerCount" ? (
                    <RxCaretSort className="ml-2 h-4 w-4" />
                  ) : descending == false ? (
                    <RxArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <RxArrowUp className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 p-0"
                  onClick={() => {
                    toggleSorting("whatsappCount");
                  }}
                >
                  Whatsapp
                  {orderBy != "whatsappCount" ? (
                    <RxCaretSort className="ml-2 h-4 w-4" />
                  ) : descending == false ? (
                    <RxArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <RxArrowUp className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 p-0"
                  onClick={() => {
                    toggleSorting("nullCount");
                  }}
                >
                  Nulos
                  {orderBy != "nullCount" ? (
                    <RxCaretSort className="ml-2 h-4 w-4" />
                  ) : descending == false ? (
                    <RxArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <RxArrowUp className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 p-0"
                  onClick={() => {
                    toggleSorting("total");
                  }}
                >
                  Total
                  {orderBy != "total" ? (
                    <RxCaretSort className="ml-2 h-4 w-4" />
                  ) : descending == false ? (
                    <RxArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <RxArrowUp className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user.userId}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell
                    className={getBackgroundClass(user, "activeCount")}
                  >
                    {user.activeCount}
                  </TableCell>
                  <TableCell
                    className={getBackgroundClass(user, "dialerCount")}
                  >
                    {user.dialerCount}
                  </TableCell>
                  <TableCell
                    className={getBackgroundClass(user, "whatsappCount")}
                  >
                    {user.whatsappCount}
                  </TableCell>
                  <TableCell
                    className={getBackgroundClass(user, "nullCount")}
                  >
                    {user.nullCount}
                  </TableCell>
                  <TableCell>{user.total}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 font-medium leading-none">
          Perído de valiação:
        </div>
        <div className="leading-none text-muted-foreground">
          {`${formatDateToBR(query.startDate)} - ${formatDateToBR(
            query.endDate
          )}`}
        </div>
      </CardFooter>
    </Card>
  );
}
