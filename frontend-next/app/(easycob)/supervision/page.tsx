import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TabSms from "./components/TabSms";

export default function Supervision() {
  return (
    <section>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="flex justify-center bg-white">
          <TabsTrigger value="account">Campanha SMS</TabsTrigger>
          <TabsTrigger value="password">Campanha Email</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="px-4">
          <TabSms />
        </TabsContent>
        <TabsContent value="password" className="px-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
