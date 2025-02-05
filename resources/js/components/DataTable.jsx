import React from "react";
import { useTable } from "react-table";
import {
    Bars2Icon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/solid";

export default function DataTable({ columns, data, useSortBy }) {
    const tableInstance = useTable(
        {
            columns,
            data,
        },
        useSortBy
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    return (
        <table {...getTableProps()} className="w-full table-auto">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                )}
                                className="px-4 py-2 text-left text-sm uppercase font-semibold text-lime-600 border-b border-lime-600"
                            >
                                {column.render("Header")}
                                <span>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <ChevronDownIcon className="w-5 h-5 inline ml-1" />
                                        ) : (
                                            <ChevronUpIcon className="w-5 h-5 inline ml-1" />
                                        )
                                    ) : (
                                        <Bars2Icon className="w-5 h-5 inline ml-1" />
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td
                                    {...cell.getCellProps()}
                                    className="border-b border-slate-300 px-4 py-2 text-left"
                                >
                                    {cell.render("Cell")}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
