import { Dispatch, SetStateAction, useMemo } from "react";
import useCollection, { PropsUseCollection } from "../../../hooks/useCollection";
import { Input, Select, Space } from "antd";

interface Props {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const FiltersTrailas = ({ category, setCategory, search, setSearch }: Props) => {
  const propsUseCollectionCategory = useMemo<PropsUseCollection>(() => {
    return {
      collection: "trailaCategories",
      query: [],
    };
  }, []);
  const { data: filtersCategories, loading: loadingCategories } = useCollection<{ categories: string[]; }>(propsUseCollectionCategory);

  return (
    <Space.Compact style={{ width: "100%" }}>
      <Select
        style={{ width: "50%" }}
        loading={loadingCategories}
        value={category}
        onChange={setCategory}
        allowClear
      >
        {
          filtersCategories[0]?.categories?.map(c => (
            <Select.Option key={c}>{c}</Select.Option>
          ))
        }
      </Select>
      <Input.Search
        placeholder="Buscar por nombre"
        allowClear
        onSearch={(value) => setSearch(value)}
        style={{ width: "100%" }}
        enterButton
      />
    </Space.Compact>
  );
};

export default FiltersTrailas;