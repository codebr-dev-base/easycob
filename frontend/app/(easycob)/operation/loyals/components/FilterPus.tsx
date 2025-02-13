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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { IQueryLoyalParams } from "../interfaces/loyal";

function useFetchOptions(
  fetchFunction: () => Promise<{ value: string }[]>,
  defaultValue: string[] = []
) {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option[]>(() => {
    if (defaultValue.length > 0) {
      return defaultValue.map((value) => ({
        label: value,
        value,
      }));
    }
    return [];
  });

  useEffect(() => {
    fetchFunction().then((result) =>
      setOptions(
        result.map((item) => ({ label: item.value, value: item.value }))
      )
    );
  }, []);

  return { options, selected, setSelected };
}

function KeywordSearch({
  query,
  refresh,
}: {
  query: IQueryLoyalParams;
  refresh: (newParams: Partial<IQueryLoyalParams>) => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    refresh({ keyword: e.target.value, page: 1 });
  };

  return (
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
          onChange={handleChange}
          defaultValue={query.keyword}
        />
      </div>
    </Label>
  );
}

function FilterSection({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: Option[];
  selected: Option[];
  onChange: (value: Option[]) => void;
}) {
  return (
    <div className="flex flex-col">
      <Label>{label}:</Label>
      <MultipleSelector
        value={selected}
        onChange={onChange}
        defaultOptions={options}
        hidePlaceholderWhenSelected
        placeholder={label}
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            nenhum resultado encontrado.
          </p>
        }
      />
    </div>
  );
}

export default function FilterPus({
  query,
  refresh,
}: {
  query: IQueryLoyalParams;
  refresh: (newParams: Partial<IQueryLoyalParams>) => void;
}) {
  const faixaTempos = useFetchOptions(fetchFaixaTempos, query.faixaClusters ? query.faixaClusters : []);
  const faixaValores = useFetchOptions(fetchFaixaValores, query.faixaValores ? query.faixaValores : []);
  const faixaTitulos = useFetchOptions(fetchFaixaTitulos, query.faixaTitulos ? query.faixaTitulos : []);
  const classClusters = useFetchOptions(fetchFaixaClusters, query.faixaClusters ? query.faixaClusters : []);
  const unidades = useFetchOptions(fetchUnidades, query.unidades ? query.unidades : []);
  const situacoes = useFetchOptions(fetchSituacoes, query.situacoes ? query.situacoes : []);

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({ variant: "secondary" })}>
        <TbFilterPlus />
      </PopoverTrigger>
      <PopoverContent align={"end"} className="w-96">
        <Card>
          <div className="flex text-2xl px-2">
            <h3>Filtros</h3>
          </div>
          <CardContent className="p-2 space-y-2">
            <KeywordSearch query={query} refresh={refresh} />
            <FilterSection
              label="Faixas de tempo"
              {...faixaTempos}
              onChange={(value) => {
                faixaTempos.setSelected(value);
                refresh({
                  faixaTempos: value.map((item) => item.value),
                  page: 1,
                });
              }}
            />
            <FilterSection
              label="Faixas de valores"
              {...faixaValores}
              onChange={(value) => {
                faixaValores.setSelected(value);
                refresh({
                  faixaValores: value.map((item) => item.value),
                  page: 1,
                });
              }}
            />
            <FilterSection
              label="Faixas de títulos"
              {...faixaTitulos}
              onChange={(value) => {
                faixaTitulos.setSelected(value);
                refresh({
                  faixaTitulos: value.map((item) => item.value),
                  page: 1,
                });
              }}
            />
            <FilterSection
              label="Clusters"
              {...classClusters}
              onChange={(value) => {
                classClusters.setSelected(value);
                refresh({
                  faixaClusters: value.map((item) => item.value),
                  page: 1,
                });
              }}
            />
            <FilterSection
              label="Unidade"
              {...unidades}
              onChange={(value) => {
                unidades.setSelected(value);
                refresh({ unidades: value.map((item) => item.value), page: 1 });
              }}
            />
            <FilterSection
              label="Situação"
              {...situacoes}
              onChange={(value) => {
                situacoes.setSelected(value);
                refresh({
                  situacoes: value.map((item) => item.value),
                  page: 1,
                });
              }}
            />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
