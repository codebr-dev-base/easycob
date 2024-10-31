"use client";

import { IContact } from "@/app/(easycob)/interfaces/clients";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatarFone } from "@/app/lib/utils";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { FormContactPhone } from "./forms/FormContactPhone";
import { BsHandThumbsUp } from "react-icons/bs";

export function TabsContacts({
  constacts,
  selectContact,
  setSelectContact,
  refresh,
}: {
  constacts: { phones: IContact[]; emails: IContact[] };
  selectContact: IContact | null;
  setSelectContact: (value: IContact | null) => void;
  refresh: () => void;
}) {
  const handleSelectContact = (contact: IContact) => {
    if (selectContact && selectContact.id === contact.id) {
      setSelectContact(null);
    } else {
      setSelectContact(contact);
    }
  };

  const selectColor = (contact: IContact) => {
    if (contact.blockAll) {
      return "text-purple-800";
    }

    if (contact.block) {
      return "text-red-800";
    }

    if (contact.isWhatsapp) {
      return "text-green-800";
    }

    return "";
  };

  return (
    <Tabs defaultValue="phones" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="phones">Telefone</TabsTrigger>
        <TabsTrigger value="emails">Email</TabsTrigger>
      </TabsList>
      <TabsContent value="phones">
        <ScrollArea className="h-36 w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>NLA</TableHead>
                <TableHead>%</TableHead>
                <TableHead>CPC</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {constacts.phones.map((phone) => (
                <TableRow key={phone.id} className={selectColor(phone)}>
                  <TableCell>
                    <Switch
                      checked={!!selectContact && selectContact.id === phone.id}
                      onCheckedChange={() => {
                        handleSelectContact(phone);
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex space-x-1">
                    <div className="flex pt-2">
                      <span className="pt-1">
                        {phone.isWhatsapp ? <FaWhatsapp /> : <FiPhone />}
                      </span>
                      <span
                        className={
                          phone.block || phone.blockAll ? "line-through" : ""
                        }
                      >
                        {formatarFone(phone.contato)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{phone.countAtender}</TableCell>
                  <TableCell>{phone.percentualAtender}</TableCell>
                  <TableCell>
                    {phone.cpc && (
                      <span className="flex pl-4 ">
                        {" "}
                        <BsHandThumbsUp />{" "}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <FormContactPhone contact={phone} refresh={refresh} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="emails">
        <ScrollArea className="h-36 w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>CPC</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {constacts.emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>
                    <Switch
                      checked={!!selectContact && selectContact.id === email.id}
                      onCheckedChange={() => {
                        handleSelectContact(email);
                      }}
                    />
                  </TableCell>
                  <TableCell className="flex space-x-1">
                    <span className="pt-1">
                      <IoMailOutline />
                    </span>
                    <span>{email.contato}</span>
                  </TableCell>
                  <TableCell>{email.cpc}</TableCell>

                  <TableCell>btn</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
