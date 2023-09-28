import React from 'react'
import { Roboto } from 'next/font/google'
import { Table } from '#components/components/DraggableTable/Table'

const inter = Roboto({ weight: ["400", "500", "700"], subsets: ['latin'] })

export type Person = {
    name: string,
    type: string,
    prepTime: string,
    serve: number,
    id: string
}

const makeData = (n: number) => {
    return new Array(n).fill(0).map((_, i) => ({ name: `Lastname ${i}`, type: `Name ${i}`, prepTime: `${i} min`, serve: i, id: i.toString() })) as Person[]
}


const columns = [
    {
        Header: "Last Name",
        accessor: "name"
    },
    {
        Header: "Name",
        accessor: "type"
    },
    {
        Header: "Time",
        accessor: "prepTime"
    },
    {
        Header: "Days",
        accessor: "serve"
    }
]



export default function TablePage() {
    const [data,setData] = React.useState(makeData(10))
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-2  ${inter.className}`}
        >

            <Table data={data} columns={columns} setData={setData} />
        </main>
    )
}