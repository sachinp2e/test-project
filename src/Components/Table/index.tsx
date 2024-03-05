import { SortIcon } from '@/Assets/svg';
import { Table } from 'react-bootstrap';
import './table.scss';
import { sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import Activity from '@/Assets/_images/transaction.png';
import Image from 'next/image';

interface ICustomTable {
  data: any[];
  columns: any[];
  className?: string;
  loading?: boolean;
  wantIndex?: boolean;
}

type IColumn = {
  id: string | number;
  key: string;
  value: string;
  label?: string;
  renderCell?: (data: any | string) => React.ReactNode;
  isSort: boolean;
  flex?: number;
  flexBasis?: string;
  className?: string;
  width?: string;
  minWidth?: string;
};

type ITR = {
  columns: IColumn[];
  rowData: any;
  tableIndex: number;
  loading?: boolean;
};

const TR: React.FC<ITR> = (props) => {
  const { columns, rowData, tableIndex } = props;

  return (
    <tr>
      {columns?.map((column, index) => {
        return (
          <td
            key={index}
            className={`align-baseline ${column.className || ''}`}
            style={{
              flex: column.flex ?? 1,
              flexBasis: column.flexBasis ?? '100%',
              maxWidth: column.width,
              minWidth: column.minWidth,
            }}
          >
            {
              column.value == "activityMessage" && 
              <Image
                src={Activity}
                alt="user activity transactions"
                quality={100}
                style={{ marginRight: '20px' }}
              />
            }
            
            {index === 0 && !!tableIndex && tableIndex}
            {typeof column.renderCell === 'function'
              ? column.renderCell(rowData)
              : rowData[column.value]}
          </td>
        );
      })}
    </tr>
  );
};

const CustomTable: React.FC<ICustomTable> = ({
  data = [],
  columns = [],
  className,
  loading,
  wantIndex = false,
}) => {
  const [tableData, setTableData] = useState(data);
  const [selectedCol, setSelectedCol] = useState('');

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const onSort = (column: any) => {
    if (selectedCol === column.value) {
      setTableData((prev) => {
        return [...prev].reverse();
      });
    } else {
      setSelectedCol(column.value);
      setTableData((prev) => sortBy(prev, column.value));
    }
  };

  return (
    <div className="table-container">
      <Table className="custom-table table-borderless" responsive>
        <thead>
          <tr className={className}>
            {columns?.map((column: IColumn, index: number) => {
              return (
                <th
                  key={index}
                  className={`${column.className || ''}`}
                  style={{
                    flex: column.flex ?? 1,
                    flexBasis: column.flexBasis ?? '100%',
                    maxWidth: column.width,
                    minWidth: column.minWidth,
                  }}
                >
                  <div className='sorting-icon-container'>{column.label}</div>
                  {column.isSort && (
                    <span
                      onClick={() => onSort(column)}
                      className="sorting-icon ms-1"
                    >
                      <SortIcon />
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                <span className="loader" />
              </td>
            </tr>
          ) : tableData?.length ? (
            (tableData || [])?.map((row: any, index: number) => {
              return (
                <TR
                  rowData={row}
                  // rowData={<img src={Activity} alt="" />}
                  key={index}
                  columns={columns}
                  tableIndex={wantIndex ? index + 1 : 0}
                />
              );
            })
          ) : (
            <tr className="d-flex justify-content-center">
              <p className="my-4">No Data Found</p>
            </tr>
            
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomTable;
