import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import useCollection, { PropsUseCollection } from "../../../hooks/useCollection";
import { Input, Select, Space } from "antd";

interface Props {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  setSearch: Dispatch<SetStateAction<string>>;
  onLoadCategories: (categories: string[]) => void;
}

const FiltersTrailas = ({ category, setCategory, setSearch, onLoadCategories }: Props) => {
  const propsUseCollectionCategory = useMemo<PropsUseCollection>(() => {
    return {
      collection: "trailaCategories",
      query: [],
    };
  }, []);
  const { data: filtersCategories, loading: loadingCategories } = useCollection<{ categories: string[]; }>(propsUseCollectionCategory);

  useEffect(() => {
    if (!filtersCategories.length) return;

    onLoadCategories(filtersCategories[0].categories);
  }, [filtersCategories, onLoadCategories]);

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