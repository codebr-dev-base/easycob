import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

import { TbFilterPlus } from "react-icons/tb";
import { Card, CardContent } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { ChangeEvent, useEffect, useState } from "react";
import {
  fetchFaixaClusters,
  fetchFaixaTempos,
  fetchFaixaTitulos,
  fetchFaixaValores,
  fetchSituacoes,
  fetchUnidades,
} from "../service/loyals";
import { IQueryLoyalParams } from "../interfaces/loyal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";

export default function FilterPus({
  query,
  refresh,
}: {
  query: IQueryLoyalParams;
  refresh: () => void;
}) {
  //faixaTempo
  const [optsFaixaTempos, setOptsFaixaTempos] = useState<Option[]>([]);
  const [selectFaixaTempos, setSelectFaixaTempos] = useState<Option[]>([]);

  //faixaValor
  const [optsFaixaValores, setOptsFaixaValores] = useState<Option[]>([]);
  const [selectFaixaValores, setSelectFaixaValores] = useState<Option[]>([]);

  //faixaTitulos
  const [optsFaixaTitulos, setOptsFaixaTitulos] = useState<Option[]>([]);
  const [selectFaixaTitulos, setSelectFaixaTitulos] = useState<Option[]>([]);

  //classCluster
  const [optsClassCluster, setOptsClassCluster] = useState<Option[]>([]);
  const [selectClassCluster, setSelectClassCluster] = useState<Option[]>([]);

  //unidade
  const [optsUnidade, setOptsUnidade] = useState<Option[]>([]);
  const [selectUnidade, setSelectUnidade] = useState<Option[]>([]);

  //classSitcontr
  const [optsSituacoes, setOptsSituacoes] = useState<Option[]>([]);
  const [selectSituacoes, setSelectSituacoes] = useState<Option[]>([]);

  useEffect(() => {
    fetchFaixaTempos().then((resul: { faixaTempo: string }[]) => {
      const opts: Option[] = [];

      if (resul) {
        resul.forEach((faixa) => {
          opts.push({ label: faixa.faixaTempo, value: `${faixa.faixaTempo}` });
        });
        setOptsFaixaTempos(opts);
      }
    });

    fetchFaixaValores().then((resul: { faixaValor: string }[]) => {
      const opts: Option[] = [];

      if (resul) {
        resul.forEach((faixa) => {
          opts.push({ label: faixa.faixaValor, value: `${faixa.faixaValor}` });
        });
        setOptsFaixaValores(opts);
      }
    });

    fetchFaixaTitulos().then((resul: { faixaTitulos: string }[]) => {
      const opts: Option[] = [];

      if (resul) {
        resul.forEach((faixa) => {
          opts.push({
            label: faixa.faixaTitulos,
            value: `${faixa.faixaTitulos}`,
          });
        });
        setOptsFaixaTitulos(opts);
      }
    });

    fetchFaixaClusters().then((resul: { classCluster: string }[]) => {
      const opts: Option[] = [];

      if (resul) {
        resul.forEach((faixa) => {
          opts.push({
            label: faixa.classCluster,
            value: `${faixa.classCluster}`,
          });
        });
        setOptsClassCluster(opts);
      }
    });

    fetchUnidades().then((resul: { unidade: string }[]) => {
      const opts: Option[] = [];

      if (resul) {
        resul.forEach((faixa) => {
          opts.push({ label: faixa.unidade, value: `${faixa.unidade}` });
        });
        setOptsUnidade(opts);
      }
    });

    fetchSituacoes().then((resul: { classSitcontr: string }[]) => {
      const opts: Option[] = [];

      if (resul) {
        resul.forEach((faixa) => {
          opts.push({
            label: faixa.classSitcontr,
            value: `${faixa.classSitcontr}`,
          });
        });
        setOptsSituacoes(opts);
      }
    });
  }, []);

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "keyword") {
      query.keyword = e.target.value;
      query.page = 1;
      refresh();
    }
  };

  const handleChangeColumn = (value: string) => {
    query.keywordColumn = value;
  };

  const handleChangeSelectFaixaTempos = () => {
    const values = selectFaixaTempos.map((item) => {
      return item.value;
    });
    query.faixaTempos = values;
  };

  const handleChangeSelectFaixaValores = () => {
    const values = selectFaixaValores.map((item) => {
      return item.value;
    });
    query.faixaValores = values;
  };

  const handleChangeSelectFaixaTitulos = () => {
    const values = selectFaixaTitulos.map((item) => {
      return item.value;
    });
    query.faixaTitulos = values;
  };

  const handleChangeSelectClassCluster = () => {
    const values = selectClassCluster.map((item) => {
      return item.value;
    });
    query.faixaClusters = values;
  };

  const handleChangeSelectUnidade = () => {
    const values = selectUnidade.map((item) => {
      return item.value;
    });
    query.unidades = values;
  };

  const handleChangeSelectSituacoes = () => {
    const values = selectSituacoes.map((item) => {
      return item.value;
    });
    query.situacoes = values;
  };

  useEffect(() => {
    handleChangeSelectFaixaTempos();
    handleChangeSelectFaixaValores();
    handleChangeSelectFaixaTitulos();
    handleChangeSelectClassCluster();
    handleChangeSelectUnidade();
    handleChangeSelectSituacoes();
    query.page = 1;
    refresh();
  }, [
    selectFaixaTempos,
    selectFaixaValores,
    selectFaixaTitulos,
    selectClassCluster,
    selectUnidade,
    selectSituacoes,
  ]);

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({ variant: "secondary" })}>
        <TbFilterPlus />
      </PopoverTrigger>
      <PopoverContent align={"end"} className="w-96">
        <Card>
          <div className="flex text-2xl px-2">
            <h3>Filtos</h3>
          </div>
          <CardContent className="p-2 space-y-2">
            <div className="flex w-full">
              <Label className="w-full">
                Buscar cliente:
                <div className="flex">
                  <div className="bg-white flex items-center justify-center rounded rounded-r-none mt-1 p-3 border ring-offset-background group-focus:ring-2">
                    <FaSearch className="text-foreground" />
                  </div>
                  <Input
                    name="keyword"
                    placeholder="Buscar.."
                    className="rounded-l-none"
                    onChange={handleChangeKeyword}
                    defaultValue={query.keyword}
                  />
                </div>
              </Label>
            </div>
            <div className="flex">
              <RadioGroup
                defaultValue={query.keywordColumn}
                onValueChange={handleChangeColumn}
              >
                <div className="grid grid-cols-3 gap-3 col-span-3">
                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="nomClien" />
                    <span>Nome</span>
                  </Label>

                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="desContr" />
                    <span>Contrato</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col">
              <Label>Faixas de tempo:</Label>

              <MultipleSelector
                value={selectFaixaTempos}
                onChange={setSelectFaixaTempos}
                defaultOptions={optsFaixaTempos}
                hidePlaceholderWhenSelected
                placeholder="Faixas de tempo:"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    nenhum resultado encontrado.
                  </p>
                }
              />
            </div>

            <div className="flex flex-col">
              <Label>Faixas de valores:</Label>

              <MultipleSelector
                value={selectFaixaValores}
                onChange={setSelectFaixaValores}
                defaultOptions={optsFaixaValores}
                hidePlaceholderWhenSelected
                placeholder="Faixas de valores"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    nenhum resultado encontrado.
                  </p>
                }
              />
            </div>

            <div className="flex flex-col">
              <Label>Faixas de títulos:</Label>

              <MultipleSelector
                value={selectFaixaTitulos}
                onChange={setSelectFaixaTitulos}
                defaultOptions={optsFaixaTitulos}
                hidePlaceholderWhenSelected
                placeholder="Faixas de títulos"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    nenhum resultado encontrado.
                  </p>
                }
              />
            </div>

            <div className="flex flex-col">
              <Label>Clusters:</Label>

              <MultipleSelector
                value={selectClassCluster}
                onChange={setSelectClassCluster}
                defaultOptions={optsClassCluster}
                hidePlaceholderWhenSelected
                placeholder="Clusters"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    nenhum resultado encontrado.
                  </p>
                }
              />
            </div>

            <div className="flex flex-col">
              <Label>Unidade:</Label>

              <MultipleSelector
                value={selectUnidade}
                onChange={setSelectUnidade}
                defaultOptions={optsUnidade}
                hidePlaceholderWhenSelected
                placeholder="Unidade"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    nenhum resultado encontrado.
                  </p>
                }
              />
            </div>

            <div className="flex flex-col">
              <Label>Situação:</Label>

              <MultipleSelector
                value={selectSituacoes}
                onChange={setSelectSituacoes}
                defaultOptions={optsSituacoes}
                hidePlaceholderWhenSelected
                placeholder="Situação"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    nenhum resultado encontrado.
                  </p>
                }
              />
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
