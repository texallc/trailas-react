import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import useCollection, { PropsUseCollection } from "../../../hooks/useCollection";
import { Form, Input, Select, Space } from "antd";
import { orderBy } from "firebase/firestore";
import { DefaultOptionType } from "antd/es/select";
import { dataSizesTire } from "../../../constants";
import { TrailaFilters } from "../../../interfaces/traila";

interface Props {
  setFilters: Dispatch<SetStateAction<TrailaFilters>>;
  onLoadCategories: (categories: string[]) => void;
  onLoadDrivers: (drivers: string[]) => void;
}

const FiltersTrailas = ({ setFilters, onLoadCategories, onLoadDrivers }: Props) => {
  const propsUseCollectionCategories = useMemo<PropsUseCollection>(() => {
    return {
      collection: "trailaCategories",
      query: [],
    };
  }, []);
  const propsUseCollectionDrivers = useMemo<PropsUseCollection>(() => {
    return {
      collection: "drivers",
      query: [orderBy("name")],
    };
  }, []);

  const { data: filtersCategories, loading: loadingCategories } = useCollection<{ categories: string[]; }>(propsUseCollectionCategories);
  const { data: filtersDrivers, loading: loadingDrivers } = useCollection<{ name: string; }>(propsUseCollectionDrivers);

  const optionsDataSizesTires: DefaultOptionType[] = dataSizesTire.map(sizesTire => ({ title: sizesTire, value: sizesTire }));

  useEffect(() => {
    if (!filtersCategories.length) return;

    onLoadCategories(filtersCategories[0].categories);
  }, [filtersCategories, onLoadCategories]);

  useEffect(() => {
    if (!filtersDrivers.length) return;

    onLoadDrivers(filtersDrivers.map(d => d.name));
  }, [filtersDrivers, onLoadDrivers]);

  return (
    <Form
    >
      <Space.Compact style={{ width: "100%" }}>
        <Select
          style={{ width: "25%" }}
          loading={loadingCategories}
          onChange={value => setFilters(prev => ({ ...prev, category: value }))}
          allowClear
          options={filtersCategories[0]?.categories?.map(c => ({ label: c, value: c }))}
          placeholder="Categorías"
        />

        <Select
          style={{ width: "25%" }}
          options={optionsDataSizesTires}
          onChange={value => setFilters(prev => ({ ...prev, sizesTires: value }))}
          allowClear
          placeholder="Tipo de llanta"
        />
        <Select
          style={{ width: "25%" }}
          loading={loadingDrivers}
          onChange={value => setFilters(prev => ({ ...prev, driver: value }))}
          allowClear
          options={filtersDrivers.map(d => ({ label: d.name, value: d.name }))}
          placeholder="Choferes"
        />
        <Input.Search
          placeholder="Buscar por nombre"
          allowClear
          onSearch={value => setFilters(prev => ({ ...prev, name: value }))}
          style={{ width: "100%" }}
          enterButton
        />
      </Space.Compact>
    </Form>

  );
};

export default FiltersTrailas;