type ColumnAccessor<D> = (row: D) => React.ReactNode;

export type TableColumn<D> = {
  accessor: ColumnAccessor<D>;
  name: string;
}

export type TableRow<D> = {
  data: D;
  id: string;
}

type TableProps<D> = {
  rows: TableRow<D>[];
  columns: TableColumn<D>[];
  isLoading: boolean;
}

export function Table<D>({ rows, columns, isLoading }: TableProps<D>) {
  return isLoading ? (
    <p>Loading</p>
  ) : (
    <table>
      <thead>
        <tr>
          {columns.map((column, i) => (
            <th key={column.name === "" ? i : column.name}>
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={`${row.id}${column.name}`}>{column.accessor(row.data)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}