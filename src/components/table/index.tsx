import { useEffect, useMemo } from 'react';
import { Empty, Table as TableAnt } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PropsUseCollection } from "../../hooks/useCollection";
import useOnSnapshot from "../../hooks/useOnSnapshot";

interface Props<T> extends PropsUseCollection {
	columns: ColumnsType<T>;
	placeholderSearch?: string;
	pathEdit: string;
	onLoadData?: (data: T[]) => void;
}

const { PRESENTED_IMAGE_SIMPLE } = Empty;

const Table = <T extends {}>({ columns: columnsProps, onLoadData, ...props }: Props<T>) => {
	const { loading, data } = useOnSnapshot<T>(props);

	useEffect(() => {
		if (loading) return;

		onLoadData?.(data);
	}, [loading, data, onLoadData]);

	const columns = useMemo<ColumnsType<T>>(() => {
		const columns = columnsProps.map(c => ({ ...c, width: c.width || 150 }));

		/* columns.push({
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
		});
 */
		return columns;
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