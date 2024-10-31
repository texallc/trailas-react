
import { Empty, Table } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import useGet from "../../hooks/useGet";
import { Get } from "../../interfaces";
import { TableProps } from "../../interfaces/components/serverTable";
import Filters from "./filters";
import FormControlProvider from "../../context/formControl";

const ServerTable = <T extends { id: string; }>({ url, columns, filters }: TableProps<T>) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = searchParams.get('pagina') || 1;
  const limit = searchParams.get('limite') || 10;

  const completeUrl = useMemo(() => {
    let _url = url || `${pathname}/lista`;

    for (const param of searchParams) {
      if (!_url.includes("?")) {
        _url += `?${param[0]}=${param[1]}`;
        continue;
      };

      _url += `&${param[0]}=${param[1]}`;
    }

    return _url;
  }, [searchParams]);

  const { response, loading } = useGet<Get<T>>({ url: completeUrl });

  return (
    <>
      {
        filters && <FormControlProvider<T>
          itemsProp={filters}
        >
          <Filters />
        </FormControlProvider>
      }
      <br />
      <Table
        sticky
        scroll={{ x: 400 }}
        columns={columns}
        dataSource={response?.list}
        loading={loading}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Sin registros.' /> }}
        rowKey="id"
        pagination={{
          total: response?.total,
          current: +page,
          pageSize: +limit,
          onChange: (_page: number, pageSize: number) => {
            navigate({
              search: `?pagina=${_page}&limite=${pageSize}`
            });
          },
          showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} de ${total} registros.`,
          locale: { items_per_page: '/ página' },
          showSizeChanger: true
        }}
      />
    </>

  );
};

export default ServerTable;