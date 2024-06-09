import { useMemo } from 'react';
import { Empty, Table as TableAnt } from 'antd';
import { ColumnsType } from 'antd/es/table';
import useCollection, { PropsUseCollection } from "../../hooks/useCollection";
import TableActionsButtons from "./tableActionsButtons";
import { useTraila } from "../../context/trailaContext";

interface Props<T> extends PropsUseCollection {
	columns: ColumnsType<T>;
	placeholderSearch?: string;
	pathEdit: string;
}

export interface Get<T> {
	total: number;
	list: Array<T>;
}

const { PRESENTED_IMAGE_SIMPLE } = Empty;

const Table = <T extends {}>({ columns: columnsProps, ...props }: Props<T>) => {
	const { loading, data } = useCollection<T>(props);

	const columns = useMemo<ColumnsType<T>>(() => {
		return [
			...columnsProps.map(c => ({ ...c, width: c.width || 150 })),
			{
				title: 'Acciones',
				key: 'actions',
				fixed: 'right',
				width: 100,
				render: (_, record: T) => {
					const r = record as T & { id: string; };

					return (
						<TableActionsButtons
							record={record}
							onDeleted={() => { }}
							fun={async () => { }}
							pathEdit={""}
						/>
					);
				},
			}
		];
	}, [columnsProps]);

	return (
		<div>
			<TableAnt
				sticky
				scroll={{ x: 400 }}
				columns={columns}
				dataSource={data}
				loading={loading}
				locale={{ emptyText: <Empty image={PRESENTED_IMAGE_SIMPLE} description='Sin registros.' /> }}
				rowKey="id"
			/>
		</div>
	);
};

export default Table;