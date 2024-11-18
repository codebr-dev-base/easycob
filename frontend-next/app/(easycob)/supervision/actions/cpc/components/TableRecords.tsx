import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { IUserAndCpc } from "../../interfaces/action";
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
  userData: IUserAndCpc[];
}) {
  const [users, setUsers] = useState(userData);
  const [descending, setDescending] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<number | string>("userName");

  const toggleSorting = (key: keyof IUserAndCpc) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acionamentos</CardTitle>
        <CardDescription>Com e sem CPC</CardDescription>
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
                    toggleSorting("cpc");
                  }}
                >
                  CPC
                  {orderBy != "cpc" ? (
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
                    toggleSorting("ncpc");
                  }}
                >
                  NCPC
                  {orderBy != "ncpc" ? (
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
                    className={
                      user.cpc > user.ncpc ? "bg-green-100" : undefined
                    }
                  >
                    {user.cpc}
                  </TableCell>
                  <TableCell
                    className={
                      user.ncpc > user.cpc ? "bg-green-100" : undefined
                    }
                  >
                    {user.ncpc}
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
