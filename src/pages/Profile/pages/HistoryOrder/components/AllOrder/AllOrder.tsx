import { Table, TableColumnsType, theme } from 'antd'
import { createStyles } from 'antd-style'
interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
}
export default function AllOrder() {
  const useStyle = createStyles(({ css, token }) => {
    return {
      customTable: css`
        .ant-table {
          .ant-table-container {
            .ant-table-body,
            .ant-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          }
        }
      `
    }
  })
  const { styles } = useStyle()
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Full Name',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left'
    },
  
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>action</a>
    }
  ]

  const dataSource: DataType[] = [
    { key: '1', name: 'Olivia', age: 32, address: 'New York Park' },
    { key: '2', name: 'Ethan', age: 40, address: 'London Park' }
  ]

  return (
    <Table<DataType>
      className={styles.customTable}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 'max-content' }}
    />
  )
}
