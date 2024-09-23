/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { FormEvent, HTMLProps, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaFileCsv } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FormTemplate } from "./FormTemplate";
import { FormSms } from "./FormSms";
import { IQueryCampaignParams, ITemplateSms } from "../interfaces/campaign";
import { fetchTemplate } from "../service/campaigns";
import { FormEmail } from "./FormEmail";

export function DialogCampaign({
  query: queryCampaign,
  refresh: refreshCampaign,
  type,
}: {
  query: IQueryCampaignParams;
  refresh: () => Promise<void>;
  type: string;
}) {
  const [template, setTemplate] = useState<ITemplateSms | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState<boolean>(false);
  const [templates, setTemplates] = useState<ITemplateSms[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTemplate().then((result) => {
      setTemplates(result);
      if (templates.length > 0) {
        setTemplate(templates[0]);
      }
    });
  }, []);

  const refreshTemplates = async () => {
    setPending(true);
    const result = await fetchTemplate();
    setTemplates(result);
    if (templates.length > 0) {
      setTemplate(templates[0]);
    }
    setShowTemplateForm(false);
    setPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-white space-x-2">
          <FaFileCsv className="text-foreground" />
          <span className="text-foreground">Nova</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full md:min-w-max">
        <DialogHeader>
          <DialogTitle>Nova Campanha</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {type === "SMS" ? (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:min-w-[325px] lg:min-w-[325px] m-1">
              <FormSms
                templates={templates}
                setShowTemplateForm={setShowTemplateForm}
                setTemplate={setTemplate}
                showTemplateForm={showTemplateForm}
                pending={pending}
                setOpen={setOpen}
                queryCampaign={queryCampaign}
                refreshCampaign={refreshCampaign}
              />
            </div>

            {showTemplateForm && (
              <div className="w-full md:min-w-[325px] lg:min-w-[325px] m-1">
                <FormTemplate
                  templete={template}
                  setTemplate={setTemplate}
                  refreshTemplates={refreshTemplates}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:min-w-[325px] lg:min-w-[325px] m-1">
            <FormEmail
                pending={pending}
                setOpen={setOpen}
                queryCampaign={queryCampaign}
                refreshCampaign={refreshCampaign}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
