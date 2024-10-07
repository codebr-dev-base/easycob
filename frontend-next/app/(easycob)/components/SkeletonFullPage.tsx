import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonFullPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="space-y-2 w-full max-w-lg flex flex-col items-center justify-center">
        {/* 20 Skeletons com variações de largura */}
        <Skeleton className="h-6 w-11/12" />
        <Skeleton className="h-6 w-9/12" />
        <Skeleton className="h-6 w-10/12" />
        <Skeleton className="h-6 w-8/12" />
        <Skeleton className="h-6 w-7/12" />
        <Skeleton className="h-6 w-6/12" />
        <Skeleton className="h-6 w-5/12" />
        <Skeleton className="h-6 w-10/12" />
        <Skeleton className="h-6 w-9/12" />
        <Skeleton className="h-6 w-11/12" />
        <Skeleton className="h-6 w-10/12" />
        <Skeleton className="h-6 w-9/12" />
        <Skeleton className="h-6 w-8/12" />
        <Skeleton className="h-6 w-7/12" />
        <Skeleton className="h-6 w-6/12" />
        <Skeleton className="h-6 w-10/12" />
        <Skeleton className="h-6 w-5/12" />
        <Skeleton className="h-6 w-8/12" />
        <Skeleton className="h-6 w-9/12" />
        <Skeleton className="h-6 w-10/12" />
      </div>
    </div>
  );
}
