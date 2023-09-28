"use client";
import React, { useMemo, useState } from "react";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Column, useTable } from "react-table";
import { DraggableRow } from "./DraggableRow";

type TableProps<T> = {
    columns: Column[]
    data: T[]
    setData: React.Dispatch<React.SetStateAction<T[]>>
}

export const Table = <T,>({ columns, data, setData }: TableProps<T>) => {
    const [activeId, setActiveId] = useState<null | number>();

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        // @ts-ignore
        data
    });

    const items = useMemo(() => (rows? rows.map((el, i) => el?.id || i) : []), [rows]);

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const handleDragStart = (event: { active: any, over: any }) => {
        setActiveId(event.active.id);
    }

    const handleDragEnd = (event: { active: any, over: any }) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setData((data) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(data, oldIndex, newIndex);
            })
        }

        setActiveId(null);
    }

    const handleDragCancel = () => {
        setActiveId(null);
    }

    const selectedRow = useMemo(() => {
        if (!activeId) {
            return null;
        }
        // @ts-ignore
        const row = rows.find((el) => el.original.id === activeId);

        if (row) {
            prepareRow(row);
        }

        return row;
    }, [activeId, rows, prepareRow]);

    return (
        <div className="relative overflow-hidden max-w-[900px] w-full bg-slate-100 p-1 rounded-md">

            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
                <div className="relative w-full overflow-x-auto">
                    <table className="w-full" {...getTableProps()}>
                        <thead className="">
                            {headerGroups.map((headerGroup) => (
                                <tr
                                    className="border-gray-900 border-solid border-b"
                                    {...headerGroup.getHeaderGroupProps()}
                                    key={headerGroup.getHeaderGroupProps().key}
                                >
                                    <th
                                        className="w-[40px] px-4 py-2"
                                    />
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            className="text-gray-700 px-4 py-2"
                                            {...column.getHeaderProps()}
                                            key={column.getHeaderProps().key}
                                        >

                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()} className="relative overflow-hidden">
                            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                {rows.map((row) => {
                                    prepareRow(row);
                                    return <DraggableRow key={row.getRowProps().key} row={row} id={row.id} />;
                                })}
                            </SortableContext>

                            <DragOverlay wrapperElement="tr" zIndex={0} className="relative "  >

                                {(activeId && selectedRow) && (
                                    <div className="relative z-10 ">

                                        <table className="w-full">
                                            <tbody>
                                                <tr {...selectedRow.getRowProps()}>
                                                    <td className=" w-[40px]">
                                                        <div
                                                            className="w-full h-full flex items-center justify-center"
                                                        >
                                                            <span
                                                                className={`h-2 w-4 border-blue-400 border-solid border-b-2 border-t-2 p-0.5`}

                                                            />
                                                        </div>
                                                    </td>
                                                    {selectedRow.cells.map((cell, i) => {
                                                        return (
                                                            <td
                                                                {...cell.getCellProps()}
                                                                key={cell.getCellProps().key}
                                                                className="w-[20ch] text-center z-0 text-blue-400"
                                                            >
                                                                {cell.render("Cell")}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </DragOverlay>
                        </tbody>
                    </table>


                </div>

            </DndContext>
        </div>
    );
}