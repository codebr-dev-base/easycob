import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function SkeletonTable({ rows }: { rows: number }) {
  const rowsArray: JSX.Element[] = [];

  for (let i = 0; i < rows; i++) {
    rowsArray.push(
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="w-full flex justify-center">
            <Button variant={'ghost'} className="mx-1">
            </Button>
          </Skeleton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="p-1">
            <Skeleton className="w-full flex justify-center">
              <Button variant={'ghost'} className="mx-1">
              </Button>
            </Skeleton>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsArray}</TableBody>
    </Table>
  );
}